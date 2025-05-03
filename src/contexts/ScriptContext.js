import React, { createContext, useContext, useState } from 'react';

const ScriptContext = createContext();

export const ScriptProvider = ({ children }) => {
  const [triggers, setTriggers] = useState(null); // Điều kiện kịch bản
  const [actions, setActions] = useState(null);   // Thời gian lịch
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);

  return (
    <ScriptContext.Provider value={{ triggers, setTriggers, actions, setActions, lat, setLat, lon, setLon }}>
      {children}
    </ScriptContext.Provider>
  );
};

export const useScript = () => useContext(ScriptContext);
