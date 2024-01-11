import React, { useEffect, useRef, useState } from "react";

interface SnakeGameProps {
  onValueChange: (newValue: number) => void;
}

const SnakeGame: React.FC<SnakeGameProps> = ({ onValueChange }) => {
  let gameOver = false;
  const [go, setGo] = useState(false);
  const scoreRef = useRef(0);
  const grid = 20;
  let count = 0;
  let speed = 0;
  const [screenWidth, setScreenWidth] = useState<number>(800);
  const [screenHeight, setScreenHeight] = useState<number>(600);


  function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  const isColliding = (
    obj1: { x: number; y: number },
    obj2: { x: number; y: number }
  ) => {
    return (
      obj1.x < obj2.x + grid &&
      obj1.x + grid > obj2.x &&
      obj1.y < obj2.y + grid &&
      obj1.y + grid > obj2.y
    );
  };

  useEffect(() => {
    interface Snake {
      x: number;
      y: number;
      dx: number;
      dy: number;
      cells: Array<{ x: number; y: number }>;
      maxCells: number;
    }

    const snake: Snake = {
      x: 160,
      y: 160,
      dx: grid,
      dy: 0,
      cells: [],
      maxCells: 4,
    };
    const apple = {
      x: 200,
      y: 200,
    };

    function loop() {
      requestAnimationFrame(loop);
      if (!go) {
        if (++count < 20) {
          return;
        }

        gameOver = false;
        count = speed;
        const canvas = document.getElementById("game") as HTMLCanvasElement;
        const context = canvas.getContext("2d") as CanvasRenderingContext2D;

        context.clearRect(0, 0, canvas.width, canvas.height);

        snake.x += snake.dx;
        snake.y += snake.dy;

        if (snake.x < 0) {
          snake.x = canvas.width - grid;
        } else if (snake.x >= canvas.width) {
          snake.x = 0;
        }

        if (snake.y < 0) {
          snake.y = canvas.height - grid;
        } else if (snake.y >= canvas.height) {
          snake.y = 0;
        }

        snake.cells.unshift({ x: snake.x, y: snake.y });

        if (snake.cells.length > snake.maxCells) {
          snake.cells.pop();
        }

        context.fillStyle = "red";
        context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

        context.fillStyle = "black";
        snake.cells.forEach(function (cell, index) {
          context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

          if (isColliding(cell, apple)) {
            snake.maxCells++;
            scoreRef.current = scoreRef.current + 1;

            onValueChange(scoreRef.current);
            console.log(scoreRef.current);
            apple.x = getRandomInt(0, 25) * grid;
            apple.y = getRandomInt(0, 25) * grid;
          }

          for (var i = index + 1; i < snake.cells.length; i++) {
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
              console.log("Game Over");
              snake.x = 160;
              snake.y = 160;
              snake.cells = [];
              snake.maxCells = 4;
              snake.dx = grid;
              snake.dy = 0;

              apple.x = getRandomInt(0, canvas.width / grid) * grid;
              apple.y = getRandomInt(0, canvas.height / grid) * grid;
              while (snake.cells.some((c) => isColliding(c, apple))) {
                apple.x = getRandomInt(0, canvas.width / grid) * grid;
                apple.y = getRandomInt(0, canvas.height / grid) * grid;
              }
              gameOver = true;
            }
          }

          if (gameOver) {
            setGo(true);
          }
        });
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.which === 37 && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
      } else if (e.which === 38 && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
      } else if (e.which === 39 && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
      } else if (e.which === 40 && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const { clientX, clientY } = e.touches[0];
      const deltaX = clientX - snake.x;
      const deltaY = clientY - snake.y;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && snake.dx === 0) {
          snake.dx = grid;
          snake.dy = 0;
        } else if (deltaX < 0 && snake.dx === 0) {
          snake.dx = -grid;
          snake.dy = 0;
        }
      } else {
        if (deltaY > 0 && snake.dy === 0) {
          snake.dy = grid;
          snake.dx = 0;
        } else if (deltaY < 0 && snake.dy === 0) {
          snake.dy = -grid;
          snake.dx = 0;
        }
      }
    };

    const handleTouchEnd = () => {
      // Handle touch end if needed
    };

    const handleResize = () => {
      const canvas = document.getElementById("game") as HTMLCanvasElement;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    handleResize();
 
    
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setScreenWidth(window.innerWidth);
        setScreenHeight(window.innerHeight);
      };

      // Initial setup
      handleResize();

      // Event listener for screen resize
      window.addEventListener("resize", handleResize);
      window.addEventListener("resize", handleResize);
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("touchstart", handleTouchStart);
      document.addEventListener("touchend", handleTouchEnd);
    }

    requestAnimationFrame(loop);

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("touchstart", handleTouchStart);
        document.removeEventListener("touchend", handleTouchEnd);
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);


 
  const handleRestart = () => {
    setGo(false);
    scoreRef.current = 0;
    onValueChange(scoreRef.current);
    localStorage.setItem("score", "0");
  };

  return (
    <div className="flex w-full justify-center items-center max-h-screen overflow-hidden">
     
      <div>
        <canvas
          id="game"
          width={
            screenWidth > 770 && screenHeight > 770 ? "700" : `700px`
          }
          height={
            screenWidth > 770 && screenHeight  > 770 ? "700" : `700px`
          }
          className={` bg-[#f8f8f8] ${go ? "hidden" : ""} p-5 ${
            screenWidth < 770 ? "hidden" : "flex" 
          }  ${screenWidth > 770 && screenHeight  > 770 ? "":"scale-[70%]"} overflow-hidden`}
        ></canvas>
        {go && (
          <div
            className={`flex flex-col items-center justify-center min-h-[500px] min-w-[500px] text-black text-6xl bg-[#f8f8f8] ${
              !go ? "hidden" : ""
            }`}
          >
            <div className="p-5">Game Over.</div>
            <button
              onClick={handleRestart}
              className="bg-black rounded-md p-2 text-3xl text-white"
            >
              Restart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnakeGame;
