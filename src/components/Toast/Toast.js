import React, { useEffect, useState, useRef } from 'react';
import './Toast.css';

const Toast = ({ message, type, show, onHide }) => {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const timerRef = useRef(null);
  const fadeTimerRef = useRef(null);
  
  // When the component mounts or show/message/type changes, reset and start the animation
  useEffect(() => {
    // If a new toast is shown (or message/type changes while visible)
    if (show) {
      // Clear any existing timers to prevent conflicts
      if (timerRef.current) clearTimeout(timerRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      
      // Reset the state to show the toast without fading
      setVisible(true);
      setFading(false);
      
      // Start the fade out sequence
      timerRef.current = setTimeout(() => {
        setFading(true);
        
        // Complete the fade out and reset
        fadeTimerRef.current = setTimeout(() => {
          setVisible(false);
          setFading(false);
          if (onHide) onHide();
        }, 1500);
      }, 1500);
      
      // Clean up timers on unmount or when dependencies change
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      };
    }
  }, [show, message, type, onHide]); // Added message and type as dependencies
  
  if (!visible) return null;
  
  return (
    <div className={`toast-container ${fading ? 'fading' : ''}`}>
      <div className={`toast toast-${type}`}>
        {message}
      </div>
    </div>
  );
};

export default Toast;