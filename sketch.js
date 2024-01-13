let video;
let faceImage;

let poseNet;
let poses = [];

let ready = false;

function drawFace() {
  image(video, 0, 0, width, height);
}

function modelLoaded() {
  console.log("Model Loaded!");
}

function drawVideo() {
  image(video, 0, 0, 640, 480);
  strokeWeight(2);

  // For one pose only (use a for loop for multiple poses!)
  if (poses.length > 0) {
    const pose = poses[0].pose;

    const nose = pose["nose"];
    const eyeL = pose["leftEye"];
    const eyeR = pose["rightEye"];

    const earL = pose["leftEar"];
    const earR = pose["rightEar"];

    const shourlderL = pose["leftShoulder"];
    const shourlderR = pose["rightShoulder"];

    const faceWidthDistance = dist(earR.x, earR.y, earL.x, earL.y) * 0.03;

    const faceWidth = (earR.x - earL.x) * faceWidthDistance;
    // console.log(faceWidthDistance);

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

  video.play();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", (results) => {
    poses = results;
    drawVideo();
  });
}

function setup() {
  createCanvas(640, 480);
  faceImage = loadImage("smile.png");

  video = createVideo("video.mov", videoLoaded);
  video.size(640, 480);
  video.hide();
}

function draw() {}
