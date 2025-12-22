import React, { useState, useRef } from 'react';

interface SliderVerificationProps {
  onSuccess: () => void;
  onReset?: () => void;
}

const SliderVerification: React.FC<SliderVerificationProps> = ({ onSuccess, onReset }) => {
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showError, setShowError] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isVerified) return;
    setIsDragging(true);
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isVerified) return;
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !trackRef.current || isVerified) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    const newPosition = Math.max(0, Math.min(e.clientX - rect.left - 20, rect.width - 40));
    setSliderPosition(newPosition);
    
    // Check if slider is at 90-95% completion
    if (newPosition >= (rect.width - 40) * 0.9) {
      setIsVerified(true);
      setIsDragging(false);
      // Wait 1-2 seconds then call onSuccess
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !trackRef.current || isVerified) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const newPosition = Math.max(0, Math.min(touch.clientX - rect.left - 20, rect.width - 40));
    setSliderPosition(newPosition);
    
    // Check if slider is at 90-95% completion
    if (newPosition >= (rect.width - 40) * 0.9) {
      setIsVerified(true);
      setIsDragging(false);
      // Wait 1-2 seconds then call onSuccess
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (!isVerified && sliderPosition > 5) {
      setShowError(true);
      // Reset after showing error for 1 second
      setTimeout(() => {
        setSliderPosition(0);
        setShowError(false);
        onReset?.();
      }, 1000);
    } else if (!isVerified) {
      setSliderPosition(0);
      onReset?.();
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (!isVerified && sliderPosition > 5) {
      setShowError(true);
      // Reset after showing error for 1 second
      setTimeout(() => {
        setSliderPosition(0);
        setShowError(false);
        onReset?.();
      }, 1000);
    } else if (!isVerified) {
      setSliderPosition(0);
      onReset?.();
    }
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, isVerified]);

  return (
    <div className="w-full">
      <div 
        ref={trackRef}
        className={`relative h-12 rounded-lg border-2 transition-colors ${
          isVerified ? 'bg-accent-green/20 border-accent-green' : 'bg-card-bg border-border-color'
        }`}
      >
        <div 
          className={`absolute inset-0 rounded-lg transition-all ${
            isVerified ? 'bg-accent-green/10' : 'bg-gradient-to-r from-accent-blue/20 to-transparent'
          }`}
          style={{ width: `${(sliderPosition / (trackRef.current?.clientWidth || 300)) * 100}%` }}
        />
        
        <div
          ref={sliderRef}
          className={`absolute top-1 left-1 w-10 h-10 rounded-md cursor-pointer transition-all select-none ${
            isVerified 
              ? 'bg-accent-green shadow-lg shadow-accent-green/30' 
              : showError
              ? 'bg-accent-red shadow-lg shadow-accent-red/30'
              : 'bg-accent-blue hover:bg-accent-blue/80 shadow-lg'
          }`}
          style={{ transform: `translateX(${sliderPosition}px)` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="flex items-center justify-center h-full text-white">
            {isVerified ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : showError ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className={`text-sm font-medium transition-opacity ${
            isVerified ? 'text-accent-green opacity-100' : 'text-secondary-text opacity-70'
          }`}>
            {isVerified ? 'Verified ✓' : 'Slide to verify'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SliderVerification;