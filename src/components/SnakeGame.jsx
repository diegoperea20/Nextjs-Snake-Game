"use client";
import React, { useState, useEffect, useRef } from 'react';

const SnakeGame = ({ onScoreUpdate, onGameOver, reset }) => {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [nextDirection, setNextDirection] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const tileSize = 20;
  const canvasSize = 400;

  useEffect(() => {
    if (reset) {
      setSnake([
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 },
      ]);
      setFood({ x: 15, y: 15 });
      setDirection({ x: 1, y: 0 });
      setNextDirection({ x: 1, y: 0 });
      setScore(0);
      setGameOver(false);
      onScoreUpdate(0);
    }
  }, [reset, onScoreUpdate]);

  useEffect(() => {
    const context = canvasRef.current.getContext('2d');

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setNextDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setNextDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setNextDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setNextDirection({ x: 1, y: 0 });
          break;
      }
    };

    const moveSnake = () => {
      if (gameOver) return;

      const newSnake = [...snake];
      const head = { x: newSnake[0].x + nextDirection.x, y: newSnake[0].y + nextDirection.y };

      // Check for wall collisions
      if (
        head.x < 0 ||
        head.x >= canvasSize / tileSize ||
        head.y < 0 ||
        head.y >= canvasSize / tileSize
      ) {
        setGameOver(true);
        onGameOver();
        return;
      }

      // Check for self collisions
      for (let i = 1; i < newSnake.length; i++) {
        if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
          setGameOver(true);
          onGameOver();
          return;
        }
      }

      newSnake.unshift(head);
      setDirection(nextDirection);

      // Check for food collision
      if (head.x === food.x && head.y === food.y) {
        setFood({
          x: Math.floor(Math.random() * (canvasSize / tileSize)),
          y: Math.floor(Math.random() * (canvasSize / tileSize)),
        });
        setScore(score + 1);  // Incrementar la puntuación
        onScoreUpdate(score + 1);  // Actualizar la puntuación en el componente padre
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const drawGame = () => {
      context.clearRect(0, 0, canvasSize, canvasSize);

      // Draw food
      context.fillStyle = 'red';
      context.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);

      // Draw snake
      context.fillStyle = 'green';
      for (let segment of snake) {
        context.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
      }

      if (gameOver) {
        context.fillStyle = 'white';
        context.font = 'bold 45px sans-serif';
        context.shadowColor = 'black';
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowBlur = 4;
        const text = 'Game Over';
        const textWidth = context.measureText(text).width;
        context.fillText(text, (canvasSize - textWidth) / 2, canvasSize / 2);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    const gameLoop = setInterval(() => {
      moveSnake();
      drawGame();
    }, 100);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(gameLoop);
    };
  }, [snake, direction, nextDirection, food, gameOver, score, onScoreUpdate, onGameOver]);

  return <canvas ref={canvasRef} width={canvasSize} height={canvasSize} />;
};

export default SnakeGame;
