const RES = 1;
const MAXITER = 20;
const BOUND = 4;
var values = [];
var center = [0,0];
var scl = 1;
var cAdd = [0.5,0.5];
var needUpdate = true;

function setup() {
  background(255);
  colorMode(HSB,100);
  console.log(floor(millis())+" ms");
  createCanvas(windowWidth,windowHeight);
  pixelDensity(RES);
  button = createButton('Update');
  button.mousePressed(updateC);
  button.position(width-300,height-50);
  button.size(100,50);
  inputs = [];
  inputs.push(createInput(0,'number'));
  inputs.push(createInput(0,'number'));
  for (var i = 0; i<2; i++){
    inputs[i].position(width-100*(2-i),height-50);
    inputs[i].size(100,50);
    inputs[i].style('font-size:20px');
  }
}

function updateC(){
  var a = inputs[0].value();
  var b = inputs[1].value();
  cAdd = [a,b];
  needUpdate = true;
}

function iter(z){
  for (var k = 0; k<MAXITER; k++){
    var temp = z[0]*z[0]-z[1]*z[1]+cAdd[0];
    z[1] = 2*z[0]*z[1]+cAdd[1];
    z[0] = temp;
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

function HSVtoRGB(h,s,v){
  var c = v*s;
  var x = c*(1 - abs((h/60)%2-1));
  if (0<=h && h<60){return [c,x,0];}
  else if (60<=h && h<120){return [x,c,0];}
  else if (120<=h && h<180){return [0,c,x];}
  else if (180<=h && h<240){return [0,x,c];}
  else if (240<=h && h<300){return [x,0,c];}
  else {return [c,0,x];}
}

function calculateValues(){
  if (needUpdate){
    for (var i = 0; i < windowWidth/RES; i++){
      for (var j = 0; j < windowHeight/RES; j++){
        var temp = iter(translatePoint(i*RES,j*RES),cAdd);
        var clr;
        if (temp==MAXITER){
          clr = [0,0,0];
        } else {
          clr = HSVtoRGB(temp/MAXITER*360,1,1);
        }
        for (var x = 0; x<RES; x++){
          for (var y = 0; y<RES; y++){
            var pix = (i*RES + x + (j*RES+y)*windowWidth)*4;
            for (let ind = 0; ind < 3; ind++){pixels[pix+ind] = 255*clr[ind];}
            pixels[pix+3] = 255;
          }
        }
        
      }
    }
    needUpdate = false;
  }
}

function windowResized(){
  createCanvas(windowWidth,windowHeight);
  needUpdate = true;
}

function keyPressed(){
  const MINDIM = min(windowHeight,windowWidth);
  needUpdate = true;
  if (keyCode === 189){scl++;}
  else if (keyCode === 187){scl--;}
  else if (keyCode === 87){center[1]-=convScl()/10;}
  else if (keyCode === 83){center[1]+=convScl()/10;}
  else if (keyCode === 65){center[0]-=convScl()/10;}
  else if (keyCode === 68){center[0]+=convScl()/10;}
  else if (keyCode === 82){
    center = [-1,0];
    scl = 1;
  } else {
    needUpdate = false;
  }
}

function draw() {
  noStroke();
  loadPixels();
  if (needUpdate){
    console.log(cAdd[0], cAdd[1]);
    calculateValues();
  }
  updatePixels();
  button.position(width-300,height-50);
  for (var i = 0; i<2; i++){
    inputs[i].position(width-100*(2-i),height-50);
  }
}
