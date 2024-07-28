// components/Map.js
import React from 'react';
import Character from './Character';
import FloatingLoginButton from './FloatingLoginButton';
const Map = () => {
  return (
    
    <div
      style={{
        position: 'absoulte',
        width: '100%', // Viewport width
        height: '100%', // Viewport height
        overflow: 'hidden',
        background: 'skyblue',
        margin: 0,
      }}
    >

      <div
        style={{
          position: 'absolute',
          width: '100%', // Adjust based on actual map size
          height: '100%',
          top: 0,
          left: 0,
          background: 'url(/map.png) no-repeat center center/cover',
        }}
      ></div>
      <Character />
    </div>
  );
};

export default Map;
