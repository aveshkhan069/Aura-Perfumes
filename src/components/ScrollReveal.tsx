import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'left' | 'right' | 'scale';
  delay?: number; // ms
  duration?: number; // ms
  className?: string;
  as?: React.ElementType;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 1000,
  className = '',
  as: Component = 'div',
}) => {
  const { ref, isRevealed } = useScrollReveal<HTMLDivElement>();

  const getDirectionClass = () => {
    switch (direction) {
      case 'left':
        return 'reveal-left';
      case 'right':
        return 'reveal-right';
      case 'scale':
        return 'reveal-scale';
      case 'up':
      default:
        return 'reveal-up';
    }
  };

  return (
    <Component
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`,
      }}
      className={`scroll-reveal ${getDirectionClass()} ${
        isRevealed ? 'is-revealed' : ''
      } ${className}`}
    >
      {children}
    </Component>
  );
};
