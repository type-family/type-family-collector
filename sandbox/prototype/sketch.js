const $buttonA = document.querySelector('.main-controls__button--A');
const $buttonB = document.querySelector('.main-controls__button--B');
const $buttonC = document.querySelector('.main-controls__button--C');
const $controlsText = document.querySelector('.main-controls__text');

const $mainCanvas = document.querySelector('#mainCanvas');

let video;
let canvas;
let bodyPix;
let poseNet;
let poses;
let flippedVideo;

function preload(){
  bodyPix = ml5.bodyPix();
  
}


function setup() {
  

  canvas = createCanvas($mainCanvas.clientWidth, $mainCanvas.clientHeight).parent(
    'mainCanvas'
  );

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  $buttonA.addEventListener('click', () => {
    console.log('clicked')
    triggerCountDown();
  })
  $buttonB.addEventListener('click', () => {
    console.log('clicked')
    triggerCountDown();
  })
  $buttonC.addEventListener('click', () => {
    console.log('clicked')
    triggerCountDown();
  })

  canvas.mousePressed( () => {
    loop();
  })

  

  // flippedVideo = ml5.flipImage(video);
  // poseNet = ml5.poseNet(modelReady);

  // poseNet.on('pose', function(results) {
  //   poses = results;
  // });
  segment();
}

function segment(){
  flippedVideo = ml5.flipImage(video);
  bodyPix.segment(flippedVideo, gotResults)
  // poseNet.singlePose(flippedVideo)
  
}

function modelReady(){
  console.log('model ready')
  segment();
  
}

function gotResults(err, results){
  if(err){
    console.log(err);
    return
  }
  background(200, 200, 200);


  push();
  translate( ($mainCanvas.clientWidth - 640)/2, ($mainCanvas.clientHeight - 480)/2 )

  // flippedVideo = ml5.flipImage(video);
  image(results.backgroundMask, 0,0, 640, 480)
  stroke(255,0,0)
  fill(255, 0,0)
  pop();

  // red square
  push()
  // const padX = (640-400)/2;
  // const padY = (480-400)/2;
  rectMode(CENTER)
  const padX = width/2;
  const padY = height/2;
  translate( padX, padY)
  stroke(255, 0,0)
  noFill();
  rect(0,0, 400, 400);
  pop()

  if(poses){
    drawSkeleton();
    drawKeypoints();
  }


  segment();
}

// function draw() {
  
// }


function triggerCountDown(){
  loop();
  let counter = 7;
  const myInterval = setInterval( () => {

    if(counter < 1){
      clearInterval(myInterval)
      $controlsText.textContent = `Countdown: `
      noLoop();
      triggerSave();
    }

    $controlsText.textContent = `Countdown: ${counter}`
    
    console.log('logging')

    counter--;
  }, 1000);

}

async function triggerSave(){
  const letterData = {
    letter: "",
    url: "",
    data: []
  }
  const options = {
    method: "POST",
    header: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(letterData)
  }

  let results = await fetch("https://jsonplaceholder.typicode.com/photos", options)
  results = await results.json()
  console.log(results);
  // alert(JSON.stringify(results));
  saveFrames('type_family_test', 'png', 1, 15, (data) => {
    console.log(data)
  });
}


// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      // if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      // }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}