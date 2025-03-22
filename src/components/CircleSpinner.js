import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const CircleSpinner = ({ size = 40, color = '#2196F3' }) => {
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderColor: color,
            transform: [{ rotate: spin }],
          },
        ]}
      >
        {[...Array(4)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: color,
                width: size / 10,
                height: size / 10,
                borderRadius: size / 20,
                top: i === 0 ? 0 : i === 2 ? size - size / 10 : size / 2 - size / 20,
                left: i === 1 ? size - size / 10 : i === 3 ? 0 : size / 2 - size / 20,
              },
            ]}
          />
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    borderWidth: 2,
    borderRadius: 1000,
    borderStyle: 'dashed',
    position: 'relative',
  },
  dot: {
    position: 'absolute',
  },
});

export default CircleSpinner;
