import React, { useRef, useEffect, useState } from 'react';

const useLastClickInside = ref => {
  const [lastClickInside, setLastClickInside] = useState(false);
  useEffect(() => {
    const handleClickOutside = event => {
      if (ref.current && ref.current.contains(event.target)) {
        setLastClickInside(true);
      } else {
        setLastClickInside(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
  return lastClickInside;
};

const withLastClickInside = WrappedComponent => ({ children, props }) => {
  const wrapperRef = useRef(null);
  const lastClickInside = useLastClickInside(wrapperRef);

  return (
    <div ref={wrapperRef}>
      <WrappedComponent lastClickInside={lastClickInside} {...props}>
        {children}
      </WrappedComponent>
    </div>
  );
};

export default withLastClickInside;
