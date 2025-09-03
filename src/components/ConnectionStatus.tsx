import React from 'react';
import { CheckCircle, AlertCircle, Wifi, WifiOff } from 'lucide-react';

interface ConnectionStatusProps {
  isConnected: boolean;
  hasCredentials: boolean;
}

export function ConnectionStatus({ isConnected, hasCredentials }: ConnectionStatusProps) {
  if (!hasCredentials) {
    return (
      <div className="flex items-center space-x-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs">
        <WifiOff className="w-3 h-3" />
        <span>Configuration Required</span>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
        <CheckCircle className="w-3 h-3" />
        <span>Connected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
      <AlertCircle className="w-3 h-3" />
      <span>Connecting...</span>
    </div>
  );
}