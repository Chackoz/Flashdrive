// components/PongGame.tsx

"use client"
import { useEffect, useRef, useState } from 'react';

const PongGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);


  useEffect(() => {

    const canvas = canvasRef.current as HTMLCanvasElement;
    const context = canvas?.getContext('2d') as CanvasRenderingContext2D;
    if (!canvas || !context) {
      console.error('Canvas or context not available');
      return;
    }
    let paddleSpeed = 6;
    let ballSpeed = 5;
    const grid = 15;
    const paddleHeight = grid * 5;
    const maxPaddleY = canvas.height! - grid - paddleHeight;

    const ball = {
      x: canvas.width! / 2,
      y: canvas.height! / 2,
      width: grid,
      height: grid,
      resetting: false,
      dx: ballSpeed,
      dy: -ballSpeed,
    };

    const leftPaddle = {
      x: grid * 2,
      y: canvas.height! / 2 - paddleHeight / 2,
      width: grid,
      height: paddleHeight,
      dy: 0,
    };

    const rightPaddle = {
      x: canvas.width! - grid * 3,
      y: canvas.height! / 2 - paddleHeight / 2,
      width: grid,
      height: paddleHeight,
      dy: 0,
    };

    function collides(obj1: any, obj2: any): boolean {
      return (
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
      );
    }

    function loop() {
      if (!paused) {
        requestAnimationFrame(loop);
      }

      context.clearRect(0, 0, canvas.width!, canvas.height!);

      leftPaddle.y += leftPaddle.dy;
      rightPaddle.y += rightPaddle.dy;

      if (leftPaddle.y < grid) {
        leftPaddle.y = grid;
      } else if (leftPaddle.y > maxPaddleY) {
        leftPaddle.y = maxPaddleY;
      }

      if (rightPaddle.y < grid) {
        rightPaddle.y = grid;
      } else if (rightPaddle.y > maxPaddleY) {
        rightPaddle.y = maxPaddleY;
      }

      context.fillStyle = 'black';
      context.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
      context.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

      ball.x += ball.dx;
      ball.y += ball.dy;

      if (ball.y < grid) {
        ball.y = grid;
        ball.dy *= -1;
      } else if (ball.y + grid > canvas.height! - grid) {
        ball.y = canvas.height! - grid * 2;
        ball.dy *= -1;
      }

      if ((ball.x < 0 || ball.x > canvas.width!) && !ball.resetting) {
        ball.resetting = true;
        setPaused(true);
        setGameOver(true);
      }

      if (collides(ball, leftPaddle)) {
        ball.dx *= -1;
        setScore((prevScore) => prevScore + 0.5);
        ball.x = leftPaddle.x + leftPaddle.width;
      } else if (collides(ball, rightPaddle)) {
        setScore((prevScore) => prevScore + 0.5);
        ball.dx *= -1;
        ball.x = rightPaddle.x - ball.width;
      }

      context.fillRect(ball.x, ball.y, ball.width, ball.height);

      context.fillStyle = 'black';
      context.fillRect(0, 0, canvas.width!, grid);
      context.fillRect(0, canvas.height! - grid, canvas.width!, canvas.height!);

      context.fillRect(canvas.width, canvas.width, grid, grid);

      for (let i = grid; i < canvas.height! - grid; i += grid * 2) {
        context.fillRect(canvas.width! / 2 - grid / 2, i, grid, grid);
      }
    }

    document.addEventListener('keydown', function (e) {
      if (e.which === 38) {
        rightPaddle.dy = -paddleSpeed;
      } else if (e.which === 40) {
        rightPaddle.dy = paddleSpeed;
      }

      if (e.which === 87) {
        leftPaddle.dy = -paddleSpeed;
      } else if (e.which === 83) {
        leftPaddle.dy = paddleSpeed;
      }
    });

    document.addEventListener('keyup', function (e) {
      if (e.which === 38 || e.which === 40) {
        rightPaddle.dy = 0;
      }

      if (e.which === 83 || e.which === 87) {
        leftPaddle.dy = 0;
      }
    });

    if (!paused) {
      requestAnimationFrame(loop);
    }

    return () => {
      document.removeEventListener('keydown', function () { });
      document.removeEventListener('keyup', function () { });
    };
  }, [paused, gameOver]);

  const handleRestart = () => {
    setGameOver(false);
    setPaused(true);

    setTimeout(() => {
      setPaused(false);
      setScore(0);

      const canvas = canvasRef.current as HTMLCanvasElement;
      let paddleSpeed = 6;
      let ballSpeed = 5;
      const grid = 15;
      const paddleHeight = grid * 5;
      const maxPaddleY = canvas.height! - grid - paddleHeight;

      const ball = {
        x: canvas.width! / 2,
        y: canvas.height! / 2,
        width: grid,
        height: grid,
        resetting: false,
        dx: ballSpeed,
        dy: -ballSpeed,
      };


    }, 400);
  };
  return <div className='flex flex-col w-full min-h-screen justify-center items-center '>
    <div className='text-black text-4xl'>Score : {score}</div>

    <canvas ref={canvasRef} width={750} height={585} className={`border-black b-2 ${gameOver ? 'hidden' : ''}`} />


    <div className={`w-hull h-full flex flex-col items-center justify-center text-black text-6xl   ${!gameOver ? 'hidden' : ''}`}>
      <div className='p-5'>Game Over. </div>
      <button onClick={handleRestart} className='bg-black rounded-md p-2 text-3xl text-white'>Restart</button>
    </div>


  </div>;
};

export default PongGame;