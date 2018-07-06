import React, {Component} from 'react';
import styles from './style.css';

export default class Dropdown extends Component {
  constructor(props) {
    super();
  }
  componentDidMount() {
    this.contentOuter = this.node.getElementsByClassName(styles.dropdownContentOuter)[0];
    this.content = this.node.getElementsByClassName(styles.dropdownContent)[0];
    this.plusVertical = this.node.getElementsByClassName(styles.plusVertical)[0];
  }

  clickButton() {
    if (this.opened) {
      this.closeButton();
    } else {
      this.openButton();
    }
  }
  openButton() {
    TweenMax.to(this.contentOuter, .7, {
      height: this.content.offsetHeight,
      ease: window.Power4.easeOut
    });
    TweenMax.to(this.content, .5, {
      ease: window.Power4.easeOut,
      y: 0
    });
    TweenMax.to(this.plusVertical, .6, {
      rotation: 90,
      ease: window.Back.easeOut
    });
    this.opened = true;
  }
  //** close sub-menu
  closeButton() {
    TweenMax.to(this.contentOuter, .7, {
      height: 0,
      ease: window.Power4.easeOut
    });
    TweenMax.to(this.content, .5, {
      ease: window.Power4.easeOut,
      y: -this.content.offsetHeight
    });
    TweenMax.to(this.plusVertical, .6, {
      rotation: 0,
      ease: window.Back.easeOut
    });
    this.opened = false;
  }
  render() {
    this.selected = this.props.filter.label + this.props.filter.values[this.props.selected].name;
    let listSubItems = <div></div>;
    if (this.props.filter.values) {
      listSubItems  = this.props.filter.values.map((item, index) => {
        return (
          <li
            onClick = { () => {
              this.closeButton();
              this.props.passSubClick(this, item);
            }}
            key={index}>
            <a>{item.name}</a>
          </li>
        );
      });
    }
    return (
      <div
        ref={(element) => {
          this.node = element;
        }}
        className={[styles.dropdown].join(' ')}>
        <button
          tabIndex="0"
          className={styles.dropbtn}
            onClick={()=> {
              this.clickButton();
              //this.props.passClick(this.props.id)}
            }}
        >
          {this.selected}
        </button>
        <div className={styles.dropdownContentOuter}>
          <div className={styles.dropdownContent}>
            {listSubItems}
          </div>
        </div>
        <div>
            <div className={styles.plusVertical}></div>
        </div>
      </div>
    );
  }
}
