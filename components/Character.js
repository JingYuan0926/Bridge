// components/Character.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useKeyPress from '../hooks/useKeyPress';
import Image from 'next/image';

const Character = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [sprite, setSprite] = useState('/csy1.png'); // Default sprite
  const router = useRouter(); // Use the useRouter hook

  const moveLeft = useKeyPress('a');
  const moveRight = useKeyPress('d');
  const jump = useKeyPress('w');
  const navigate = useKeyPress(' '); // Detect spacebar press
  const tutorial = useKeyPress('t'); // Detect 't' key press
  const quiz = useKeyPress('q'); // Detect 'q' key press

  useEffect(() => {
    let interval;
    if (moveLeft) {
      setSprite('/csy2.png'); // Sprite for moving left
      interval = setInterval(() => {
        setPosition((pos) => ({ ...pos, x: pos.x - 5 }));
      }, 50);
    }

    if (moveRight) {
      setSprite('/csy1.png'); // Sprite for moving right
      interval = setInterval(() => {
        setPosition((pos) => ({ ...pos, x: pos.x + 5 }));
      }, 50);
    }

    if (jump) {
      setPosition((pos) => ({ ...pos, y: pos.y - 10 }));
      setTimeout(() => {
        setPosition((pos) => ({ ...pos, y: pos.y + 10 }));
      }, 300); // Simulate jump duration
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [moveLeft, moveRight, jump]);

  useEffect(() => {
    if (navigate) {
      router.push('/room'); // Replace '/newpage' with your desired route
    }
  }, [navigate, router]);
  useEffect(() => {
    if (quiz) {
      router.push('./quiz'); // Replace '/newpage' with your desired route
    }
  }, [quiz, router]);
  useEffect(() => {
    if (tutorial) {
      router.push('./tutorial'); // Replace '/newpage' with your desired route
    }
  }, [tutorial, router]);

  return (
    <div
      style={{
        position: 'absolute',
        left: `calc(50% + ${position.x}px)`, // Center horizontally within the viewport
        bottom: '27.5%', // Position relative to the bottom
        transform: 'scale(2)', // Adjust the scale as needed
        transformOrigin: 'center center', // Ensure the character is scaled from its center
        transition: 'left 0.1s, bottom 0.3s',
      }}
    >
      <Image src={sprite} alt="Character" width={50} height={50} />
    </div>
  );
};

export default Character;
