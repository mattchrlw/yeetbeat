const SERVER = 'http://yeetbeat.fun'

/** Progress circle for song progress. */
var circle;
var youtubeArr = null;
var playlistURL = null;

/** Handler functions fired when the view is changed to a particular view. */
const viewHandlers = {
    game: initGame,
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
    // debugger;
    // var random = Math.floor(Math.random() * (youtubeArr.length-0.001));
    // var result = youtubeArr[random];
    // console.log(result);
    // console.log
    
    // fetch(SERVER+"/downloadYoutube/"+encodeURIComponent("https://www.youtube.com/watch?v="+result.video_id))
    //     .then(data => data.json())
    //     .then(function(filename) {
    //         // var sound = new Pizzicato.Sound({ 
    //         //     source: 'file',
    //         //     options: { path: filename }
    //         // }, function() {
    //         //     //console.log('sound file loaded!');
    //         // });
    //         var sound = new Audio(filename);
    //         sound.play();
    //         console.log("playing song " + filename);
    //         youtubeArr.splice(random, 1);
    //         startSong({duration: 10000});
    //     });
}

async function getAutoComp(playlist) {
    console.log('loading autocomplete for: ' + playlist);
    return await fetch(SERVER+"/getPlaylist/"+encodeURIComponent(playlist))
        .then(data => data.json())
        .then(function(songtitles) {
            if (songtitles === 'ERROR: Link invalid') {
                //problem send help
                // don't change views
                console.error('error downloading songs in playlist');
                console.error(songtitles);
                return false;
            }
            else {
                console.log("Completion downloaded, length: " + songtitles.length);
                return songtitles.map(item => item.title)
                    .filter(title => title != 'Private video');
            }
        });
}
const openRoomButton = document.querySelector('#openroom');
openRoomButton.addEventListener('click', async (ev) => {
    ev.preventDefault();
    ev.stopPropagation();

    if (openRoomButton.classList.contains('disabled')) return;
    openRoomButton.classList.add('disabled');

    const username = document.getElementById('nameboxcreate').value.trim();
    if (!username) {
        alert('Invalid username!');
        openRoomButton.classList.remove('disabled');
        return;
    }

    const playlist = document.getElementById("playlistURLvalue").value;
    const songNames = await getAutoComp(playlist);
    if (songNames) {
        playlistURL = playlist;
        
        changeView('room');
    } else {
        alert('Error loading playlist!');
        playlistURL = null;
    }
    youtubeArr = songNames;
    openRoomButton.classList.remove('disabled');
});

const startGameButton = document.getElementById('start-game-btn');

function main() {
    changeView('home');
}

setTimeout(main, 0);