import { useState, useEffect } from 'react';

export type OrientationType = 'portrait' | 'landscape';

export const useOrientation = (): OrientationType => {
  const [orientation, setOrientation] = useState<OrientationType>(() => {
    // Initial orientation check
    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
  });

  useEffect(() => {
    const handleOrientationChange = () => {
      const newOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
      setOrientation(newOrientation);
    };

    // Listen for resize events (works on all platforms)
    window.addEventListener('resize', handleOrientationChange);

    // Listen for orientation change events (mobile specific)
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return orientation;
};
