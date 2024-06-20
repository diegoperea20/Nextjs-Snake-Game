"use client";
import { useState } from 'react';
import SnakeGame from "@/components/SnakeGame";
import Link from 'next/link';

export default function Home() {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [reset, setReset] = useState(false);

  const handleScoreUpdate = (newScore) => {
    setScore(newScore);
  };

  const handleGameOver = () => {
    setGameOver(true);
  };

  const resetGame = () => {
    setScore(0);
    setGameOver(false);
    setReset(true);
    setTimeout(() => setReset(false), 0); // Reset immediately after triggering the reset state
  };

  const handleDirectionChange = (direction) => {
    const event = new KeyboardEvent('keydown', { key: direction });
    document.dispatchEvent(event);
  };

  return (
    <div className="div-game" style={{ textAlign: 'center' }}>
      <h1>Snake Game</h1>
      <h2>Score: {score}</h2>
      <SnakeGame onScoreUpdate={handleScoreUpdate} onGameOver={handleGameOver} reset={reset} />
      {gameOver && <button onClick={resetGame}>Play Again</button>}
      <div className="controls">
        <button onClick={() => handleDirectionChange('ArrowUp')}>↑</button>
        <button onClick={() => handleDirectionChange('ArrowLeft')}>←</button>
        <button onClick={() => handleDirectionChange('ArrowDown')}>↓</button>
        <button onClick={() => handleDirectionChange('ArrowRight')}>→</button>
      </div>
      <div className="project-github">
      <p>This project is in </p>
      <Link href="https://github.com/diegoperea20/Nextjs-Snake-Game">
        <img width="96" height="96" src="https://img.icons8.com/fluency/96/github.png" alt="github"/>
      </Link>
    </div>
    </div>
  );
}
