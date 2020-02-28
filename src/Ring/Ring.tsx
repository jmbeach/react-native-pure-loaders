import React, { Component } from 'react';
import { View, Animated, Easing, StyleSheet, Platform, LayoutChangeEvent } from 'react-native';
import { Svg, G, Path } from 'react-native-svg';

const AnimatedG = Animated.createAnimatedComponent(G) as any;

export interface RingProps {
  /** @description The color of the loader. */
  color?: string;

  /** @description The size of the loader icon. Defaults to 64. */
  size?: number;
}

class Ring extends Component {
  state = {
    color: 'white',
    offset: 0,
    size: 64
  }

  props: RingProps;

  constructor(props: RingProps) {
    super(props);
    if (typeof props.size === 'number') {
      this.state.size = props.size;
    }

    if (typeof props.color === 'string') {
      this.state.color = props.color;
    }
  }

  onLayout = Platform.OS === 'android'
    ? (e: LayoutChangeEvent) => { this.setState({ offset: e.nativeEvent.layout.width / 2 }) }
    : undefined;

  render() {
    const spins1 = new Animated.Value(0);
    const spins2 = new Animated.Value(0);
    const spins3 = new Animated.Value(0);
    const spins4 = new Animated.Value(0);
    const spins5 = new Animated.Value(0);
    const spins6 = new Animated.Value(0);

    const animationConfig = {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
      easing: Easing.bezier(0.5, 0.01, 0.5, 1)
    };

    Animated.parallel([
      Animated.loop(Animated.timing(spins1, animationConfig)),
      Animated.sequence([
        Animated.delay(150),
        Animated.loop(Animated.timing(spins2, animationConfig))
      ]),
      Animated.sequence([
        Animated.delay(225),
        Animated.loop(Animated.timing(spins3, animationConfig))
      ]),
      Animated.sequence([
        Animated.delay(300),
        Animated.loop(Animated.timing(spins4, animationConfig))
      ]),
      Animated.sequence([
        Animated.delay(375),
        Animated.loop(Animated.timing(spins5, animationConfig)),
      ]),
      Animated.sequence([
        Animated.delay(450),
        Animated.loop(Animated.timing(spins6, animationConfig))
      ])
    ]).start()

    const offset = 8.4666664 / 2
    const getQuadrant = animation => {
      return (
        <AnimatedG style={{
          transform: [
            {
              translateX: -this.state.offset
            },
            {
              rotate: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [(0) + 'deg', ((0) + 360) + 'deg']
              })
            },
            {
              translateX: this.state.offset
            }
          ]
        }}>
          <G transform={`translate(-${offset}, -${offset})`}>
            <Path fill={this.state.color} d="M4.295 0A4.233 4.233 0 001.24 1.24l.75.75a3.175 3.175 0 012.243-.932 3.175 3.175 0 012.244.932l.75-.75A4.233 4.233 0 004.295 0z" />
          </G>
        </AnimatedG>
      )
    }
    return (
      <View style={{
        position: 'relative',
        height: this.state.size * 1.1,
        width: this.state.size * 1.1
      }}>
        <Svg onLayout={this.onLayout} width={this.state.size} height={this.state.size} style={{
          marginTop: 8,
          marginLeft: 8
        }}
          viewBox="0 0 8.4666664 8.4666664">
          <G transform={`translate(${offset}, ${offset})`}>
            {getQuadrant(spins1)}
            {getQuadrant(spins2)}
            {getQuadrant(spins3)}
            {getQuadrant(spins4)}
            {getQuadrant(spins5)}
            {getQuadrant(spins6)}
          </G>
        </Svg>
      </View>
    )
  }
}

export default Ring;