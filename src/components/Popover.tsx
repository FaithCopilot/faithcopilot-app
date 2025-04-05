import { useState, useEffect, useRef } from 'react';

export const Popover = ({ 
  children, 
  content, 
  isOpen, 
  onClose,
  offset = 5
}) => {
  const [position, setPosition] = useState(null);
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);

  const calculatePosition = () => {
    if (!triggerRef.current || !popoverRef.current) return null;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Default position (below trigger)
    let top = triggerRect.bottom; // + offset;
    let left = triggerRect.left;

    // Check right edge
    if (left + popoverRect.width > viewportWidth) {
      left = viewportWidth - popoverRect.width - offset;
    }

    // Check bottom edge
    if (top + popoverRect.height > viewportHeight) {
      // Position above trigger
      top = triggerRect.top - popoverRect.height - offset;
    }

    // Check left edge
    if (left < offset) {
      left = offset;
    }

    return { top, left };
  };

  useEffect(() => {
    if (!isOpen) {
      setPosition(null);
      return;
    }

    // Initial position calculation
    const newPosition = calculatePosition();
    if (newPosition) {
      setPosition(newPosition);
    }

    const handlePositionUpdate = () => {
      const newPosition = calculatePosition();
      if (newPosition) {
        setPosition(newPosition);
      }
    };

    window.addEventListener('resize', handlePositionUpdate);
    window.addEventListener('scroll', handlePositionUpdate);

    return () => {
      window.removeEventListener('resize', handlePositionUpdate);
      window.removeEventListener('scroll', handlePositionUpdate);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        !triggerRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div className="relative inline-block">
      <div ref={triggerRef}>
        {children}
      </div>
      {isOpen && (
        <div
          ref={popoverRef}
          className="fixed z-50 surfaces rounded-lg p-3 borders min-w-[200px]"
          style={{
            visibility: position ? 'visible' : 'hidden',
            top: position?.top ?? 0,
            left: position?.left ?? 0
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};