import React, {Component} from 'react';
import styles from './style.css';

export default class ShowAll extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let sMost = styles.notClicked;
    let sAll = styles.notClicked;
    if (this.props.tableCarparkStatus === 0) {
      sMost = styles.clicked;
    } else {
      sAll = styles.clicked;
    }
    return (
        <div className={styles.itemsLengthTable}>
          <ul className={styles.itemsLengthList}>
            <li
              onClick={() => {
                this.props.clickMost();
              }}
              className={[styles.borderItems, sMost].join(' ')}>
              Most Relevant
            </li>
            <li
              onClick={this.props.clickAll}
              className={[sAll].join(' ')}>
              All
            </li>
          </ul>
        </div>
    );
  }
}
