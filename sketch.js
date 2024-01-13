let videoInput;
let video;
let faceImage;

let isVideoPlaying = false;
let isRecordingStarted = false;

let poseNet;
let poses = [];

let capture;

function initValues() {
  // TO DO: "The video element has not loaded data yet" Error
  video.remove(); // null 처리가 아니라 remove!!!
  videoInput.style("visibility", "visible");
  videoInput.elt.value = "";
}

P5Capture.setDefaultOptions({
  // GUI 중지 버튼을 누를 경우
  beforeDownload(_, __, next) {
    console.log("stopped");

    // 다운로드
    next();
    console.log("downloaded");

    isVideoPlaying = false;
    isRecordingStarted = false;

    background(255);
    textAlign(CENTER, CENTER);
    textSize(16);
    text("다운로드 완료", width / 2, height / 2);

    // 초기화
    initValues();
  },
});

function modelLoaded() {
  console.log("Model Loaded!");
  poseNet.multiPose(video);
}

function drawCanvas() {
  image(video, 0, 0, video.width, video.height);

  for (let i = 0; i < poses.length; i++) {
    console.log(i);
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

  if (
    capture.state === "encoding" ||
    (capture.state !== "iddle" && isRecordingStarted)
  ) {
    console.log("저장중");
    // 녹화 끝
    capture.stop();
    isRecordingStarted = false;
  }
}

function videoLoaded() {
  console.log("video loaded");
  resizeCanvas(video.width, video.height); // 캔버스 크기를 비디오의 크기에 맞게 조정
  // video.size(video.width, video.height);
  video.elt.muted = true;
  video.play();
  isVideoPlaying = true;

  video.onended(() => {
    isVideoPlaying = false;
  });

  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", (results) => {
    if (isVideoPlaying) {
      poses = results;
      drawCanvas();
    }
  });
}

function handleVideoFile(file) {
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
  videoInput.position(50, height + 30);
  capture = P5Capture.getInstance();

  // 업로드 메시지를 표시
  textAlign(CENTER, CENTER);
  textSize(16);
  text("동영상을 업로드하세요.", width / 2, height / 2);
}

function draw() {}
