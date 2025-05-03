import React, { createContext, useContext, useState } from 'react';

const ScriptContext = createContext();

export const ScriptProvider = ({ children }) => {
  const [triggers, setTriggers] = useState(null); // Điều kiện kịch bản
  const [actions, setActions] = useState(null);   // Thời gian lịch

  return (
    <ScriptContext.Provider value={{ triggers, setTriggers, actions, setActions }}>
      {children}
    </ScriptContext.Provider>
  );
};

export const useScript = () => useContext(ScriptContext);
