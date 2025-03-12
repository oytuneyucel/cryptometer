import React, { useState, useRef } from 'react';

interface SwipeToDeleteProps {
  onDelete: () => void;
  children: React.ReactNode;
}

const SwipeToDelete: React.FC<SwipeToDeleteProps> = ({ onDelete, children }) => {
  const [translation, setTranslation] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const startX = useRef<number | null>(null);
  const currentX = useRef<number | null>(null);
  const threshold = 100; // minimum distance to trigger delete confirmation

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    currentX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;
    
    // Only allow left swipe (negative diff)
    if (diff < 0) {
      setTranslation(diff);
    }
  };

  const handleTouchEnd = () => {
    if (startX.current === null || currentX.current === null) return;
    
    const diff = currentX.current - startX.current;
    
    if (diff < -threshold) {
      // Show delete confirmation
      setShowConfirm(true);
      setTranslation(-threshold);
    } else {
      // Reset position
      setTranslation(0);
    }
    
    startX.current = null;
    currentX.current = null;
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setTranslation(0);
  };

  const handleConfirm = () => {
    onDelete();
    setShowConfirm(false);
    setTranslation(0);
  };

  return (
    <div className="relative overflow-hidden touch-manipulation">
      <div
        className="transition-transform ease-out duration-300"
        style={{ transform: `translateX(${translation}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
      
      {showConfirm && (
        <div className="absolute top-0 right-0 bottom-0 flex items-center justify-end bg-red-500 px-4">
          <div className="flex space-x-2">
            <button
              className="bg-white text-green-600 p-2 rounded-full"
              onClick={handleConfirm}
              aria-label="Confirm delete"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              className="bg-white text-red-600 p-2 rounded-full"
              onClick={handleCancel}
              aria-label="Cancel delete"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwipeToDelete; 