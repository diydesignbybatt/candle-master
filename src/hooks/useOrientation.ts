import { useState, useEffect } from 'react';

export interface OrientationState {
  isLandscape: boolean;
  isTablet: boolean;
}

export const useOrientation = (): OrientationState => {
  const [state, setState] = useState<OrientationState>(() => {
    // Initial check
    const width = window.innerWidth;
    const height = window.innerHeight;
    return {
      isLandscape: width > height,
      isTablet: Math.min(width, height) >= 768
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setState({
        isLandscape: width > height,
        isTablet: Math.min(width, height) >= 768
      });
    };

    // Listen for resize events (works on all platforms)
    window.addEventListener('resize', handleResize);

    // Listen for orientation change events (mobile specific)
    window.addEventListener('orientationchange', handleResize);

    // Initial check in case something changed
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return state;
};
