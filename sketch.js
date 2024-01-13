let video;
let faceImage;

let isVideoPlaying = false;

let poseNet;
let poses = [];

function modelLoaded() {
  console.log("Model Loaded!");
  poseNet.multiPose(video);
}

function drawVideo() {
  image(video, 0, 0, width, height);

  for (let i = 0; i < poses.length; i++) {
    const pose = poses[i].pose;
    console.log(poses[i]);
    const nose = pose["nose"];
    const eyeL = pose["leftEye"];
    const eyeR = pose["rightEye"];

    const earL = pose["leftEar"];
    const earR = pose["rightEar"];

    const shourlderL = pose["leftShoulder"];
    const shourlderR = pose["rightShoulder"];

    const faceWidthDistance = dist(earR.x, earR.y, earL.x, earL.y) * 0.03;
    const faceWidth = (earR.x - earL.x) * faceWidthDistance;

    const faceHeightDistance =
      Math.max(
        dist(shourlderR.x, shourlderR.y, earR.x, earR.y),
        dist(shourlderL.x, shourlderL.y, earL.x, earL.y)
      ) * 0.01;
    const faceHeight =
      Math.max(nose.y - eyeR.y, nose.y, eyeL.y) * faceHeightDistance;

    image(
      faceImage,
      nose.x - faceWidth / 2,
      nose.y - faceHeight / 2,
      faceWidth,
      faceHeight
    );
  }
}

function videoLoaded() {
  console.log("video loaded");
  video.size(width, height);
  video.elt.muted = true;
  video.play();
  isVideoPlaying = true;
  video.onended(() => (isVideoPlaying = false));

  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", (results) => {
    if (isVideoPlaying) {
      poses = results;
      drawVideo();
    }
  });
}

function setup() {
  createCanvas(640, 480);
  faceImage = loadImage("smile.png");
  video = createVideo("video.mov", videoLoaded);
  video.hide();
}

function draw() {}
