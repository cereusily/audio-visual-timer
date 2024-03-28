// Put in time limit
// 40 min timer (input 40 + 1)
var timeLimit = 30 + 1; // Have to add one extra because I messed up formatting :(

// mic var
var mic;

// Calibrations ***
var volFactor = 5000; // Sensitivity (5000 default, higher = more sensitive)
var volThreshold = 300
// Calibrate these ^^^ depending on volume

var volLevel;

// input handle
var timerOn = true;

// Time handle
var currMin = 0
var currSubSeconds = 0
var currSeconds = 0
var passedStampedTime = 0;
var timeElapsedInSeconds;
var updatedTimeLimit = false; // idk I messed up time limit smwhere so +1min to make accurate

// punishment factors
var punishmentFactor = 2; // how many seconds lost per time in red
var punishFactorOn = false
var canPunish = true;
var punishmentThreshold = 5;
var punishmentCooldown = 0;
var punishmentCount = 0;

var secondsLost = 0;
var minutesLost = 0;
var secondCount = 0;

var alarm;

function setup() {
  alarm = loadSound("ting.mp3")
  mic = new p5.AudioIn();
  mic.start();
  currMin = timeLimit;
  createCanvas(400, 400);
  
}

function draw() {
  background(255);

  // Run timer
  if (timerOn) {
    runTimer()
  }
}


function runTimer() {
  // get vol
  var vol = mic.getLevel();
  volLevel = vol * volFactor;
  timeElapsedInSeconds = millis()/1000;
  background(255);
  
  // check updated time
  if (!updatedTimeLimit) {
    timeLimit++;
    updatedTimeLimit = true;
  }
  
  // Check punish/rewards
  checkPunish();
  
  // Exceeds threshold => different colour + punishment >:)
  if (volLevel > volThreshold) {
    fill(255, 0, 0);
    background(255, 0, 0)
    punish()
    
  }
  else {
    fill(0, 255, 0);
  }
  
  // create rect for volume
  strokeWeight(2)
  rect(width/2 - 25, 375, 50, -volLevel)
  
  textSize(12)
  fill(0);
  text("Can't Go Over here!", width/2 + 60, volThreshold - 235 , 100, 100)
  strokeWeight(4)
  line(width/2 - 50, 70, width/2 + 50, 70)
  strokeWeight(1)
  
  text("Break Time Remaining: ", width/2 - 50, height/2 - 50, 200, 100)
  
  formatSecondsLost()
  
  drawTimer()
}

function drawTimer() {
  push();
  fill(0, 0, 0);
  var passedTime = millis() - passedStampedTime;
  
  if (currMin > 0) {
    if (passedTime > 1000) {
      currSubSeconds--; // sub one second
      passedStampTime = millis();
    }
    var timeSeconds = timeLimit * 60;
    // check if seconds wrap around
    if (currSeconds <= 0) {
      currSeconds = 59;
      currMin--;
    }
    
    // Check if subseconds wrap around
    if (currSubSeconds < 0) {
      currSubSeconds = 59
      currSeconds--;
    }
    textSize(64)
    var formatSeconds = currSeconds;
    if (currSeconds < 10) {
      formatSeconds = "0" + currSeconds;
    }
    
    text((currMin-1) + ":" + formatSeconds + ":" + currSubSeconds, width/2 - 100, 175, 200, 200)
  }
  else {
    if (!alarm.isPlaying()) {
      alarm.play();
    }
    fill(0)
    textSize(32)
    text("Break is Over!", width/2 - 85, 175, 200, 200)
  }
  pop();
}

function checkPunish() {
  if (punishmentCooldown > 0) {
    canPunish = false;
    punishmentCooldown--;
  } 
  else {
    canPunish = true;
    punishmentCooldown = punishmentThreshold;
  }
}

function punish() {  // Adds punishment effect
  if (currMin > 0 && currSeconds > 0 && canPunish) {
    currSeconds = currSeconds - punishmentFactor; 
    if (punishFactorOn) {
      punishmentFactor++;
    }
    punishmentCooldown = punishmentThreshold;
    secondCount++;
    punishmentCount++;
  }
}

function formatSecondsLost() {
  var secLost = punishmentFactor*secondCount;
  
  if (secLost > 59) {
    secLost = 0;
    secondCount = 0;
    
    minutesLost++;
    
  }
  
  text("Time Lost: " + minutesLost + " minutes " + secLost + " seconds", 10, width - 50, 200, 100)
  
  
}