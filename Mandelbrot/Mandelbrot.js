const RES = 20;
const MAXITER = 50;
const BOUND = 20;
var values = [];
var loading = true;
var center = [-1,0];
var scl = 1;
var prevW, prevH;

function setup() {
  background(255);
  colorMode(HSB,100);
  calculateValues();
  console.log(floor(millis())+" ms");
  createCanvas(windowWidth,windowHeight);
  prevW = windowWidth;
  prevH = windowHeight;
}

function iter(c){
  var z = [0,0];
  for (var k = 0; k<MAXITER; k++){
    z = [z[0]*z[0]-z[1]*z[1]+c[0],2*z[0]*z[1]+c[1]];
    if (z[0]*z[0]+z[1]*z[1]>=BOUND*BOUND){return k;}
  }
  return k;   
}

function convScl(){return scl>=0?scl+1:-1/scl;}

function translatePoint(rawX,rawY){
  //console.log(windowWidth,windowHeight);
  const MINDIM = min(windowHeight,windowWidth);
  var x = (rawX-windowWidth/2)/MINDIM;
  var y = (rawY-windowHeight/2)/MINDIM;
  x = x*convScl() + center[0];
  y = y*convScl() + center[1];
  return [x,y];
}

function calculateValues(){
  loading = true;
  var newValues = [];
  for (var i = 0; i < windowWidth; i+=RES){
    newValues.push([]);
    for (var j = 0; j < windowHeight; j+=RES){
      var temp = iter(translatePoint(i,j));
      newValues[i/RES].push(temp);
    }
  }
  values = newValues;
  loading = false;
}

//function mouseClicked(){
//  prevX = mouseX;
//  prevY = mouseY;
//}

//function mouseDragged(){
//  center[0] += mouseX - prevX;
//  center[1] += mouseY - prevY;
//  calculateValues();
//}

function keyPressed(){
  const MINDIM = min(windowHeight,windowWidth);
  if (keyCode === 189){
    scl++; calculateValues();
  } else if (keyCode === 187){
    scl--; calculateValues();
  } else if (keyCode === 87){
    center[1]-=convScl()/2; calculateValues();
  } else if (keyCode === 83){
    center[1]+=convScl()/2; calculateValues();
  } else if (keyCode === 65){
    center[0]-=convScl()/2; calculateValues();
  } else if (keyCode === 68){
    center[0]+=convScl()/2; calculateValues();
  } else if (keyCode === 82){
    center = [-1,0];
    scl = 1;
    calculateValues();
  }
}

function draw() {
  noStroke();
  if (prevW !== windowWidth || prevH !== windowHeight){
    createCanvas(windowWidth,windowHeight);
    prevW = windowWidth;
    prevH = windowHeight;
    calculateValues();
  }
  textSize(windowHeight/10);
  if (loading){text("Loading...",windowWidth/2-windowHeight/5,windowHeight/2+windowHeight/20);}
  else{
    for (var i = 0; i < windowWidth; i+=RES){
      for (var j = 0; j < windowHeight; j+=RES){
        var depth = values[i/RES][j/RES];
        if (depth==MAXITER){fill(0);}
        else {fill(color(depth/MAXITER*100,100,100));}
        square(i,j,RES);
      }
    }
  }
}
