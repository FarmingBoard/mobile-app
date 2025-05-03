import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ScriptProvider } from './contexts/ScriptContext';
// ... các import khác giữ nguyên
import MainStack from './MainStack'; // ví dụ tên stack navigator chính

export default function App() {
  return (
    <ScriptProvider>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </ScriptProvider>
  );
}
