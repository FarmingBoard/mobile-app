import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import Slider from '@react-native-community/slider';

const LightSensor = () => {
    const [number, setNumber] = useState(0);

  return (
    <View className="p-4 rounded-xl">
        <View className="flex-row justify-between items-center mb-6 bg-blue-100 p-4 rounded-lg">
        <View className="flex-row items-stretch justify-between">
         <Text>Ánh sáng</Text>
         <Text className="text-lg ml-2 text-blue-600">{number}</Text>
        </View>
      </View>
    </View>
  );
};

export default LightSensor;

