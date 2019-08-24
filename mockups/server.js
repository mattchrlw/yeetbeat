
var express = require('express');
const app = express();
var youtubedl = require('youtube-dl');
var fs = require('fs');
app.set('view engine', 'ejs');
const bodyParser = require('body-parser');
var path = require('path');
const ypi = require('youtube-playlist-info');

function cleanTitle(title) {
    return title
        .replace(/ [([]official video[)\]]/i, '')
        .replace(/ [([]official[)\]]/i, '')
        .replace(/ [([]official music video[)\]]/i, '')
        .replace(/ [([]music video[)\]]/i, '')
        .replace(/ [([]lyrics[)\]]/i, '')
        .replace(/ [([]reupload[)\]]/i, '')
        .replace(/ [([]with lyrics[)\]]/i, '')
        .replace(/ + lyrics/i, '');
}

//This function downloads a 
async function playlist(url) {
    try {
        const videos = [];

        var PlaylistID = url.split("list=")[1];
        await ypi("AIzaSyDt2-8433-k2eK0GGUIUbKvmO2jkbIvH8Y", PlaylistID).then(items => {
            //console.log(items);
            //List of songs is the titles of the youtube video
            
            items.forEach(function(value){
                videos.push({
                    title: cleanTitle(value.title),
                    video_id: value.resourceId.videoId
                });
            });
        });

        // var video = youtubedl(url, ["-f 140"], null);

        // video.on('error', function error(err) {
        //     //console.log('error 2:', err);
        //     throw 'error 2:' + err;
        // });

        // var size = 0;
        // video.on('info', function (info) {
        //     size = info.size;
        //     var output = path.join(__dirname + '/', size + '.m4a');
        //     pathToFiles.push(output);
        //     video.pipe(fs.createWriteStream(output));
        // });
        // //to be removed
        // var pos = 0;
        // video.on('data', function data(chunk) {
        //     pos += chunk.length;
        //     // `size` should not be 0 here.
        //     if (size) {
        //         var percent = (pos / size * 100).toFixed(2);
        //         process.stdout.cursorTo(0);
        //         process.stdout.clearLine(1);
        //         process.stdout.write(percent + '%');
        //     }
        // });

        // video.on('next', playlist);
        return videos;
    }
    catch (e) {
        //playlist link is invalid, do something, don't continue
        return 'ERROR XD';
    }
}

app.get('/playlist/:url/songs', async function (req, res) {
    const data = await playlist(req.params.url);
    /*var video = youtubedl('http://www.youtube.com/watch?v=90AiXO1pAiA',
        // Optional arguments passed to youtube-dl.
        ['-f 140'],
        // Additional options can be given for calling `child_process.execFile()`.
        { cwd: __dirname });

    // Will be called when the download starts.
    video.on('info', function (info) {
        console.log('Download started');
        console.log('filename: ' + info._filename);
        console.log('size: ' + info.size);
    });
    video.on('complete', function complete(info) {
        'use strict';
        console.log('filename: ' + info._filename + ' already downloaded.');
    });

    video.on('end', function () {
        console.log('finished downloading!');
    });
    video.pipe(fs.createWriteStream('myvideo.m4a'));*/
    res.json(data);
});

app.post('/', function (req, res) {

})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
})