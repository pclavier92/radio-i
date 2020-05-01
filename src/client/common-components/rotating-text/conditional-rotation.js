import React, {
  Children,
  cloneElement,
  Fragment,
  useCallback,
  useMemo,
  useState
} from 'react';
import RotatingText from './rotating-text';

const ConditionalRotation = ({ children, maxHeight }) => {
  const [rotate, setRotate] = useState(false);

  const refCallback = useCallback(
    (node) => {
      if (node && node.offsetHeight > maxHeight) {
        setRotate(true);
      }
    },
    [maxHeight]
  );

  const childrenWithProps = useMemo(
    () => Children.map(children, (child) => {
        const childProps = { ref: refCallback };
        return cloneElement(child, childProps);
      }),
    [children]
  );

  return (
    <Fragment>
      {rotate ? <RotatingText>{children}</RotatingText> : childrenWithProps}
    </Fragment>
  );
};

export default ConditionalRotation;
