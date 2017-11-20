'use strict';

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import ReactNative, {
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import Navigation from './navigation/Navigation';
import SceneConfigs from './navigation/SceneConfigs';
import StateUtils from './navigation/StateUtils';

const STACK_UNMOUNTED = 0;
const STACK_INVISIBLE = 1;
const STACK_VISIBLE = 2;

let _lid = 0;
/**
 * Popup 的容器 基于Navigation 实现
 * TODO hide + show 时动画闪烁 (Navigation 不能只动画最顶层的View)
 */
export default class PopupContainer extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    if (!this.state.stackState === STACK_UNMOUNTED) {
      return null;
    }
    return (
      <Navigation
        enableGestures={false}
        removeClippedScenes={false}
        hideNonActiveScenes={false}
        renderScene={this._renderScene}
        navigationRef={this._setNavigationRef}
        configureScene={configureScene}
        onTransitionEnd={this._onTransitionEnd}
        // sceneStyle={styles.scene}
        style={[styles.container, this.props.style, this.state.stackState !== STACK_VISIBLE ? styles.invisible : null]}
      />
    );
  }

  dispatchBackEvent() {
    if (this._isUnmounted) {
      return false;
    }
    if (!this._stack) {
      return false;
    }
    if (this._stack.isInTransition()) {
      return true;
    }
    const activeScene = this._stack.getActiveScene();
    if (!activeScene) {
      return false;
    }
    // TODO 处理逻辑放到Layer 中?
    if (activeScene.route.cancelable) {
      this.pop();
    }
    return true;
  }
}
