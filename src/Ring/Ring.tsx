import React, { Component } from 'react';
import { View, Animated, Easing, Platform, LayoutChangeEvent, AppState, AppStateStatus } from 'react-native';
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
    size: 64,
  }

  appState: AppStateStatus;
  animationConfig: any;
  minDelay: number;
  maxDelay: number;
  props: RingProps;
  spins: Animated.Value[];
  animation: Animated.CompositeAnimation;
  animations: Animated.CompositeAnimation[];
  _isMounted: boolean;

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  constructor(props: RingProps) {
    super(props);
    if (typeof props.size === 'number') {
      this.state.size = props.size;
    }

    if (typeof props.color === 'string') {
      this.state.color = props.color;
    }

    this.animationConfig = {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
      easing: Easing.bezier(0.5, 0.01, 0.5, 1)
    };
    this.minDelay = 120;
    this.maxDelay = 500;
    this.appState = AppState.currentState;
    AppState.addEventListener('change', this.onAppStateChange);
  }

  onAppStateChange = nextAppState => {
    if (this._isMounted) {
      if (nextAppState !== 'active') {
        this.animation.stop();
        for (let spin of this.spins) {
          spin.setValue(0);
        }
      } else if (this.appState !== 'active') {
        this.animations[0].start();
        for (let i = 1; i < this.animations.length; i++) {
          setTimeout(() => {
            if (typeof this.animations[i] !== 'undefined') {
              this.animations[i].start();
            }
          }, this.minDelay + (i * this.getDelayFactor()));
        }
      }

      this.appState = nextAppState;
    }
  }

  getDelayFactor = () => {
    return (this.maxDelay - this.minDelay) / (this.spins.length - 1);
  }

  onLayout = Platform.OS === 'android'
    ? (e: LayoutChangeEvent) => {
      if (this.state.offset === 0) {
        this.setState({ offset: e.nativeEvent.layout.width / 2 }, () => {
          this.animation.start();
        });
      }
    }
    : undefined;

  render() {
    if (typeof this.spins === 'undefined' || this.spins.length === 0) {
      this.spins = [...new Array(10)].map(x => new Animated.Value(0));
      this.animations = [];
      this.animations.push(Animated.loop(Animated.timing(this.spins[0], this.animationConfig)));
      for (let i = 1; i < this.spins.length; i++) {
        this.animations.push(
          Animated.sequence([
            Animated.delay(this.minDelay + (i * this.getDelayFactor())),
            Animated.loop(Animated.timing(this.spins[i], this.animationConfig))
          ]));
      }
  
      this.animation = Animated.parallel(this.animations);
  
      if (Platform.OS !== 'android') {
        this.animation.start();
      }
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
            {this.spins.map((_, i) => getQuadrant(i, this.spins[i]))}
          </G>
        </Svg>
      </View>
    )
  }
}

export default Ring;