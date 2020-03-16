import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Loaders from './lib/index'

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.loaderContainer}>
          <Loaders.Ellipses color="#FFD533" size={128} id="EllipsesA" />
        </View>
        <View style={styles.loaderContainer}>
          <Loaders.Ellipses id="EllipsesB" />
        </View>
      </View>
      <View style={styles.captionContainer}>
        <Text style={styles.caption}>{'<Loaders.Ellipses />'}</Text>
      </View>
      <View style={styles.row}>
        <View style={styles.loaderContainer}>
          <Loaders.Ring color="#FFD533" size={128} id="A" />
        </View>
        <View style={styles.loaderContainer}>
          <Loaders.Ring id="B" />
        </View>
      </View>
      <View style={styles.captionContainer}>
        <Text style={styles.caption}>{'<Loaders.Ring />'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1929FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  caption: {
    color: 'white'
  },
  captionContainer: {
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  loaderContainer: {
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
