import React, {Component} from 'react';
import styles from './style.css';

import AppConstants from './../../../../app-utils/app-constants';

export default class MenuButton extends Component {
  constructor(props) {
    super();
  }
  componentDidMount() {
    this.contentOuter = this.node.getElementsByClassName(styles.dropdownContentOuter)[0];
    this.content = this.node.getElementsByClassName(styles.dropdownContent)[0];
    this.plusVertical = this.node.getElementsByClassName(styles.plusVertical)[0];
  }
  render() {
    let listSubItems = <div></div>;
    if (this.props.filter.values) {
      listSubItems  = this.props.filter.values.map((item, index) => {
        return (
          <li
            onClick = { () => this.props.passSubClick(this, item)}
            key={index}>
            <a>{item.name}</a>
          </li>
        );
      });
    }

    let filterLabel = this.props.filter.label;
    if (this.props.id !== AppConstants.RESET) {
      filterLabel = this.props.filter.selected;
      if (this.props.filter.selected === AppConstants.ALL) {
        filterLabel = 'Select ' + this.props.filter.label;
      }
    }
    return (
      <div
        ref={(element) => {
          this.node = element;
        }}
        className={styles.dropdown}>
        <button
          tabIndex="0"
          className={styles.dropbtn}
            onClick={()=> this.props.passClick(this.props.id)}
        >
          {filterLabel}
        </button>
        <div className={styles.dropdownContentOuter}>
          <div className={styles.dropdownContent}>
            {listSubItems}
          </div>
        </div>
        <div className={styles.plus}>
            <div className={styles.plusVertical}></div>
            <div className={styles.plusHorizontal}></div>
        </div>
      </div>
    );
  }
}
