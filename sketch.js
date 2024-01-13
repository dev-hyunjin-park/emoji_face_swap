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
    let pose = poses[0].pose;

    // Create a pink ellipse for the nose
    fill(213, 0, 143);
    let nose = pose["nose"];
    ellipse(nose.x, nose.y, 20, 20);

    // Create a yellow ellipse for the right eye
    fill(255, 215, 0);
    let rightEye = pose["rightEye"];
    ellipse(rightEye.x, rightEye.y, 20, 20);

    // Create a yellow ellipse for the right eye
    fill(255, 215, 0);
    let leftEye = pose["leftEye"];
    ellipse(leftEye.x, leftEye.y, 20, 20);
  }
}

function videoLoaded() {
  console.log("video loaded");

  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", (results) => {
    poses = results;
    drawVideo();
  });
}

function setup() {
  createCanvas(640, 480);
  faceImage = loadImage("smile.png");

  video = createVideo("phoebe.mov", videoLoaded);
  video.size(640, 480);

  video.showControls();
  video.loop();
  video.hide();
}

function draw() {}
