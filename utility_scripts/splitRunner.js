/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var fs = require('fs');
var mkdirp = require('mkdirp');
var spawn = require('child_process').spawn;

var path = process.argv[2];

var videos = fs.readdirSync(path).filter(function (video) {
  return video.indexOf("mp4") > -1;
});

videos = videos.map(function (video) {
  return video.replace(".mp4", "");
});

console.log(videos);


videos.forEach(function (video) {
  var videoIndex = parseInt(video.split("_")[1], 10);
  videoIndex = videoIndex > 9 ? videoIndex : "0" + videoIndex;

  var lectureDir = path + "/Lecture_" + videoIndex;
  fs.mkdirSync(lectureDir);
  fs.renameSync(path + "/" + video + ".wav", lectureDir + "/Full_Lecture_Video_" + videoIndex + ".wav");
  fs.renameSync(path + "/" + video + ".mp4", lectureDir + "/Full_Lecture_Video_" + videoIndex + ".mp4");
});

var folders = fs.readdirSync(path).filter(function (folder) {
  return folder.indexOf("Lecture") > -1;
});

console.log(folders);

var splitsDone = 0;
folders.forEach(function (folder) {
  var folderIndex = folder.split("_")[1];
  var command = 'python';
  var args = ["lectureSegmenter.py", path + "/" + folder + "/Full_Lecture_Video_" + folderIndex + ".wav"];
  var segmenterChild = spawn(command, args);
  segmenterChild.stdout.on('data', function (splitTimes) {
    splitTimes = splitTimes.toString().trim();
    console.log(splitTimes)
    var command = 'node';
    var args = [
      "split.js",
      path + "/" + folder + "/Full_Lecture_Video_" + folderIndex + ".mp4"
    ].concat(splitTimes.split(" "));
    var splitChild = spawn(command, args);
    splitChild.on('close', function() {
      splitsDone++;
      console.log(splitsDone);
      if (folders.length === splitsDone) {
        process.exit();
      }
    });
  });
});
