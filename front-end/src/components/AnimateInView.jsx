// src/components/AnimateInView.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

const AnimateInView = ({
  children,
  className = '',
  animationFrom = { opacity: 0, transform: 'translateY(50px)' },
  animationTo = { opacity: 1, transform: 'translateY(0px)' },
  config = { tension: 280, friction: 60 },
  threshold = 0.1,
  rootMargin = '-100px',
  triggerOnce = true,
  tag = 'div',
  ...rest
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (triggerOnce && ref.current) { // Check ref.current before unobserving
            observer.unobserve(ref.current);
          }
        } else if (!triggerOnce) {
          // setInView(false); // Optional reset
        }
      },
      { threshold, rootMargin }
    );

    const currentRef = ref.current; // Capture ref value
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef); // Use captured value in cleanup
      }
       observer.disconnect()
    };
  }, [threshold, rootMargin, triggerOnce]);

  const animation = useSpring({
    from: animationFrom,
    to: inView ? animationTo : animationFrom,
    config: config,
  });

  const AnimatedElement = animated[tag];

  return (
    <AnimatedElement ref={ref} style={animation} className={className} {...rest}>
      {children}
    </AnimatedElement>
  );
};

export default AnimateInView;
