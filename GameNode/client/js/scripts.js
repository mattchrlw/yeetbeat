/** Progress circle for song progress. */
var circle;

/** Handler functions fired when the view is changed to a particular view. */
const viewHandlers = {
    game: initGame,
    room: loadAutoComp,
    settings: loadAutoComp,
}

var textURL = document.getElementById("playlistURL");
textURL.onkeyup = function () {
    var hidden = document.getElementById("playlistURLvalue");
    hidden.value = textURL.value;
}

function pushHistory(id) {
    const href = window.location.href;
    history.pushState({title: id, id}, "YeetBeet - " + id, href);
}

window.addEventListener('popstate', function (ev) {
    if (ev.state) {
        console.log(`Changing view to ${ev.state.id} from history.`);
        _showView(ev.state.id);
        ev.preventDefault();
    }
});

/**
 * Changes the active view to the given view, hiding other views.
 * Shows/hides back button depending on if page is home page.
 *
 * @param {string} id View ID (without hash)
 */
function changeView(id) {
    console.log(`Changing view to ${id} normally.`);
    pushHistory(id);
    _showView(id);
}

function _showView(id) {
    const old = document.querySelector('.active');
    old.style.animation = 'fadeOut 0.2s ease forwards';
    old.classList.remove('active');

    const next = document.querySelector('#' + id);
    next.classList.add('active');
    next.style.animation = 'fadeIn 0.2s ease forwards';

    // fire handler if defined
    if (viewHandlers[id]) {
        console.log("... firing event handler");
        viewHandlers[id]();
    }

    // TODO: use history API.
    const back = document.querySelector('#back-btn');
    if (id !== 'home') {
        back.classList.remove('invisible');
    } else {
        back.classList.add('invisible');
    }
}


function startSong(songDetails) {
    if (circle) {
        circle.destroy();
    }
    const duration = songDetails.duration;
    circle = new ProgressBar.Circle('.circle', {
        strokeWidth: 6,
        easing: 'linear',
        duration: duration,
        trailWidth: 1,
        svgStyle: {
            // transform: 'rotate(180deg)'
        },
        from: { color: '#dc0000', remaining: 0 },
        to: { color: '#32a852', remaining: duration/1000 },
        step: function(state, circle) {
            circle.path.setAttribute('stroke', state.color);
            circle.setText(Math.ceil(state.remaining));
        },
        text: {
            className: 'circle-text',
        }
    });
    circle.set(1);
    circle.animate(0);  // Number from 0.0 to 1.0
}

function initGame() {
    startSong({duration: 100000});
}

function loadAutoComp() {
    fetch("http://localhost:8070/getPlaylist/"+encodeURIComponent(document.getElementById("playlistURLvalue").value))
        .then(data => data.json())
        .then(function(songtitles) {
            debugger;
            if (songtitles === 'ERROR: Link invalid') {
                //problem send help
            }
            else {
                var list = document.getElementById('songs');
                arr.forEach(function(item){
                    var option = document.createElement('option');
                    option.value = item.title;
                    list.appendChild(option);
                });
            }
        });
}

function main() {
    changeView('home');
}

setTimeout(main, 0);
