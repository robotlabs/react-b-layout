import React, {Component} from 'react';
import styles from './style.css';
import ShowAll from './../show-all/show-all.js';
import DynamicTableDrop2 from './../../dynamic-table-drop/dynamic-table-drop2.js';

export default class ActionCarparc extends Component {
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
    let mdo = this.props.metadata.o;
    return (
      <div
        ref={(element) => {
          this.node = element;
        }}
        className={[styles.carparcContainer].join(' ')}>
        <div className={styles.titleTab}>
          Gap to fullfil by Veichle Prestige
        </div>
        <div className={styles.titleItemsLength}>
          <ShowAll
            tableCarparkStatus={this.state.tableCarparkStatus}
            clickAll={this.clickAll}
            clickMost={this.clickMost}>
          </ShowAll>
        </div>

        <DynamicTableDrop2
          metadata={this.props.metadata}
          arrLevels={this.props.arrCarparkTableVar}
          arrValues={this.props.arrCarparkTableFixed}
          data={this.props.carPark}
          status={0}
          headerSize={100}
          clickable={true}
          showAll={this.state.tableCarparkStatus}
          openTabs={mdo.rim.key}
          orderKey={mdo.gap.key}
          type={'CarParc'}
          arrGrouped={[mdo.brand.key, mdo.nameplate.key, mdo.program.key, mdo.rim.key]}
        ></DynamicTableDrop2>
      </div>
    );
  }
}
