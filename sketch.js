let video;
let faceapi;
let faceImage;
let detections;

function drawFace(detections) {
  const x = detections[detections.length - 1].alignedRect._box._x;
  const y = detections[detections.length - 1].alignedRect._box._y;
  const rectWidth = detections[detections.length - 1].alignedRect._box._width;
  const rectHeight = detections[detections.length - 1].alignedRect._box._height;

  //   noFill();
  //   stroke(161, 95, 251);
  //   strokeWeight(2);

  image(video, 0, 0, width, height);
  //   rect(x, y, rectWidth, rectHeight);
  image(faceImage, x - 40, y - 40, rectWidth + 80, rectHeight + 80);
}

function gotResults(error, result) {
  if (error) {
    console.log(error);
    return;
  }
  detections = result;

  if (detections) {
    if (detections.length > 0) {
      drawFace(detections);
    }
  }
  faceapi.detect(video, gotResults);
}

function modelLoaded() {
  console.log("Model Loaded!");
  faceapi.detect(video, gotResults);
}

function videoLoaded() {
  console.log("video loaded");

  const detectionOptions = {
    withLandmarks: true,
    withDescriptors: false,
  };
  faceapi = ml5.faceApi(detectionOptions, modelLoaded);
}

function setup() {
  createCanvas(640, 480);
  faceImage = loadImage("smile.png");

  video = createCapture(VIDEO, videoLoaded);
  video.size(width, height);
  video.hide();
}

function draw() {}
