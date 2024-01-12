let video;
let faceapi;
let faceImage;

function drawFace(result) {
  image(video, 0, 0, width, height);

  const { _x, _y, _width, _height } =
    result[result.length - 1].alignedRect._box;

  const margin = 40;
  const enlargedWidth = _width + 2 * margin;
  const enlargedHeight = _height + 2 * margin;

  image(faceImage, _x - margin, _y - margin, enlargedWidth, enlargedHeight);
}

function gotResults(error, result) {
  if (error) {
    console.log(error);
    return;
  }

  if (result && result.length > 0) {
    drawFace(result);
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
