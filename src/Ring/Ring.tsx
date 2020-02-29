import React, { Component } from 'react';
import { View, Animated, Easing, Platform, LayoutChangeEvent, AppState } from 'react-native';
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
    appState: AppState.currentState,
    color: 'white',
    offset: 0,
    size: 64
  }

  props: RingProps;

  animation: Animated.CompositeAnimation;

  componentDidMount() {
    console.log('mounted', new Date())
    AppState.addEventListener('change', this.onAppStateChange)
  }

  componentWillUnmount() {
    console.log('un-mounted', new Date())
  }

  constructor(props: RingProps) {
    super(props);
    if (typeof props.size === 'number') {
      this.state.size = props.size;
    }

    if (typeof props.color === 'string') {
      this.state.color = props.color;
    }
  }

  onAppStateChange = nextAppState => {
    this.animation.stop();
    this.setState({
      appState: nextAppState
    }, () => {
      // this.animation.start();
    });
  }

  onLayout = Platform.OS === 'android'
    ? (e: LayoutChangeEvent) => {
      this.setState({ offset: e.nativeEvent.layout.width / 2 }, () => {
        // this.animation.start();
      });
    }
    : undefined;

  render() {
    const spins = [...new Array(10)].map(x => new Animated.Value(0));

    const animationConfig = {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
      easing: Easing.bezier(0.5, 0.01, 0.5, 1)
    };

    const minDelay = 120;
    const maxDelay = 500;

    const delays: Animated.CompositeAnimation[] = [];
    delays.push(Animated.loop(Animated.timing(spins[0], animationConfig)));
    const factor = (maxDelay - minDelay) / (spins.length - 1);
    for (let i = 1; i < spins.length; i++) {
      delays.push(Animated.sequence([
        Animated.delay(Math.round(minDelay + (i * factor))),
        Animated.loop(Animated.timing(spins[i], animationConfig))
      ]));
    }

    this.animation = Animated.parallel(delays);
    if (Platform.OS !== 'android') {
      this.animation.start();
    }

    const offset = 8.4666664 / 2
    const getQuadrant = (i: number, animation: Animated.Value) => {
      return (
        <AnimatedG key={i} style={{
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
            {spins.map((_, i) => getQuadrant(i, spins[i]))}
          </G>
        </Svg>
      </View>
    )
  }
}

export default Ring;