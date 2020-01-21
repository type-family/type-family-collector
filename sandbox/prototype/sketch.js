const $buttonA = document.querySelector('.main-controls__button--A');
const $buttonB = document.querySelector('.main-controls__button--B');
const $buttonC = document.querySelector('.main-controls__button--C');
const $controlsText = document.querySelector('.main-controls__text');

const $mainCanvas = document.querySelector('#mainCanvas');

let video;
let canvas;
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

}

function draw() {
  background(200, 200, 200);
  // video
  push();
  translate( ($mainCanvas.clientWidth - 640)/2, ($mainCanvas.clientHeight - 480)/2 )
  image(video, 0,0, 640, 480)
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
}


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

  alert(JSON.stringify(results));
}