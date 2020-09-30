/*
Ref: 
https://github.com/erdavids/Birds-of-a-Feather/blob/master/Generative_Birds.pyde
Dependencies:
1. [p5js](https://cdn.jsdelivr.net/npm/p5@1.1.9/lib/p5.js)
2. [lodash](https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.20/lodash.min.js)
Demo: https://codepen.io/taurenshaman/pen/OJNYOvR
*/

function createColor(r, g, b){
  return {
    r: r,
    g: g,
    b: b
  };
}

const w = 1400, h = 1400;

// Number of birds
const grid_x = 1;//5
const grid_y = 1;//5

// The birds will draw inside this rectangle
const grid_x_pixels = .8 * w;
const grid_y_pixels = .8 * h;

// Distance between the birds
const sep_x = 0;//grid_x_pixels / (grid_x - 1);
const sep_y = 0;//grid_y_pixels / (grid_y - 1);

// Background Color
const bc = createColor(255, 255, 255);

// Global bird variables

const colors = [createColor(189, 208, 196),
                createColor(154,183,211),
                createColor(245,210,211),
                createColor(247,225,211),
                createColor(223,204,241)
               ];
const feet_length = 40;
const body_height = 100;
const line_thickness = 7;

const body_fill_chance = .3;
const head_fill_chance = .3;
const tail_chance = .3;
const arc_chance = .4;

const min_shape_lines = 1;
const max_shape_lines = 5;

let head_x = 0;
let head_y = 0;
let head_size = 90;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
function get_random_element(list){
  //return l[int(random(len(l)))]
  const index = getRandomInt(list.length - 1);
  return list[index];
}
function pop_random(list){
  const index = getRandomInt(list.length - 1);
  const pulled = _.pullAt(list, [index]);
  return pulled[0];
}

// Adds shading to some of the randomly drawn triangles
function draw_lines(point_list){
  const p1 = pop_random(point_list);
  const p2 = pop_random(point_list);
  const p3 = pop_random(point_list);
  
  let lines = random(min_shape_lines, max_shape_lines);
  print('lines: ' + lines);
  
  // 0: x, 1: y
  
  let first_x_adj = 1;
  if (p3.x - p1.x === 0)
    first_x_adj = 1;
  else
    first_x_adj = (p3.x - p1.x)/abs(p3.x - p1.x);
  
  let first_y_adj = 1;
  if (p3.y - p1.y === 0)
    first_y_adj = 1;
  else
    first_y_adj = (p3.y - p1.y)/abs(p3.y - p1.y);
        
  let first_x_sep = sqrt(pow(p1.x - p3.x, 2))/lines * first_x_adj;
  let first_y_sep = sqrt(pow(p1.y - p3.y, 2))/lines * first_y_adj;
  
  let second_x_adj = 1;
  if (p3.x - p2.x === 0)
    second_x_adj = 1;
  else
    second_x_adj = (p3.x - p2.x)/abs(p3.x - p2.x);

  let second_y_adj = 1;
  if (p3.y - p2.y === 0)
    second_y_adj = 1;
  else
    second_y_adj = (p3.y - p2.y)/abs(p3.y - p2.y);

  let second_x_sep = sqrt(pow(p2.x - p3.x, 2))/lines * second_x_adj
  let second_y_sep = sqrt(pow(p2.y - p3.y, 2))/lines * second_y_adj
  
  for(let i = 0; i < lines; i++){
    line(p1.x + first_x_sep * i, p1.y + first_y_sep * i,
         p2.x + second_x_sep * i, p2.y + second_y_sep * i);
  }
}

function draw_bird_legs(x, y){
  stroke(0);
  strokeCap(ROUND);
  line(x - feet_length, y, x + feet_length, y);
  line(x - feet_length/3.0, y, x - feet_length/3.0 - feet_length/2.0, y - feet_length);
  line(x + feet_length/3.0, y, x + feet_length/3.0 - feet_length/2.0, y - feet_length);
}

function draw_bird_body(x, y, pc, dc){
  
}

