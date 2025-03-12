import React from "react";
import { ReadyState } from "react-use-websocket";

interface SocketStatusProps {
  status: ReadyState;
  error: string | null;
}

/**
 * A simple component that displays the status of the socket connection
 * Could be improved by moving the logic to a custom hook
 * @param status the status state returned from the real time data socket
 * @param error a string that contains the error message if the connection fails
 * @returns a color indicator and text that shows the status of the socket connection
 */
const SocketStatus: React.FC<SocketStatusProps> = ({ status, error }) => {
  const isActive = status === ReadyState.OPEN;

  return (
    <div className="flex items-center space-x-2">
      <div
        className={`h-4 w-4 rounded-full ${
          isActive
            ? "bg-green-500 animate-pulse"
            : error
            ? "bg-red-600"
            : "bg-gray-400"
        }`}
      />
      <span className={`text-sm ${error && "text-red-600"}`}>
        {error ? error : isActive ? "Connected" : "Disconnected"}
      </span>
    </div>
  );
};

export default SocketStatus;
