import React from 'react';

export const TSGLogo = ({ width = 85, height = 85, style = {} }) => {
  return (
    <img 
      src="/tsg-logo.png" 
      alt="TSG Logo" 
      width={width}
      height={height}
      style={{
        objectFit: 'contain',
        maxWidth: '100%',
        maxHeight: '100%',
        ...style
      }}
    />
  );
};
