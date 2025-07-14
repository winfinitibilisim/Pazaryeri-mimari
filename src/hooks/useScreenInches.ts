import { useState, useEffect } from 'react';

// Returns the current screen width in inches (approximate, assumes 96dpi)
export function useScreenInches() {
  const getInches = () => window.innerWidth / 96;
  const [inches, setInches] = useState(getInches());

  useEffect(() => {
    const handleResize = () => setInches(getInches());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return inches;
}