function draw_bird_base(x, y, pc, dc){
  // Draw Legs
  draw_bird_legs(x, y);
  
  // Draw Body
  stroke(dc.r, dc.g, dc.b);
  let body_bottom = y - feet_length/2.0;

  let body_one = {x: int(x - feet_length * 2.0),
                  y: int(body_bottom)};
  let body_two = {x: int(x + feet_length*1.5),
                  y: int(body_bottom)};
  let body_three = {x: int(x + feet_length*2.1),
                  y: int(body_bottom - body_height)};
  let body_four = {x: int(x),
                  y: int(body_bottom - body_height * 1.3)};

  let left_midpoint = {x: (body_four.x + body_one.x) / 2,
                       y: (body_four.y + body_one.y) / 2};
  let top_midpoint = {x: (body_four.x + body_three.x) / 2,
                      y: (body_four.y + body_three.y) / 2};
  let right_midpoint = {x: (body_two.x + body_three.x) / 2,
                        y: (body_two.y + body_three.y) / 2};
  let bottom_midpoint = {x: (body_one.x + body_two.x) / 2,
                         y: (body_one.y + body_two.y) / 2};

  let true_midpoint = {x: (left_midpoint.x + right_midpoint.x) / 2,
                       y: (left_midpoint.y + right_midpoint.y) / 2};

  let body_points = [ body_one, body_three, body_four, left_midpoint, top_midpoint, bottom_midpoint];

  fill(bc.r, bc.g, bc.b);
  beginShape();
  vertex(body_one.x, body_one.y);
  vertex(body_two.x, body_two.y);
  vertex(body_three.x, body_three.y);
  vertex(body_four.x, body_four.y);
  endShape(CLOSE);
  
  let range = random(1, 4);
  for(let i = 0; i< range; i++){
    point_one = get_random_element(body_points);
    point_two = get_random_element(body_points);
    point_three = get_random_element(body_points);
    point_four = get_random_element(body_points);

    fill(pc.r, pc.g, pc.b);
    beginShape();
    vertex(point_one.x, point_one.y);
    vertex(point_two.x, point_two.y);
    vertex(point_three.x, point_three.y);
    endShape(CLOSE);
    noFill();

    if (random(1) < .5){
      draw_lines([point_one, point_two, point_three]);
    }
  } // for
  head_x = x + feet_length;
  head_y = body_bottom - body_height * 1.1;
  head_size = 90;
  
  // Draw Tail
  if (random(1) < tail_chance){
    stroke(dc.r, dc.g, dc.b);
    fill(pc.r, pc.g, pc.b);
    let var_width = random(15, 30);
    let var_x = random(-25, -15);
    let var_y = random(-50, -30);
    if (random(1) < 0.3){
      var_y *= -1
    }
    
    beginShape();
    vertex(body_one.x, body_one.y);
    vertex(body_one.x + var_width, body_one.y);
    vertex(body_one.x + + var_width + var_x, body_one.y + var_y);
    vertex(body_one.x + var_x, body_one.y + var_y);
    endShape(CLOSE);
  } // if < tail_chance
  
  // Draw Beak
  let y_variance = random(10, 40);
  let length_variance = random(50, 100);
  // pc = get_random_element(colors);
  // inc = .2 * 255;
  // stroke(pc[0] - inc, pc[1] - inc, pc[2] - inc);
  if (random(1) < body_fill_chance)
    fill(pc.r, pc.g, pc.b);
  else
    fill(bc.r, bc.g, bc.b);
  
  triangle(head_x, head_y - y_variance, 
           head_x, head_y + y_variance, 
           head_x + length_variance, head_y);
  
  // Draw Head
  fill(bc.r, bc.g, bc.b);
  circle(head_x, head_y, head_size);

  if (random(1) < arc_chance){
     fill(pc.r, pc.g, pc.b);
     noStroke();
     arc(head_x, head_y, head_size, head_size, random(.7, 1)*PI, 1.8*PI, PIE);
  }
  stroke(dc.r, dc.g, dc.b);
  if (random(1) < head_fill_chance)
    fill(pc.r, pc.g, pc.b);
  else
    noFill();
  circle(head_x, head_y, head_size);
  
  // Draw Eyes
  const eye_x = head_x + head_size/6.0;
  const eye_y = head_y - head_size/8.0;
  const eye_size = 25;
  fill(bc.r, bc.g, bc.b);
  circle(eye_x, eye_y, eye_size);

  stroke(0);
  fill(0);
  noStroke();
  circle(eye_x, eye_y, 10);
}

function setup(){
  //size(w, h);
  createCanvas(w, h);

  background(bc.r, bc.g, bc.b);
  pixelDensity(2);
  stroke(0);
  strokeWeight(line_thickness);
  strokeJoin(ROUND);

  let current_x = w/2.0 - grid_x_pixels/2.0;
  let current_y = h/2.0 - grid_y_pixels/2.0 + body_height;
  for(let i = 0; i< grid_x; i++){
    for(let j = 0; j< grid_y; j++){
      let pc = get_random_element(colors);
      let inc = .2 * 255;
      let dc = {
        r: pc.r - inc,
        g: pc.g - inc,
        b: pc.b - inc
      };
      draw_bird_base(current_x, current_y, pc, dc);
      current_y += sep_y;
    } // for grid_y
    current_y = h/2.0 - grid_y_pixels/2.0 + body_height;
    current_x += sep_x;
  } // for grid_x
  
  seed = str(int(random(10000)));
  //save("test.jpg");
}
