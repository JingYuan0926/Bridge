// hooks/useKeyPress.js
import { useState, useEffect } from 'react';

const useKeyPress = (targetKey) => {
  const [keyPressed, setKeyPressed] = useState(false);

  const downHandler = ({ key }) => {
    if (key.toLowerCase() === targetKey.toLowerCase()) {
      setKeyPressed(true);
    }
  };

  const upHandler = ({ key }) => {
    if (key.toLowerCase() === targetKey.toLowerCase()) {
      setKeyPressed(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []);

  return keyPressed;
};

export default useKeyPress;
