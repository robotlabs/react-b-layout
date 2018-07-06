import React, {Component} from 'react';
import styles from './style.css';
import utils from './../utils.js';
import {
  arrLevGermanyTotal,
  arrLevGermanySeasonValues,
  arrLevLandValues,
  arrLevLandkreisValues
} from './arr-tables.js';
//** api params
let mdo;
export default class DvRightSide extends Component {
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
  componentWillReceiveProps(nextProps) {
    mdo = nextProps.metadata.o;
    if (nextProps.match.params.landkreiser) {
      this.styleDatabox = styles.datavizBoxSmall;
    } else {
      this.styleDatabox = styles.datavizBox;
    }
    this.returnRenderObject;
    switch (nextProps.navStatus) {
    case 'action':
      this.returnRenderObject = this.createRenderLandkreiser(nextProps, nextProps.match.params.land, nextProps.match.params.landkreiser);
      break;
    case 'postcode':
      this.returnRenderObject = this.createRenderLandkreiser(nextProps, nextProps.match.params.land, nextProps.match.params.landkreiser);
      break;
    case 'landkreiser':
      this.returnRenderObject = this.createRenderLand(nextProps, nextProps.match.params.land);
      break;
    default:
      this.returnRenderObject = this.createRenderGermany(nextProps);
    }
  }

  render() {
    return (
      <div
        ref={(element) => {
          this.node = element;
        }}
        className={[styles.box].join(' ')}>
          {this.returnRenderObject}
      </div>
    );
  }

  renderList(g, arr, ss) {
    return (
      arr.map((d, i) => {
        let s = ss.A;
        if (i % 2 === 0) {
          s = ss.B;
        }
        let v = g[d.key];
        let isMarketshare = false;
        let suffix = '';
        if (d.key === mdo.market_share.key || d.key === mdo.market_share_total.key) {
          isMarketshare = true;
          suffix = ' %';
        }
        return (
          <div
            key={i}
            className={s}>
            <div className={styles.itemTitle}>{d.label}</div>
            <div className={styles.item}>{utils.numberWithCommas(v, isMarketshare)}{suffix}</div>
          </div>
        );
      })
    );
  }
  createRenderGermany(props) {
    if (props.globalDataParsed) {
      let germany = props.globalDataParsed.globalData.Germany.globals;
      return (
        <div className={this.styleDatabox}>
          <div className={styles.title}>Germany</div>
          <div className={styles.titleParagraph}>{mdo.Total}</div>
          {this.renderList(
            germany,
            arrLevGermanyTotal(mdo),
            {A: styles.itemATotal, B: styles.itemBTotal}
          )}
          {this.createSeasonGermany(germany, props.selectedSeason)}
        </div>
      );
    } else {
      return (<div></div>);
    }
  }
  createSeasonGermany(germany, season) {
    if (season !== 2) {
      return (
        <div>
        <div className={styles.titleParagraph}>{mdo.season}</div>
        {this.renderList(
          germany,
          arrLevGermanySeasonValues(mdo),
          {A: styles.itemB, B: styles.itemA}
        )}
        </div>
      );
    }
  }
  createRenderLand(props, landSelected) {
    let land;
    let gdp = props.globalDataParsed;
    if (gdp.globalData.Germany.lands[landSelected]) {
      land = props.globalDataParsed.globalData.Germany.lands[landSelected].globals;
    }
    if (gdp.dictCarDealers[landSelected]) {
      land = props.globalDataParsed.dictCarDealers[landSelected].globals;
    }
    if (gdp.dictTyreTrade[landSelected]) {
      land = props.globalDataParsed.dictTyreTrade[landSelected].globals;
    }
    if (props.globalDataParsed) {
      return (
        <div className={this.styleDatabox}>
          <div className={styles.title}>{landSelected}</div>
          {this.renderList(
            land,
            arrLevLandValues(mdo),
            {A: styles.itemLandB, B: styles.itemLandA}
          )}
        </div>
      );
    } else {
      return (<div></div>);
    }
  }
  createRenderLandkreiser(props, landSelected, landkreiserSelected) {
    if (props.globalDataParsed) {
      if (!props.globalDataParsed.globalData.Germany.lands[landSelected].landkreis[landkreiserSelected]) {
        landkreiserSelected = this.props.filters[landkreiserSelected];
      }
      let landkreis = props.globalDataParsed.globalData.Germany.lands[landSelected].landkreis[landkreiserSelected].globals;
      return (
        <div className={this.styleDatabox}>
          <div className={styles.title}>{landkreiserSelected}</div>
          {this.renderList(
            landkreis,
            arrLevLandkreisValues(mdo),
            {A: styles.itemBs, B: styles.itemAs}
          )}
        </div>
      );
    } else {
      return (<div></div>);
    }
  }
}
