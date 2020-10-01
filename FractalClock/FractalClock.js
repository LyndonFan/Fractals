var cx, cy, radius;
var secondsRadius;
var minutesRadius;
var hoursRadius;
var clockDiameter;
const MAX_ITER = 7;

function restart(){
  createCanvas(windowWidth, windowHeight);
  
  radius = min(width, height) / 2;
  secondsRadius = radius * 0.7;
  minutesRadius = radius * 0.5;
  hoursRadius = radius * 0.3;
  clockDiameter = radius * 2;
  
  cx = width / 2;
  cy = height / 2;
}

function setup() {
  restart();
}

function draw() {
  restart();
  var x, y, ang, r;
  background(0);

  // Angles for sin() and cos() start at 3 o'clock;
  // subtract HALF_PI to make them start at the top
  var s = map(second(), 0, 60, 0, TWO_PI) - HALF_PI;
  var m = map(minute() + norm(second(), 0, 60), 0, 60, 0, TWO_PI) - HALF_PI; 
  var h = map(hour() + norm(minute(), 0, 60), 0, 24, 0, TWO_PI * 2) - HALF_PI;
  var stack = [[cx,cy,0,0]];
  var r;
  while (stack.length > 0){
    x = stack[stack.length-1][0];
    y = stack[stack.length-1][1];
    ang = stack[stack.length-1][2];
    d = stack[stack.length-1][3];
    stack = stack.slice(0,stack.length-1);
    r = pow(0.5,d);
    stroke('rgba(255,255,255,'+(1-d/MAX_ITER)+')');
    strokeWeight((MAX_ITER-d));
    line(x, y, x + cos(s+ang) * secondsRadius * r, y + sin(s+ang) * secondsRadius * r);
    stroke('rgba(255,255,255,'+(1-d/MAX_ITER)+')');
    strokeWeight((d==0?2:1)*(MAX_ITER-d));
    line(x, y, x + cos(m+ang) * minutesRadius * r, y + sin(m+ang) * minutesRadius * r);
    stroke('rgba(255,255,255,'+(1-d/MAX_ITER)+')');
    strokeWeight((d==0?4:1)*(MAX_ITER-d));
    line(x, y, x + cos(h+ang) * hoursRadius * r, y + sin(h+ang) * hoursRadius * r);
    if (d < MAX_ITER){
      stack.push([x + cos(s+ang) * secondsRadius * r, y + sin(s+ang) * secondsRadius * r, ang+s-HALF_PI, d+1]);
      stack.push([x + cos(m+ang) * minutesRadius * r, y + sin(m+ang) * minutesRadius * r, ang+m-HALF_PI, d+1]);
      stack.push([x + cos(h+ang) * hoursRadius * r, y + sin(h+ang) * hoursRadius * r, ang+h-HALF_PI, d+1]);
    }
  }

  
  // Draw the minute ticks
  for (var a = 0; a < 360; a+=6) {
    var angle = radians(a);
    var tempx = cx + cos(angle) * secondsRadius;
    var tempy = cy + sin(angle) * secondsRadius;
    fill(255);
    let r = radius*pow(0.5,5)*(a%30==0?2:1);
    ellipse(tempx, tempy, r, r);
  }
}
