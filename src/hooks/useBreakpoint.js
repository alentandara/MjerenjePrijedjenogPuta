import { useState, useEffect } from 'react';

// Definiramo Bootstrap breakpoint pragove
const getBreakpoint = (width) => {
  switch (true) {
    case width < 576:
      return 'xs';
    case width < 768:
      return 'sm';
    case width < 992:
      return 'md';
    case width < 1200:
      return 'lg';
    case width < 1400:
      return 'xl';
    default:
      return 'xxl';
  }
};

const useBreakpoint = () => {
  // Postavljamo početno stanje na temelju trenutne širine prozora
  const [breakpoint, setBreakpoint] = useState(() => getBreakpoint(window.innerWidth));

  useEffect(() => {
    const handleResize = () => {
      const currentBreakpoint = getBreakpoint(window.innerWidth);
      
      // Ažuriramo state samo ako se breakpoint zapravo promijenio (optimizacija)
      setBreakpoint((prev) => {
        if (prev !== currentBreakpoint) {
          return currentBreakpoint;
        }
        return prev;
      });
    };

    // Dodajemo event listener
    window.addEventListener('resize', handleResize);

    // Cleanup funkcija koja uklanja listener kod unmountanja komponente
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
};

export default useBreakpoint;