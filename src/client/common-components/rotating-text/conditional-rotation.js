import React, {
  Children,
  cloneElement,
  Fragment,
  useCallback,
  useState,
  useEffect
} from 'react';
import RotatingText from './rotating-text';

const ConditionalRotation = ({ id, maxHeight, children }) => {
  const [rotate, setRotate] = useState(false);
  const [childrenWithRef, setChildrenWithRef] = useState(null);

  const refCallback = useCallback(
    node => {
      debugger;
      if (node && node.offsetHeight > maxHeight) {
        setRotate(true);
      }
    },
    [maxHeight]
  );

  useEffect(() => {
    setRotate(false);
    setChildrenWithRef(
      Children.map(children, child => {
        const childProps = {
          ref: refCallback,
          key: id
        };
        return cloneElement(child, childProps);
      })
    );
  }, [id]);

  return (
    <Fragment>
      {rotate ? <RotatingText>{children}</RotatingText> : childrenWithRef}
    </Fragment>
  );
};

export default ConditionalRotation;
