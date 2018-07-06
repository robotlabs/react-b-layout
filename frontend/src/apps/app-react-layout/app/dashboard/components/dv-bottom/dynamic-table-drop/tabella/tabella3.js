import React, {Component} from 'react';
import styles from './style.css';
import {TabellaRow3} from './tabella-row3.js';
import {TabellaHeader3} from './tabella-header3.js';

class Tabella3 extends Component {
  constructor(props) {
    super(props);

    this.arrPercW = props.arrPercW;
    this.arrPercL = [];
    for (let i = 0; i < this.arrPercW.length; i++) {
      if (i > 0) {
        let v = 0;
        for (let j = i - 1; j >= 0; j--) {
          v += this.arrPercW[j];
        }
        this.arrPercL.push(v);
      } else {
        this.arrPercL.push(0);
      }
    }
  }
  render() {
    this.results = this.props;
    let sBodyContainer = styles['tableBodyContainer' + String(this.props.headerSize)];
    let firstValuePerc = 50;
    return (
    <div
    ref={(element) => {
      this.node = element;
    }}>
    <TabellaHeader3
      key={Math.random()}
      lev={1}
      firstValuePerc={firstValuePerc}
      arrLevels={this.results.arrLevels}
      arrValues={this.results.arrValues}
      arrPercW={this.arrPercW}
      arrPercL={this.arrPercL}
      >
    </TabellaHeader3>
    <div
      className={sBodyContainer}>
    {
      this.results.data.arrList.map((d, i) => {
        return (
          <div
            className={[styles.tabellaOverflow, 'grrr' + i].join(' ')}
          key={i}>
            <TabellaRow3
              lev={1}
              firstValuePerc={firstValuePerc}
              iter={i}
              clickable={this.props.clickable}
              arrLevels={this.results.arrLevels}
              arrValues={this.results.arrValues}
              arrPercW={this.arrPercW}
              arrPercL={this.arrPercL}
              mdo={this.props.mdo}
              hoverRow={this.props.hoverRow}
              outRow={this.props.outRow}
              clickRow={this.props.clickRow}
              data={d}
              >
            </TabellaRow3>
          </div>
        );
      })
    }
    </div>
    </div>
    );
  };
}
export default Tabella3;
