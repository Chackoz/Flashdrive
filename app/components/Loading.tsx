
"use client"
import { useEffect, useState } from 'react';

interface LoadingProps {
  isLoading: boolean;
}

const Loading: React.FC<LoadingProps> = ({ isLoading }) => {
  const [counter, setCounter] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isLoading) {
      interval = setInterval(() => {
        setCounter((prevCounter) => prevCounter + 1);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isLoading]);

  if (!isLoading) {
    return null;
  }

  return (
    <div className='flex w-full h-full font-logo md:text-[7rem] text-[4rem] justify-center items-center transition-all '>
        {counter}
      
    </div>
  );
};

export default Loading;
