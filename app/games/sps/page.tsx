"use client"
import { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';

const moves = ['rock', 'paper', 'scissors'];

const getRandomMove = () => moves[Math.floor(Math.random() * moves.length)];

const determineWinner = (userMove: string, rnnMove: string) => {
  if (userMove === rnnMove) {
    return "It's a tie!";
  } else if (
    (userMove === 'rock' && rnnMove === 'scissors') ||
    (userMove === 'scissors' && rnnMove === 'paper') ||
    (userMove === 'paper' && rnnMove === 'rock')
  ) {
    return 'You win!';
  } else {
    return 'RNN wins!';
  }
};

const createModel = () => {
  const model = tf.sequential();
  model.add(tf.layers.lstm({ units: 64, inputShape: [2, 3], returnSequences: false }));
  model.add(tf.layers.dense({ units: 3, activation: 'softmax' }));
  model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy'] });
  return model;
};

const App: React.FC = () => {
    const [model, setModel] = useState<tf.Sequential | null>(null);
    const [history, setHistory] = useState<number[]>([]); // Change the type here
    const [rnnMove, setRnnMove] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
  
    useEffect(() => {
      setModel(createModel());
    }, []);
  
    const handleUserMove = async (userMove: string) => {
      console.log(userMove)
        if (userMove === 'exit') {
          setResult('Game over.');
          return;
        }
      
        if (!moves.includes(userMove)) {
          setResult('Invalid move. Please try again.');
          return;
        }
      
        const newHistory = [...history, moves.indexOf(userMove)];
      
        if (model && newHistory.length >= 2) {
          const inputTensor = tf.tensor3d([newHistory[1]], [1, 2,3]); // Ensure correct shape
          const rnnMoveIndex = (await model.predict(inputTensor) as tf.Tensor).argMax().dataSync()[0];
          setRnnMove(moves[rnnMoveIndex]);
          console.log("RNN")
        }
      
        setResult(determineWinner(userMove, rnnMove || ''));
      };

   

   


  return (
    <div>
      <div className='bg-black text-white gap-6'>
        <button onClick={() => handleUserMove('rock')}>Rock</button>
        <button onClick={() => handleUserMove('paper')}>Paper</button>
        <button onClick={() => handleUserMove('scissors')}>Scissors</button>
      </div>
      <p>RNNs move: {rnnMove}</p>
      <p>{result}</p>
    </div>
  );
};

export default App;
