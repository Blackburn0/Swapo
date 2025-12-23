import { useState, useEffect } from 'react';

/**
 * Custom hook to check if a CSS media query matches the current viewport.
 * Uses the non-deprecated addEventListener/removeEventListener API.
 * * @param query The CSS media query string (e.g., '(min-width: 1025px)').
 * @returns A boolean indicating whether the media query currently matches.
 */
const useMediaQuery = (query: string): boolean => {
  // Initialize state with false. The useEffect will update it on mount.
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // 1. Check for browser environment
    if (typeof window === 'undefined') {
      return;
    }

    // 2. Get the MediaQueryList object
    const media: MediaQueryList = window.matchMedia(query);

    // 3. Define the listener function
    // The change event passes a MediaQueryListEvent object as its argument
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);

    // 4. Set initial match state right away
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    // 5. Use the modern addEventListener method to listen for changes
    media.addEventListener('change', listener);

    // 6. Cleanup function: Use the modern removeEventListener method
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]); // Dependency on 'query'

  return matches;
};

export default useMediaQuery;
