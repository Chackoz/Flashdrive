// pages/index.tsx
"use client"
import SnakeGame from '@/app/components/SnakeGame';
import React, { useEffect, useState } from 'react';

const Home: React.FC = () => {
    const [variable, setVariable] = useState<number>(0);



    const handleVariableChange = (newValue: number) => {
        setVariable(newValue);
    };

    return (
        <div className='flex flex-col w-full min-h-screen  bg-white justify-center items-center'>
            <div className='bg-white text-green-600 text-6xl'>Score: {variable}</div>
            <SnakeGame onValueChange={handleVariableChange} />
        </div>
    );
};

export default Home;
