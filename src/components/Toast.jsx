import React, { useState, useEffect } from 'react';

const Toast = ({ toast, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (toast) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 400); 
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast || !isVisible) {
    return null;
  }

  const successIconSVG = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
  const errorIconSVG = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;
  const icon = toast.type === 'success' ? successIconSVG : errorIconSVG;

  return (
    <div id="toast-container">
      <div className={`toast ${toast.type}`}>
        <div className="toast-icon">{icon}</div>
        <div className="toast-message">{toast.message}</div>
        <div className="toast-progress"></div>
      </div>
    </div>
  );
};

export default Toast;