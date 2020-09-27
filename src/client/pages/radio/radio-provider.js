import React, { useContext } from 'react';

const radio = React.createContext({});

const RadioProvider = ({ value, children }) => {
  return <radio.Provider value={value}>{children}</radio.Provider>;
};

const useRadio = () => useContext(radio);

export { RadioProvider, useRadio };
