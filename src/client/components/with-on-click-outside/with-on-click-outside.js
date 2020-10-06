import React, { useRef, useEffect } from 'react';

const useOnClickOutside = (ref, onClickOutside) => {
  useEffect(() => {
    const handleClickOutside = event => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, onClickOutside]);
};

const withOnClickOutside = WrappedComponent => ({
  children,
  onClickOutside,
  ...props
}) => {
  const wrapperRef = useRef(null);
  useOnClickOutside(wrapperRef, onClickOutside);

  return (
    <div ref={wrapperRef}>
      <WrappedComponent {...props}>{children}</WrappedComponent>
    </div>
  );
};

export { useOnClickOutside, withOnClickOutside };
