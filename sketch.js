let videoInput;
let video;
let faceImage;

let isVideoPlaying = false;
let isRecordingStarted = false;

let poseNet;
let poses = [];

let capture;

function modelLoaded() {
  console.log("Model Loaded!");
  poseNet.multiPose(video);
}

function drawVideo() {
  image(video, 0, 0, width, height);

  for (let i = 0; i < poses.length; i++) {
    const pose = poses[i].pose;
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

  if (capture.state === "idle" && !isRecordingStarted) {
    console.log("녹화 시작");
    // 녹화 시작
    capture.start();
    isRecordingStarted = true;
  }
}

function videoLoaded() {
  console.log("video loaded");
  video.size(width, height);
  video.elt.muted = true;
  video.play();
  isVideoPlaying = true;
  video.onended(() => {
    isVideoPlaying = false;
    console.log("비디오 끝");
    // 캡처 중단
    capture.stop();
  });

  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", (results) => {
    if (isVideoPlaying) {
      poses = results;
      drawVideo();
    }
  });
}

function handleVideoFile(file) {
  print("Got video file:", file);
  video = createVideo(file.data, videoLoaded);
  video.hide();
  videoInput.style("visibility", "hidden");
}

function setup() {
  createCanvas(640, 480);
  background(200);
  faceImage = loadImage("smile.png");
  // 비디오 파일만 수락하도록 videoInput 요소 생성
  videoInput = createFileInput(handleVideoFile);
  videoInput.attribute("accept", "video/*");
  videoInput.position(0, 100);

  capture = P5Capture.getInstance();
}

function draw() {}
