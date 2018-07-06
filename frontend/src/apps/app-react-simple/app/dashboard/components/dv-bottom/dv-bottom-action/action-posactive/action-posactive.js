import React, {Component} from 'react';
import styles from './style.css';
import ShowAll from './../show-all/show-all.js';
import DynamicTableDrop3 from './../../dynamic-table-drop/dynamic-table-drop3.js';

export default class ActionPosactive extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableCarparkStatus: 0
    };

    this.clickAll = this.clickAll.bind(this);
    this.clickMost = this.clickMost.bind(this);
  }

  clickAll() {
    if (this.state.tableCarparkStatus === 0) {
      this.setState({
        tableCarparkStatus: 1
      });
    }
  }
  clickMost() {
    if (this.state.tableCarparkStatus === 1) {
      this.setState({
        tableCarparkStatus: 0
      });
    }
  }
  render() {
    if (this.node) {
      this.node.classList.remove(styles.applyFade);
    }
    setTimeout(() => {
      this.node.classList.add(styles.applyFade);
    }, 1);
    return (
      <div
      ref={(element) => {
        this.node = element;
      }}
        >
        <div
          className={styles.titleTab}>
          By PoS Active
        </div>
        <div className={styles.titleItemsLength}>
          <ShowAll
            tableCarparkStatus={this.state.tableCarparkStatus}
            clickAll={this.clickAll}
            clickMost={this.clickMost}>
          </ShowAll>
        </div>
        <DynamicTableDrop3
          metadata={this.props.metadata}
          arrLevels={this.props.arrPosActiveVar}
          arrValues={this.props.arrPosActiveFixed}
          data={this.props.arr}
          showAll={this.state.tableCarparkStatus}
          status={0}
          clickable={false}
          headerSize={100}
          type={'CarParc'}
          arrPercW={this.props.arrPercW}
          arrGrouped={false}
          orderKey={this.props.metadata.o.pirelli_volumes.key}
        ></DynamicTableDrop3>
      </div>
    );
  }
}
