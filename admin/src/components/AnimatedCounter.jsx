import React, { useEffect, useRef, useState } from 'react';

// AnimatedCounter: counts up from 0 to value
const AnimatedCounter = ({ value, duration = 1200, className = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef();

  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (start === end) return;
    const incrementTime = Math.abs(Math.floor(duration / (end - start)));
    let current = start;
    const timer = setInterval(() => {
      current += 1;
      setCount(current);
      if (current === end) clearInterval(timer);
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <span ref={ref} className={className}>{count}</span>;
};

export default AnimatedCounter;
