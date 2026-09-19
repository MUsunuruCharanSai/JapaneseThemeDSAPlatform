import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface TimerContextType {
  elapsedTime: number;
  isRunning: boolean;
  formatTime: (seconds: number) => string;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};

interface TimerProviderProps {
  children: ReactNode;
}

export const TimerProvider: React.FC<TimerProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const TIMER_STORAGE_KEY = 'focus_timer_elapsed_time';

  // Initialize timer when user logs in
  useEffect(() => {
    if (user && !isRunning) {
      // User logged in, start or resume timer
      const storedElapsedTime = localStorage.getItem(TIMER_STORAGE_KEY);

      if (storedElapsedTime) {
        const elapsed = parseInt(storedElapsedTime, 10);
        // Validate the stored elapsed time (should be reasonable, not negative or excessively large)
        if (elapsed >= 0 && elapsed < (24 * 60 * 60)) { // Max 24 hours
          setElapsedTime(elapsed);
        } else {
          // Invalid elapsed time, start fresh
          localStorage.setItem(TIMER_STORAGE_KEY, '0');
          setElapsedTime(0);
        }
      } else {
        // No stored time, start fresh
        localStorage.setItem(TIMER_STORAGE_KEY, '0');
        setElapsedTime(0);
      }

      setIsRunning(true);
    } else if (!user && isRunning) {
      // User logged out, stop timer and clear data
      setIsRunning(false);
      setElapsedTime(0);
      localStorage.removeItem(TIMER_STORAGE_KEY);
    }
  }, [user, isRunning]);

  // Update timer every second and persist to localStorage
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning && user) {
      intervalId = setInterval(() => {
        setElapsedTime(prevTime => {
          const newTime = prevTime + 1;
          // Persist the current elapsed time to localStorage
          localStorage.setItem(TIMER_STORAGE_KEY, newTime.toString());
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, user]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const value: TimerContextType = {
    elapsedTime,
    isRunning,
    formatTime,
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
};
