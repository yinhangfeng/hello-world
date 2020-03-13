import React, { Component } from 'react';
import styles from './index.module.less';

if (__DEV__) {
  console.log('dev');
}

export default class Home extends Component {
  render() {
    return (
      <div className={styles.container}>
        home
      </div>
    );
  }
}