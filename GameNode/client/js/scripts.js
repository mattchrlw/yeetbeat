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

// // Array to store our Snowflake objects
// var snowflakes = [];
      
// // Global variables to store our browser's window size
// var browserWidth;
// var browserHeight;

// // Specify the number of snowflakes you want visible
// var numberOfSnowflakes = 50;

// // Flag to reset the position of the snowflakes
// var resetPosition = false;

// // Handle accessibility
// var enableAnimations = false;
// var reduceMotionQuery = matchMedia("(prefers-reduced-motion)");

// // Handle animation accessibility preferences 
// function setAccessibilityState() {
//   if (reduceMotionQuery.matches) {
//     enableAnimations = false;
//   } else { 
//     enableAnimations = true;
//   }
// }
// setAccessibilityState();

// reduceMotionQuery.addListener(setAccessibilityState);

// //
// // It all starts here...
// //
// function setup() {
//   if (enableAnimations) {
//     window.addEventListener("DOMContentLoaded", generateSnowflakes, false);
//     window.addEventListener("resize", setResetFlag, false);
//   }
// }
// setup();

// //
// // Constructor for our Snowflake object
// //
// function Snowflake(element, speed, xPos, yPos) {
//   // set initial snowflake properties
//   this.element = element;
//   this.speed = speed;
//   this.xPos = xPos;
//   this.yPos = yPos;
//   this.scale = 1;

//   // declare variables used for snowflake's motion
//   this.counter = 0;
//   this.sign = Math.random() < 0.5 ? 1 : -1;

//   // setting an initial opacity and size for our snowflake
//   this.element.style.opacity = (.5 + Math.random()) / 3;
// }

// //
// // The function responsible for actually moving our snowflake
// //
// Snowflake.prototype.update = function () {
//   // using some trigonometry to determine our x and y position
//   this.counter += this.speed / 5000;
//   this.xPos += this.sign * this.speed * Math.cos(this.counter) / 40;
//   this.yPos += Math.sin(this.counter) / 40 + this.speed / 30;
//   this.scale = .5 + Math.abs(10 * Math.cos(this.counter) / 20);

//   // setting our snowflake's position
//   setTransform(Math.round(this.xPos), Math.round(this.yPos), this.scale, this.element);

//   // if snowflake goes below the browser window, move it back to the top
//   if (this.yPos > browserHeight) {
//     this.yPos = -50;
//   }
// }

// //
// // A performant way to set your snowflake's position and size
// //
// function setTransform(xPos, yPos, scale, el) {
//   el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0) scale(${scale}, ${scale})`;
// }

// //
// // The function responsible for creating the snowflake
// //

// function generateSnowflakes() {

//   // get our snowflake element from the DOM and store it
//   //var originalSnowflake = document.querySelector(".img");

//   var originalSnowflake = document.querySelector(".container");


//   // access our snowflake element's parent container
//   var noteContainer = originalSnowflake.parentNode;
//   noteContainer.style.display = "block";

//   // get our browser's size
//   browserWidth = document.documentElement.clientWidth;
//   browserHeight = document.documentElement.clientHeight;

//   // create each individual snowflake 
//   for (var i = 0; i < numberOfSnowflakes; i++) {

//     // clone our original snowflake and add it to noteContainer
//     var snowflakeClone = originalSnowflake.cloneNode(true);
//     noteContainer.appendChild(snowflakeClone);

//     // set our snowflake's initial position and related properties
//     var initialXPos = getPosition(50, browserWidth);
//     var initialYPos = getPosition(50, browserHeight);
//     var speed = 5 + Math.random() * 40;

//     // create our Snowflake object
//     var snowflakeObject = new Snowflake(snowflakeClone,
//       speed,
//       initialXPos,
//       initialYPos);
//     snowflakes.push(snowflakeObject);
//   }

//   // remove the original snowflake because we no longer need it visible
//   noteContainer.removeChild(originalSnowflake);
//   moveSnowflakes();
// }

// //
// // Responsible for moving each snowflake by calling its update function
// //
// function moveSnowflakes() {

//   if (enableAnimations) {
//     for (var i = 0; i < snowflakes.length; i++) {
//       var img = snowflakes[i];
//       img.update();
//     }      
//   }

//   // Reset the position of all the snowflakes to a new value
//   if (resetPosition) {
//     browserWidth = document.documentElement.clientWidth;
//     browserHeight = document.documentElement.clientHeight;

//     for (var i = 0; i < snowflakes.length; i++) {
//       var img = snowflakes[i];

//       img.xPos = getPosition(50, browserWidth);
//       img.yPos = getPosition(50, browserHeight);
//     }

//     resetPosition = false;
//   }

  
//   requestAnimationFrame(moveSnowflakes);
  
// }

// //
// // This function returns a number between (maximum - offset) and (maximum + offset)
// //
// function getPosition(offset, size) {
//   return Math.round(-1 * offset + Math.random() * (size + 2 * offset));
// }

// //
// // Trigger a reset of all the snowflakes' positions
// //
// function rotateSnowFlakes() {
//     snowflake.rotate(20);
// }

// function setResetFlag(e) {
//   resetPosition = true;
// }