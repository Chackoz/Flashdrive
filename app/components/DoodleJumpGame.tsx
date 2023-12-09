import React,{ useState, useEffect ,useRef } from "react";

interface DoodleGameProps{
  scoreUpdate: (newValue: number) => void;
}

const DoodleJumpGame:React.FC<DoodleGameProps> = ({scoreUpdate}) => {
  const scoreRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

useEffect(() => {
  const canvas = canvasRef.current as HTMLCanvasElement;
    const context = canvas?.getContext('2d') as CanvasRenderingContext2D;
    if (!canvas || !context) {
      console.error('Canvas or context not available');
      return;
    }

// width and height of each platform and where platforms start
const platformWidth = 65;
const platformHeight = 20;
const platformStart = canvas.height - 50;

// player physics
const gravity = 0.33;
const drag = 0.3;
const bounceVelocity = -12.5;

// minimum and maximum vertical space between each platform
let minPlatformSpace = 15;
let maxPlatformSpace = 20;

// information about each platform. the first platform starts in the
// bottom middle of the screen
let platforms = [{
  x: canvas.width / 2 - platformWidth / 2,
  y: platformStart
}];

// get a random number between the min (inclusive) and max (exclusive)
function random(min:any, max:any) {
  return Math.random() * (max - min) + min;
}

// fill the initial screen with platforms
let y = platformStart;
while (y > 0) {
  // the next platform can be placed above the previous one with a space
  // somewhere between the min and max space
  y -= platformHeight + random(minPlatformSpace, maxPlatformSpace);

  // a platform can be placed anywhere 25px from the left edge of the canvas
  // and 25px from the right edge of the canvas (taking into account platform
  // width).
  // however the first few platforms cannot be placed in the center so
  // that the player will bounce up and down without going up the screen
  // until they are ready to move
  let x;
  do {
    x = random(25, canvas.width - 25 - platformWidth);
  } while (
    y > canvas.height / 2 &&
    x > canvas.width / 2 - platformWidth * 1.5 &&
    x < canvas.width / 2 + platformWidth / 2
  );

  platforms.push({ x, y });
}

// the doodle jumper
const doodle = {
  width: 40,
  height: 60,
  x: canvas.width / 2 - 20,
  y: platformStart - 60,

  // velocity
  dx: 0,
  dy: 0
};

// keep track of player direction and actions
let playerDir = 0;
let keydown = false;
let prevDoodleY = doodle.y;

// game loop
function loop() {
  requestAnimationFrame(loop);
  context.clearRect(0,0,canvas.width,canvas.height);

  // apply gravity to doodle
  doodle.dy += gravity;

  // if doodle reaches the middle of the screen, move the platforms down
  // instead of doodle up to make it look like doodle is going up
  if (doodle.y < canvas.height / 2 && doodle.dy < 0) {
    platforms.forEach(function(platform) {
      platform.y += -doodle.dy;
    });

    // add more platforms to the top of the screen as doodle moves up
    while (platforms[platforms.length - 1].y > 0) {
      platforms.push({
        x: random(25, canvas.width - 25 - platformWidth),
        y: platforms[platforms.length - 1].y - (platformHeight + random(minPlatformSpace, maxPlatformSpace))
      })

      // add a bit to the min/max platform space as the player goes up
      minPlatformSpace += 0.5;
      maxPlatformSpace += 0.5;

      // cap max space
      maxPlatformSpace = Math.min(maxPlatformSpace, canvas.height / 2);
    }
  }
  else {
    doodle.y += doodle.dy;
  }

  // only apply drag to horizontal movement if key is not pressed
  if (!keydown) {
    if (playerDir < 0) {
      doodle.dx += drag;

      // don't let dx go above 0
      if (doodle.dx > 0) {
        doodle.dx = 0;
        playerDir = 0;
      }
    }
    else if (playerDir > 0) {
      doodle.dx -= drag;

      if (doodle.dx < 0) {
        doodle.dx = 0;
        playerDir = 0;
      }
    }
  }

  doodle.x += doodle.dx;

  // make doodle wrap the screen
  if (doodle.x + doodle.width < 0) {
    doodle.x = canvas.width;
  }
  else if (doodle.x > canvas.width) {
    doodle.x = -doodle.width;
  }

  // draw platforms
  context.fillStyle = 'green';
  platforms.forEach(function(platform) {
    context.fillRect(platform.x, platform.y, platformWidth, platformHeight);

    // make doodle jump if it collides with a platform from above
    if (
      // doodle is falling
      doodle.dy > 0 &&

      // doodle was previous above the platform
      prevDoodleY + doodle.height <= platform.y &&

      // doodle collides with platform
      // (Axis Aligned Bounding Box [AABB] collision check)
      doodle.x < platform.x + platformWidth &&
      doodle.x + doodle.width > platform.x &&
      doodle.y < platform.y + platformHeight &&
      doodle.y + doodle.height > platform.y
    ) {
      // reset doodle position so it's on top of the platform
      doodle.y = platform.y - doodle.height;
      doodle.dy = bounceVelocity;
    }
  });

  // draw doodle
  context.fillStyle = 'yellow';
  context.fillRect(doodle.x, doodle.y, doodle.width, doodle.height);

  prevDoodleY = doodle.y;

  // remove any platforms that have gone offscreen
  platforms = platforms.filter(function(platform) {
    return platform.y < canvas?.height;
  })
}

// listen to keyboard events to move doodle
document.addEventListener('keydown', function(e) {
  // left arrow key
  if (e.which === 37) {
    keydown = true;
    playerDir = -1;
    doodle.dx = -3;

  }
  // right arrow key
  else if (e.which === 39) {
    keydown = true;
    playerDir = 1;
    doodle.dx = 3;
  }
});

document.addEventListener('keyup', function(e) {
  keydown = false;
});

// start the game
requestAnimationFrame(loop);

  return () => {
    document.removeEventListener('keydown', () => {});
    document.removeEventListener('keyup', () => {});
  }
}, [])


  return (
    <div className="text-white text-2xl">
      <div> Use Left ⬅ and Right ➡ keys</div>
      <canvas ref={canvasRef} width="375" height="667" id="game"></canvas>
    </div>
  )
}
export default DoodleJumpGame