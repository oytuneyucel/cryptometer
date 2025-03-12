import React, { useState } from 'react';

interface DeleteButtonProps {
  symbol: string;
  onDelete: (symbol: string) => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ symbol, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  const handleCancelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(false);
  };

  const handleConfirmClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(symbol);
    setShowConfirm(false);
  };

  return (
    <div className="relative">
      {!showConfirm ? (
        <button
          className="text-red-500 hover:text-red-700 transition-colors focus:outline-none"
          onClick={handleDeleteClick}
          title="Remove from list"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      ) : (
        <div className="flex items-center space-x-2 bg-white p-1 rounded shadow-md">
          <button
            className="text-green-500 hover:text-green-700 transition-colors focus:outline-none"
            onClick={handleConfirmClick}
            title="Confirm delete"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            className="text-red-500 hover:text-red-700 transition-colors focus:outline-none"
            onClick={handleCancelClick}
            title="Cancel delete"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default DeleteButton; 