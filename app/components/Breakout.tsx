// components/BreakoutGame.tsx
'use client'
import React, { useEffect, useRef, useState } from 'react';
interface BreakoutGameProps {
  scoreUpdate: (newValue: number) => void;
}
const BreakoutGame: React.FC<BreakoutGameProps> = ({scoreUpdate}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scoreRef = useRef(0);
  const [gameOver,setGameOver] = useState(false);
  const [hitSpace,setHitSpace] = useState(false);

  useEffect(() => {
    
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !context) return;

    const level1 = [
      [],
      [],
      [],
      [],
      [],
      [],
      ['R','R','R','R','R','R','R','R','R','R','R','R','R','R'],
      ['R','R','R','R','R','R','R','R','R','R','R','R','R','R'],
      ['O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
      ['O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
      ['G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
      ['G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
      ['Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y'],
      ['Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y']
    ];
    
    // create a mapping between color short code (R, O, G, Y) and color name
    const colorMap = {
      'R': 'red',
      'O': 'orange',
      'G': 'green',
      'Y': 'yellow'
    };
    
    // use a 2px gap between each brick
    const brickGap = 2;
    const brickWidth = 25;
    const brickHeight = 12;
    
    // the wall width takes up the remaining space of the canvas width. with 14 bricks
    // and 13 2px gaps between them, that's: 400 - (14 * 25 + 2 * 13) = 24px. so each
    // wall will be 12px
    const wallSize = 12;
    const bricks:any[] = [];
    
    // create the level by looping over each row and column in the level1 array
    // and creating an object with the bricks position (x, y) and color
    for (let row = 0; row < level1.length; row++) {
      for (let col = 0; col < level1[row].length; col++) {
        const colorCode = level1[row][col];
    
        bricks.push({
          x: wallSize + (brickWidth + brickGap) * col,
          y: wallSize + (brickHeight + brickGap) * row,
          color: colorMap[colorCode],
          width: brickWidth,
          height: brickHeight
        });
      }
    }
    
    const paddle = {
      // place the paddle horizontally in the middle of the screen
      x: canvas.width / 2 - brickWidth / 2,
      y: 440,
      width: brickWidth,
      height: brickHeight,
    
      // paddle x velocity
      dx: 0
    };
    
    const ball = {
      x: 130,
      y: 260,
      width: 5,
      height: 5,
      color: 'black',
      // how fast the ball should go in either the x or y direction
      speed: 2,
    
      // ball velocity
      dx: 0,
      dy: 0
    };
    
    // check for collision between two objects using axis-aligned bounding box (AABB)
    // @see https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
    function collides(obj1, obj2) {
      return obj1.x < obj2.x + obj2.width &&
             obj1.x + obj1.width > obj2.x &&
             obj1.y < obj2.y + obj2.height &&
             obj1.y + obj1.height > obj2.y;
    }

  const loop=()=> {
      requestAnimationFrame(loop);
      context.clearRect(0, 0, canvas.width, canvas.height);
      // move paddle by its velocity
      paddle.x += paddle.dx;

      // prevent paddle from going through walls
      if (paddle.x < wallSize) {
        paddle.x = wallSize;
      } else if (paddle.x + brickWidth > canvas.width - wallSize) {
        paddle.x = canvas.width - wallSize - brickWidth;
      }

      // move ball by its velocity
      ball.x += ball.dx;
      ball.y += ball.dy;

      // prevent ball from going through walls by changing its velocity
      // left & right walls
      if (ball.x < wallSize) {
        ball.x = wallSize;
        ball.dx *= -1;
      } else if (ball.x + ball.width > canvas.width - wallSize) {
        ball.x = canvas.width - wallSize - ball.width;
        ball.dx *= -1;
      }
      // top wall
      if (ball.y < wallSize) {
        ball.y = wallSize;
        ball.dy *= -1;
      }

      // reset ball if it goes below the screen
      if (ball.y > canvas.height) {
        ball.x = 130;
        ball.y = 260;
        ball.dx = 0;
        ball.dy = 0;
        setGameOver(true);
      }

      // check to see if ball collides with paddle. if they do change y velocity
      if (collides(ball, paddle)) {
        ball.dy *= -1;

        // move ball above the paddle otherwise the collision will happen again
        // in the next frame
        ball.y = paddle.y - ball.height;
      }

      // check to see if ball collides with a brick. if it does, remove the brick
      // and change the ball velocity based on the side the brick was hit on
      for (let i = 0; i < bricks.length; i++) {
        const brick = bricks[i];

        if (collides(ball, brick)) {
          // remove brick from the bricks array
          bricks.splice(i, 1);
          console.log("Score ++");
          scoreRef.current = scoreRef.current + 1;
          scoreUpdate(scoreRef.current);
         // setScore(count+1);

          // ball is above or below the brick, change y velocity
          // account for the ball's speed since it will be inside the brick when it
          // collides
          if (ball.y + ball.height - ball.speed <= brick.y ||
              ball.y >= brick.y + brick.height - ball.speed) {
            ball.dy *= -1;
          }
          // ball is on either side of the brick, change x velocity
          else {
            ball.dx *= -1;
          }

          break;
        }
      }

      // draw walls
      context.fillStyle = 'lightgrey';
      context.fillRect(0, 0, canvas.width, wallSize);
      context.fillRect(0, 0, wallSize, canvas.height);
      context.fillRect(canvas.width - wallSize, 0, wallSize, canvas.height);

      // draw ball if it's moving
      if (ball.dx || ball.dy) {
        context.fillStyle = ball.color;
        context.fillRect(ball.x, ball.y, ball.width, ball.height);
      }

      // draw bricks
      bricks.forEach(function(brick) {
        context.fillStyle = brick.color;
        context.fillRect(brick.x, brick.y, brick.width, brick.height);
      });

      // draw paddle
      context.fillStyle = 'cyan';
      context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    }

    // Listen to keyboard events...
    const handleKeyDown = (e) => {
      // left arrow key
      if (e.which === 37) {
        paddle.dx = -3;
      }
      // right arrow key
      else if (e.which === 39) {
        paddle.dx = 3;
      }

      // space key
      // if the ball is not moving, we can launch the ball using the space key. ball
      // will move towards the bottom right to start
      if (ball.dx === 0 && ball.dy === 0 && e.which === 32) {
        setHitSpace(true);
        ball.dx = ball.speed;
        ball.dy = ball.speed;
      }
    };

    const handleKeyUp = (e) => {
      if (e.which === 37 || e.which === 39) {
        paddle.dx = 0;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Start the game
    requestAnimationFrame(loop);
   

    return () => {
      
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameOver]); 
   
  const handleRestart =()=>{
    setGameOver(false);
    scoreRef.current = 0;
    scoreUpdate(scoreRef.current);
    setHitSpace(false);
    
  }

  return (
    <>
    <div className={`text-white ${hitSpace? 'hidden':'' }`}>Press Space to Start</div>
    <canvas
      className={`mx-auto mt-4 border-white bg-[#f8f8f8] ${gameOver ? 'hidden' : ''}`}

      width="400"
      height="500"
      ref={canvasRef}

    ></canvas>
{gameOver && (
                <div className={`flex flex-col items-center justify-center w-full h-full text-black text-3xl `}>
                    <div className='p-5 text-white'>Game Over. </div>
                    <button onClick={handleRestart} className='bg-blue-600 rounded-md  p-2 text-xl text-white'>Restart</button>
                </div>
            )}
    </>
  );
};

export default BreakoutGame;
