import React, {Component} from 'react';
import styles from './style.css';
import DynamicTableDrop3 from './../dynamic-table-drop/dynamic-table-drop3.js';
import {
  arrListTableFixed,
  arrListTableVar
} from './arr-tables.js';
let ap;
export default class DvBottomLandkreisList extends Component {
  constructor(props) {
    super(props);
    this.hoverRow = this.hoverRow.bind(this);
    this.clickRow = this.clickRow.bind(this);
    this.state = {};
  }

  render() {
    ap = this.props.metadata.o;
    this.returnRenderObject = this.renderLandkreis(this.props, this.props.match.params.land);

    return (
      <div
        className={[styles.box].join(' ')}
        ref={(element) => {
          this.node = element;
        }}>
        <div className={styles.datavizBox}>
          {this.returnRenderObject}
        </div>
      </div>
    );
  }

  renderLandkreis(nextProps, land) {
    let landData;

    if (nextProps.globalDataParsed.globalData.Germany.lands[land]) {
      landData = nextProps.globalDataParsed.globalData.Germany.lands[land].landkreis;
    }
    if (nextProps.globalDataParsed.dictCarDealers[land]) {
      landData = nextProps.globalDataParsed.dictCarDealers[land].list;
    }
    if (nextProps.globalDataParsed.dictTyreTrade[land]) {
      landData = nextProps.globalDataParsed.dictTyreTrade[land].list;
    }

    let arrLandData = [];
    for (let data in landData) {
      arrLandData.push(landData[data].globals);
    }
    this.parsedArr = arrLandData.sort((x, y) => {
      return d3.descending(x[ap.gap.key], y[ap.gap.key]);
    });
    let arrPercW = [
      15, 8, 8, 10, 8, 10, 11, 9, 7, 6, 8
    ];
    return (
      <DynamicTableDrop3
        metadata={this.props.metadata}
        arrLevels={arrListTableVar(ap)}
        arrValues={arrListTableFixed(ap)}
        data={this.parsedArr}
        status={0}
        headerSize={50}
        clickable={true}
        openTabs={ap.rim.key}
        orderKey={ap.gap.key}
        type={'landkreis-list'}
        arrPercW={arrPercW}
        arrGrouped={false}
        clickRow={this.clickRow}
        hoverRow={this.hoverRow}
        outRow={this.outRow}
      ></DynamicTableDrop3>
    );
  }
  clickRow(r) {
    let dataIter = r.currentTarget.getAttribute('data-iter');
    let el = this.parsedArr[dataIter];
    this.props.app.goLandkreisView(el.landkreis, el.land);
  }
  hoverRow(r) {
    // let dataIter = r.currentTarget.getAttribute('data-iter');
    // let el = this.parsedArr[dataIter];
    // this.props.onUpdateValueHover(el.landkreis);
  }
  outRow(r) {
    // this.props.onMouseOut(el.landkreis);
    // let dataIter = r.currentTarget.getAttribute('data-iter');
    // let el = this.parsedArr[dataIter];
    // this.props.onUpdateValueHover(el.landkreis);
  }
  createRenderLand() {
    return (
      <div></div>
    );
  }

}
