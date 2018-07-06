import React, {Component} from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import styles from './style.css';
import DynamicTableDrop from './../dynamic-table-drop/dynamic-table-drop.js';

import {
  arrCarparkLevels,
  arrCarparkValues,
  arrTerritoryTableVar,
  arrTerritoryTableFixed
} from './arr-tables.js';

import utils from './../../utils.js';

//** api params
let ap;
class DvBottomFocus extends Component {

  constructor(props) {

    super(props);
    this.state = {
      selected: 0,
      tableCarparkStatus: 0,
      tableTerritoryStatus: 0
    };

    this.switchButtonArray = {
      label: '',
      values: [
        {
          name: 'FOCUS: CAR PARK',
          d: 0
        },
        {
          name: 'FOCUS: TERRITORY',
          d: 1
        },
        {
          name: 'ACTION LIST: LANDKREIS',
          d: 2
        }
      ]
    };
  }
  componentDidMount() {
  }
  componentWillUnmount() {
  }
  shouldComponentUpdate() {
    return true;
  }
  componentWillReceiveProps(nextProps) {}
  componentWillUpdate(nextProps, nextState) {
    this.switchButtonArray.values[2].name = 'ACTION LIST: ' + nextProps.match.params.landkreiser;
  }

  render() {
    ap = this.props.metadata.o;
    let fetchedL = Object.keys(this.props.landkDataFetched).length;
    let fetching = this.props.landkDataFetching;
    if (fetchedL === 0 && fetching === 0) {
      this.returnRenderObject = this.renderNoData();
    } else {
      if (fetching === 1) {
        this.returnRenderObject = this.renderLoading();
      } else {
        this.returnRenderObject = this.renderPostcode(this.props.landkDataFetched);
      }
    }

    return (
      <div
        ref={(element) => {
          this.node = element;
        }}>
        <div className={styles.datavizBox}>
          {this.returnRenderObject}
        </div>
      </div>
    );
  }

  renderNoData() {
    return (
      <div>
        NO DATA AVAILABLE
      </div>
    );
  }
  renderLoading() {
    return (
      <div>
        <div className={styles.loading}>
          LOADING <br></br>
          {this.props.match.params.landkreiser}
          <br></br>
          <CircularProgress
            style={{color: '#ffdd00'}}
            thickness={7}
          />
        </div>
      </div>
    );
  }
  renderPostcode() {
    let focusStatus;
    if (this.props.selectedSection === 0) {
      focusStatus = 'FOCUS: by CAR PARC';
    } else {
      focusStatus = 'FOCUS: by TERRITORY';
    }

    return (
      <div>
        <div
        className={styles.focusHeader}>
        <span>
        {focusStatus}
        </span>
        </div>
        <div className={styles.mainContainer}>
          <div
            className={styles.containerIn}>
          {this.renderFocus()}
          </div>
        </div>
      </div>
    );
  }
  renderFocus() {
    let postcodes = this.props.landkDataFetched.d.lkd.postcodes;
    let posList = [];
    for (let i = 0; i < postcodes.length; i++) {
      let posArr = postcodes[i].pos;
      posArr = utils.parsePosByChannel(posArr, this.props.selectedPosChannel, ap);
      for (let j = 0; j < posArr.length; j++) {
        posList.push(posArr[j]);
      }
    }
    if (this.props.selectedSection === 0) {
      let landkreisDataFocusCarpark = this.props.landkDataFetched.d.lkd.focus.car_park;
      //** car park
      return (
        <DynamicTableDrop
          metadata={this.props.metadata}
          arrLevels={arrCarparkLevels(ap)}
          arrValues={arrCarparkValues(ap)}
          data={landkreisDataFocusCarpark}
          clickable={true}
          status={0}
          orderKey={ap.gap.key}
          type={'CarParc'}
          arrGrouped={[ap.brand.key, ap.nameplate.key, ap.program.key, ap.rim.key, ap.size.key]}
        ></DynamicTableDrop>
      );
    } else {
      let postcodes = this.props.landkDataFetched.d.lkd.postcodes;
      let posList = [];
      for (let i = 0; i < postcodes.length; i++) {
        let posArr = postcodes[i].pos;
        posArr = utils.parsePosByChannel(posArr, this.props.selectedPosChannel, ap);
        for (let j = 0; j < posArr.length; j++) {
          posList.push(posArr[j]);
        }
      }
      //** territory
      return (
        <DynamicTableDrop
          metadata={this.props.metadata}
          arrLevels={arrTerritoryTableVar(ap)}
          arrValues={arrTerritoryTableFixed(ap)}
          data={posList}
          clickable={true}
          status={0}
          orderKey={ap.territory_declared_potential.key}
          type={'Territory'}
          arrGrouped={[ap.macrotypology.key, ap.typology.key, ap.subtipology.key, ap.pos_name.key]}
        ></DynamicTableDrop>
      );
    }
  }
}
export default DvBottomFocus;
