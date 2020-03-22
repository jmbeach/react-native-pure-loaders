import React, { Component } from 'react';
import { View, Animated, Easing, Platform, LayoutChangeEvent, AppState, AppStateStatus } from 'react-native';
import { Svg, G, Path } from 'react-native-svg';
import Interpolator from '../Interpolator';
import LoaderProps from '../LoaderProps';

const AnimatedG = Animated.createAnimatedComponent(G) as any;

export interface RingState {
  offset: number;
}

export interface RingProps extends LoaderProps {
  id?: string;
}
class Ring extends Component {
  state = {
    offset: 0
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

  constructor(props: LoaderProps) {
    super(props);

    this.animationConfig = {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
      easing: Easing.bezier(0.5, 0.01, 0.5, 1)
    };
    this.minDelay = 150;
    const maxDelayInterpolator = Interpolator.getInterpolator({
      input: [64, 128],
      output: [445, 500]
    });
    this.maxDelay = maxDelayInterpolator(this.props.size || 64);
    this.appState = AppState.currentState;
    AppState.addEventListener('change', this.onAppStateChange);
  }

  onAppStateChange = (nextAppState: any) => {
    if (this._isMounted) {
      if (nextAppState !== 'active') {
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
          }, this.getDelay(i));
        }
      }

      this.appState = nextAppState;
    }
  }

  getDelayFactor = () => {
    return (this.maxDelay - this.minDelay) / (this.spins.length - 2);
  }

  getDelay = (i: number) => {
    return Math.round(this.minDelay + ((i - 1) * this.getDelayFactor()));
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
    const size = this.props.size || 64;
    const color = this.props.color || 'white';
    if (typeof this.spins === 'undefined' || this.spins.length === 0) {
      this.spins = [...new Array(5)].map(x => new Animated.Value(0));
      this.animations = [];
      if (Platform.OS === 'web') {
        for (let i = 0; i < this.spins.length; i++) {
          this.animations.push(
            Animated.timing(this.spins[i], this.animationConfig))
        }
      } else {
        this.animations.push(Animated.loop(Animated.timing(this.spins[0], this.animationConfig)));
        for (let i = 1; i < this.spins.length; i++) {
          const delay = this.getDelay(i);
          this.animations.push(
            Animated.sequence([
              Animated.delay(delay),
              Animated.loop(Animated.timing(this.spins[i], this.animationConfig))
            ]));
        }
      }

      if (Platform.OS === 'web') {
        for (let i = 0; i < this.spins.length; i++) {
          const loop = (animation: Animated.CompositeAnimation, spin: Animated.Value, delay: number, useTimeout: boolean) => {
            const afterDelay = () => {
              animation.start(() => {
              spin.setValue(0);
                loop(animation, spin, delay, false);
              })
            };
            if (useTimeout) {
              setTimeout(afterDelay, delay);
            } else {
              afterDelay();
            }
          }

          loop(this.animations[i], this.spins[i], this.getDelay(i), true);
        }
      } else {
        this.animation = Animated.parallel(this.animations);

        if (Platform.OS !== 'android') {
          this.animation.start();
        }
      }
    }

    const offset = 8.4666664 / 2
    const getQuadrant = (i: number, animation: Animated.Value) => {
      const id = `${(this.props.id || '')}-${i}`;
      return (
        <AnimatedG key={id} style={{
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
            <Path fill={color} d="M4.295 0A4.233 4.233 0 001.24 1.24l.75.75a3.175 3.175 0 012.243-.932 3.175 3.175 0 012.244.932l.75-.75A4.233 4.233 0 004.295 0z" />
          </G>
        </AnimatedG>
      )
    }
    return (
      <View style={{
        position: 'relative',
        height: size * 1.1,
        width: size * 1.1
      }}>

        <Svg onLayout={this.onLayout} width={size} height={size} style={{
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