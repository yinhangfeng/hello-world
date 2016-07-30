/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View
} from 'react-native';

var npmTest = require('yinhf-npmtest');
var npmLib1 = require('npmlib1');
var npmTest1 = require('npmtest1');
npmTest();
npmTest1();
npmLib1();
npmTest1();

//var npmTest2 = require('npmtest2');
 var npmTest2AAA = require('npmtest2/AAA');

 //var npmTest2AAA = require('AAA');

 var npmTest2CCC = require('npmtest2/lib/CCC');

class rndeptest extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.android.js
        </Text>
        <Text style={styles.instructions}>
          Shake or press menu button for dev menu
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('rndeptest', () => rndeptest);
