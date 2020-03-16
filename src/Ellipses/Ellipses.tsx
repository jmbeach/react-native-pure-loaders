import React from 'react';
import { Animated, Easing } from 'react-native';
import { Svg, Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle) as any;

const ellipses = (props) => {
  const color = props.color || 'white';
  const size = props.size || 64;
  const animation = new Animated.Value(0);
  Animated.loop(Animated.timing(animation, {
    toValue: 1,
    duration: 600,
    easing: Easing.bezier(0.5, 0.01, 0.5, 1),
    useNativeDriver: true
  })).start();
  let inputRange: number[] = [];
  let outputRange: number[] = [];

  const scaleInterpolation = getScaleAnimation(inputRange, outputRange, animation);
  const reverseScaleInterpolationX = getReverseScaleAnimation(true, animation);
  const reverseScaleInterpolationY = getReverseScaleAnimation(false, animation);

  return (
    <Svg width={size} height={size} viewBox="0 0 40 10">
      <AnimatedCircle style={{
        transform: [
          {
            scale: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1]
            })
          },
          {
            translateX: scaleInterpolation
          },
          {
            translateY: scaleInterpolation
          }
        ]
      }} cx={5} cy={5} r={5} fill={color} />
      <AnimatedCircle style={{
        transform: [
          {
            translateX: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 15]
            })
          }
        ]
      }} cx={5} cy={5} r={5} fill={color} />
      <AnimatedCircle style={{
        transform: [
          {
            translateX: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 15]
            })
          }
        ]
      }} cx={20} cy={5} r={5} fill={color} />
      <AnimatedCircle style={{
        transform: [
          {
            scale: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0]
            })
          },
          {
            translateX: reverseScaleInterpolationX
          },
          {
            translateY: reverseScaleInterpolationY
          }
        ]
      }} cx={35} cy={5} r={5} fill={color} />
    </Svg>
  )
};

export default ellipses;

function getScaleAnimation(inputRange: number[], outputRange: number[], animation: Animated.Value) {
  for (let i = 0.001; i < 0.1; i += 0.001) {
    inputRange.push(i);
    outputRange.push((5 / i) - 5);
  }
  for (let i = 0.1; i < 1; i += 0.01) {
    inputRange.push(i);
    outputRange.push((5 / i) - 5);
  }
  const translation = animation.interpolate({
    inputRange: inputRange,
    outputRange: outputRange
  });
  return translation;
}

function getReverseScaleAnimation(isX: boolean, animation: Animated.Value) {
  let inputCopy: number[] = []
  let outputCopy: number[] = []
  const getX = i => {
    return ((35 / i) - 35)
  };
  const getY = i => {
    return (5 / i) - 5
  };
  for (let i = 0.001; i < 0.9; i += 0.01) {
    inputCopy.push(i);
    outputCopy.push(isX === true ? getX(1 - i) : getY(1 - i));
  }
  for (let i = 0.9; i < 1; i += 0.001) {
    inputCopy.push(i);
    outputCopy.push(isX === true ? getX(1 - i) : getY(1 - i));
  }

  const translation = animation.interpolate({
    inputRange: inputCopy,
    outputRange: outputCopy
  });
  return translation;
}
