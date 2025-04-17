import { useState, useEffect } from 'react';

const OfflineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className={`offline-status ${isOnline ? 'online' : 'offline'}`}>
      {isOnline ? 'Online' : 'Offline - Working locally'}
    </div>
  );
};

export default OfflineStatus;