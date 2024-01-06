
"use client"
import React, { useState, useEffect } from 'react';

interface LoadingProps {
  isLoading: boolean;
}

const Loading: React.FC<LoadingProps> = ({ isLoading }) => {
  const [showLoading, setShowLoading] = useState(isLoading);

  useEffect(() => {
    // Only update showLoading after 3 seconds if isLoading is true
    if (isLoading) {
      const timeoutId = setTimeout(() => {
        setShowLoading(true);
      }, 3000);

      // Clear the timeout if the component is unmounted
      return () => clearTimeout(timeoutId);
    }
  }, [isLoading]);

  if (!showLoading) {
    return null; // or replace with another component/content
  }

  return (
    <div className='w-full h-full text-black text-6rem'>
      {/* Your loading content here */}
      Loading...
    </div>
  );
}

export default Loading;

