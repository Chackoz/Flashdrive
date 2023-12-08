// app/components/SnakeGame.tsx
import React, { useEffect, useRef, useState } from 'react';

interface SnakeGameProps {
    onValueChange: (newValue: number) => void;
}

const SnakeGame: React.FC<SnakeGameProps> = ({ onValueChange }) => {
    let gameOver = false;
    const [go, setGo] = useState(false);
    const scoreRef = useRef(0);
    const grid = 20;
    let count = 0;

    function getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min)) + min;
    }

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
            x: 60,
            y: 60,
        };

        function loop() {
            requestAnimationFrame(loop);
            if (!go) {
                if (++count < 20) {
                    return;
                }

                gameOver = false;
                count = 0;
                const canvas = document.getElementById('game') as HTMLCanvasElement;
                const context = canvas.getContext('2d') as CanvasRenderingContext2D;

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

                context.fillStyle = 'red';
                context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

                context.fillStyle = 'black';
                snake.cells.forEach(function (cell, index) {
                    context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

                    if (cell.x === apple.x && cell.y === apple.y) {
                        snake.maxCells++;
                        scoreRef.current = scoreRef.current + 1;
                        onValueChange(scoreRef.current);
                        console.log(scoreRef.current);
                        apple.x = getRandomInt(0, 25) * grid;
                        apple.y = getRandomInt(0, 25) * grid;
                    }

                    for (var i = index + 1; i < snake.cells.length; i++) {
                        if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                            console.log('Game Over');
                            snake.x = 160;
                            snake.y = 160;
                            snake.cells = [];
                            snake.maxCells = 4;
                            snake.dx = grid;
                            snake.dy = 0;

                            apple.x = getRandomInt(0, 25) * grid;
                            apple.y = getRandomInt(0, 25) * grid;
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
                // Horizontal swipe
                if (deltaX > 0 && snake.dx === 0) {
                    snake.dx = grid;
                    snake.dy = 0;
                } else if (deltaX < 0 && snake.dx === 0) {
                    snake.dx = -grid;
                    snake.dy = 0;
                }
            } else {
                // Vertical swipe
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
            const canvas = document.getElementById('game') as HTMLCanvasElement;
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
    
        // Call handleResize once to set initial dimensions
        handleResize();
    
        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchend', handleTouchEnd);

        requestAnimationFrame(loop);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('resize', handleResize);
        };
    }, [gameOver]);

    const handleRestart = () => {
        setGo(false);
        
        scoreRef.current = 0;
        onValueChange(scoreRef.current);
        localStorage.setItem('score', '0');
    };

    return (
        <div className="flex w-full justify-center items-center bg-white">
            <canvas id="game" width="1000" height="700" className={`bg-[#f8f8f8] ${go ? 'hidden' : ''} `}></canvas>
            {go && (
                <div className={`flex flex-col items-center justify-center w-full h-full text-black text-6xl   ${!go ? 'hidden' : ''}`}>
                    <div className='p-5'>Game Over. </div>
                    <button onClick={handleRestart} className='bg-black rounded-md p-2 text-3xl text-white'>Restart</button>
                </div>
            )}
        </div>
    );
};

export default SnakeGame;
