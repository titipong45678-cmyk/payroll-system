import React from 'react';

export const TSGLogo = ({ size = 80, style = {} }) => {
  return (
    <div 
      style={{ 
        width: `${size}px`, 
        height: `${size}px`, 
        minWidth: `${size}px`, 
        minHeight: `${size}px`, 
        flexShrink: 0, 
        display: 'inline-flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        ...style 
      }}
    >
      <img 
        src="/tsg-logo.png" 
        alt="TSG Logo" 
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          aspectRatio: '1 / 1',
          display: 'block'
        }}
      />
    </div>
  );
};
