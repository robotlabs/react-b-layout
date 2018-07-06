import React, {Component} from 'react';
import styles from './style.css';
import utils from './../../utils.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import SwitcherButton from './../../grapher/switcher-button/switcher-button.js';
import DynamicTableDrop from './../dynamic-table-drop/dynamic-table-drop.js';
import ActionCarparc from './action-carparc/action-carparc.js';
import ActionPosactive from './action-posactive/action-posactive.js';

import {
  arrCarparkTableVar,
  arrCarparkTableFixed,
  arrPosActiveVar,
  arrPosActiveFixed,
  arrProspectVar,
  arrProspectFixed
} from './arr-tables.js';

//** api params
let mdo;
export default class Dv extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableCarparkStatus: 0
    };

  }
  componentDidMount() {}
  componentWillUnmount() {}
  shouldComponentUpdate() {
    return true;
  }
  componentWillReceiveProps() {}
  componentWillUpdate(nextProps, nextState) {
    let mainContainers = this.node.getElementsByClassName(styles.mainContainer);
    for (let i = 0; i < mainContainers.length; i++) {
      let mainC = mainContainers[i];
      mainC.style.opacity = 0;
      TweenMax.set(mainC, {alpha: 0});
    }
  }

  render() {
    mdo = this.props.metadata.o;
    let fetchedL = Object.keys(this.props.landkDataFetched).length;
    let fetching = this.props.landkDataFetching;
    if (fetchedL === 0 && fetching === 0) {
      this.returnRenderObject = this.renderNoData();
    } else {
      if (fetching === 1) {
        //** still loading
        this.returnRenderObject = this.renderLoading();
      } else {
        //** we got data

        let carPark = [];
        this.postcodeDict = {};
        if (this.props.landkDataFetched.d) {
          let arrPostcode = this.props.landkDataFetched.d.lkd.postcodes;
          for (let i = 0; i < arrPostcode.length; i++) {
            let postcode = arrPostcode[i].postcode;
            this.postcodeDict[String(postcode)] = arrPostcode[i];
          }
          if (!this.props.match.params.extraInfo) {
            carPark = this.props.landkDataFetched.d.lkd.focus.car_park;
          } else {
            if (!this.postcodeDict[this.props.match.params.extraInfo]) {
              carPark = [];
            } else {
              carPark = this.postcodeDict[this.props.match.params.extraInfo].car_park;
            }
          }
        }
        if (carPark.length === 0) {
          this.returnRenderObject = this.renderNoData();
        }

        this.returnRenderObject = this.renderCarPark(carPark);
        this.returnRenderPos = this.renderPos();
      }
    }

    //** simple animate IN
    setTimeout(() => {
      if (this.node) {
        let mainContainers = this.node.getElementsByClassName(styles.mainContainer);
        for (let i = 0; i < mainContainers.length; i++) {
          let mainC = mainContainers[i];
          TweenMax.to(mainC, 1.5, {alpha: 1});
        }
      }
    }, 200);
    return (
      <div
        ref={(element) => {
          this.node = element;
        }}>
        <div className={styles.landkreisTitle}>
          {this.props.match.params.landkreiser} Action List
        </div>
        <div
          className={styles.divCarParc}>
          {this.returnRenderObject}
        </div>
        {this.returnRenderPos}
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
  renderNone() {
    return (
      <div>
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

  renderPos() {
    let arrActive = [];
    for (let postcode in this.postcodeDict) {
      let pos = this.postcodeDict[postcode].pos;
      pos = utils.parsePosByChannel(pos, this.props.selectedPosChannel, mdo);
      for (let i = 0; i < pos.length; i++) {
        if (pos[i].type === 'Active') {
          arrActive.push(pos[i]);
        }
      }
    }

    if (arrActive.length > 0) {
      return (
        <div className={styles.mainContainer}>
          {this.renderPosActive(arrActive)}
          {this.renderPosProspect()}
        </div>
      );
    } else {
      return (
        <div className={styles.mainContainer}>
            {this.renderPosProspect()}
        </div>
      );
    }

  }

  renderPosActive(arr) {
    let arrPercW = [
      20, 10, 20, 13, 16, 16
    ];
    return (
      <div className={styles.divPosActive}>
      <ActionPosactive
        metadata={this.props.metadata}
        arrPosActiveVar={arrPosActiveVar(mdo)}
        arrPosActiveFixed={arrPosActiveFixed(mdo)}
        arrPercW={arrPercW}
        arr={arr}>
      </ActionPosactive>
      </div>
    );
  }
  renderPosProspect() {
    let postcodes = this.props.landkDataFetched.d.lkd.postcodes;
    let posList = [];
    for (let i = 0; i < postcodes.length; i++) {
      let posArr = postcodes[i].pos;
      posArr = utils.parsePosByChannel(posArr, this.props.selectedPosChannel, mdo);
      for (let j = 0; j < posArr.length; j++) {
        //** filter by prospect
        if (posArr[j].type === 'Prospect') {
          posList.push(posArr[j]);
        }
      }
    }
    //** territory
    return (
      <div className={styles.divPosProspect}>
        <div className={styles.titleTab}>
          By PoS Prospect {this.props.match.params.extraInfo}
        </div>
        {
        }
        <div className={styles.divPosProspectInner}>
        <DynamicTableDrop
          metadata={this.props.metadata}
          arrLevels={arrProspectVar(mdo)}
          arrValues={arrProspectFixed(mdo)}
          data={posList}
          clickable={true}
          status={0}
          orderKey={mdo.territory_declared_potential.key}
          type={'Territory'}
          arrGrouped={[mdo.macrotypology.key, mdo.typology.key, mdo.subtipology.key, mdo.pos_name.key]}
        ></DynamicTableDrop>
        </div>
      </div>
    );
  }

  renderCarPark(carPark) {
    return (
      <div className={styles.mainContainer}>
        <ActionCarparc
          metadata={this.props.metadata}
          carPark={carPark}
          arrCarparkTableVar={arrCarparkTableVar(mdo)}
          arrCarparkTableFixed={arrCarparkTableFixed(mdo)}
          >
        </ActionCarparc>
      </div>

    );
  }
}
