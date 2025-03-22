import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import Slider from '@react-native-community/slider';
import { AirVentIcon, OctagonXIcon } from 'lucide-react-native';

const RainSensor = ({ppm}) => {
  return (
    <View className="p-4 rounded-xl">
      <View className="flex-row justify-between items-center mb-6 bg-blue-100 p-4 rounded-lg">
            <View className="flex-row items-center">
            <Text>
                  <AirVentIcon color="#3b82f6" />
            </Text>
            <Text className="text-lg ml-2 text-blue-600">CO2:</Text>
            </View>
            <Text className="text-2xl font-semibold text-blue-700">{ppm} ppm</Text>
      </View>
    </View>
  );
};

export default RainSensor;

