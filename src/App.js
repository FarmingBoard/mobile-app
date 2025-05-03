import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
// ... các import khác giữ nguyên
import MainStack from './MainStack'; // ví dụ tên stack navigator chính

export default function App() {
  return (
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
  );
}
