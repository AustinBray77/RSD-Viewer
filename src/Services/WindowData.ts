import React from 'react';
import { useStatePair } from '../StatePair';

const useMousePosition = () => {
  const mousePosition = useStatePair({ x: 0, y: 0 });
  
  React.useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
        mousePosition.Set({ x: ev.clientX, y: ev.clientY });
    };
    
    window.addEventListener('mousemove', updateMousePosition);
    
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return mousePosition;
};

export default useMousePosition;