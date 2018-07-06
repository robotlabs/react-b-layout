import React, {Component} from 'react';
import styles from './style.css';

export default class Dv3 extends Component {
  constructor(props) {
    super(props);
  }
  shouldComponentUpdate() {
    if (this.visible) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    return (
      <div
        ref={(element) => {
          this.node = element;
        }}
        className={[styles.box].join(' ')}>
        I AM DIV3
      </div>
    );
  }
}
