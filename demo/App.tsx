import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Loaders from './lib/index'

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.loaderContainer}>
          <Loaders.Ring color="#FFD533" size={128} />
        </View>
        <View style={styles.loaderContainer}>
          <Loaders.Ring />
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
    alignItems: 'center',
    justifyContent: 'center'
  }
});
