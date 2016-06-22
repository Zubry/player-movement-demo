import Player from '@zubry/player';

import ColorPalette from '@zubry/colorpalette';
import { BoundingCircle as Circle, BoundingRectangle as Rectangle } from '@zubry/boundary';
import Position from '@zubry/position';

import throttle from 'throttle-debounce/throttle';

function drawRectangle(context, rectangle, fill, pattern, rotation, center) {
  const [ul, ur, lr, ll] = rectangle
    .toCoordinateList()
    .map((coord) => coord.rotateAround(rotation, center))
    .toArray();

  context.beginPath();

  if (pattern === 1) {
    context.moveTo(ur.x, ur.y);
    context.lineTo(lr.x, lr.y);
    context.lineTo(ll.x, ll.y);
  }

  if (pattern === 2) {
    context.moveTo(ul.x, ul.y);
    context.lineTo(lr.x, lr.y);
    context.lineTo(ll.x, ll.y);
  }

  context.closePath();

  context.fillStyle = fill;
  context.fill();
}

function drawCircle(context, circle, fill) {
  context.beginPath();

  context.arc(circle.center.x, circle.center.y, circle.radius, 0, 2 * Math.PI, false);

  context.closePath();

  context.fillStyle = fill;
  context.fill();
}

function drawArrow(context, circle, fill, rotation) {
  const rect = new Rectangle({
    width: 30,
    height: 10,
    rotation: new Position(0),
    center: circle.center,
  });

  const rectA = rect
    .rotate(new Position(-45))
    .shift(new Position({ x: -12, y: -25}));

  const rectB = rect
    .rotate(new Position(45))
    .shift(new Position({ x: 12, y: -25}));

    drawRectangle(context, rectA, fill, 1, new Position(rotation + 90), circle.center);
    drawRectangle(context, rectB, fill, 2, new Position(rotation + 90), circle.center);
}

function drawPlayer(context, player) {
  drawCircle(context, player.boundary, player.color.primary);

  drawArrow(context, player.boundary, player.color.primary, player.rotation);
}

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer(context, player);

  requestAnimationFrame(render);
}

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

let player = new Player({
  boundary: new Circle({
    center: new Position({ x: 300, y: 200 }),
    radius: 20,
  }),
  color: new ColorPalette({ primary: '#1DCCC4' }),
  rotationSpeed: 30,
  movementSpeed: 10,
  rotation: -90,
});

document.addEventListener('keydown', function(e){
  switch(e.keyCode) {
    case 38:
      player = player.move();
      break;
    case 39:
      player = player.rotateRight();
      break;
    case 37:
      player = player.rotateLeft();
      break;
  }
});

render();

document
  .getElementById('reset')
  .addEventListener('click', () => player = new Player({
    boundary: new Circle({
      center: new Position({ x: 300, y: 200 }),
      radius: 20,
    }),
    color: new ColorPalette({ primary: '#1DCCC4' }),
    rotationSpeed: 30,
    movementSpeed: 10,
    rotation: -90,
  }));
