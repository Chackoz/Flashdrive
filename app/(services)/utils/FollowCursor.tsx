// hooks/useCursorPosition.ts

import { useEffect, useState } from 'react';

interface Position {
  x: number;
  y: number;
}

export const CursorPosition = (): Position => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return position;
};
