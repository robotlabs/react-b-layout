import React, {Component} from 'react';
import styles from './style.css';
import utils from './../../utils.js';

let mdo;
class GrapherLegenda extends Component {
  //** avoid useless renders
  shouldComponentUpdate(nextProps) {
    return true;
  }
  constructor(props) {
    super(props);
  }
  componentWillReceiveProps(nextProps) {}
  //** and finally render
  render() {
    mdo = this.props.metadata.o;
    let boxStyle = styles.boxLand;
    let returnRenderObject;
    switch (this.props.navStatus) {
    case 'land':
      returnRenderObject = this.renderLand();
      break;
    case 'landkreiser':
      boxStyle = styles.boxLandkreis;
      returnRenderObject = this.renderLandkreis();
      break;
    case 'postcode':
      boxStyle = styles.boxPostcode;
      returnRenderObject = this.renderPostcode();
      break;
    case 'action':
      returnRenderObject = this.renderNone();
      break;
    }
    return (
      <div
        className={[styles.box, boxStyle].join(' ')}
        ref={(element) => {
          this.node = element;
        }}>
        {returnRenderObject}
      </div>
    );
  }

  renderLand() {
    let d = this.renderCore('land');
    if (d === -1) {
      return;
    }
    let data = {
      info: d.land,
      prestige_car_parc: d[mdo.prestige_car_parc.key],
      tyre_potential: d[mdo.tyre_potential.key],
      pullthrough_potential: d[mdo.pullthrough_potential.key],
      pirelli_volumes: d[mdo.pirelli_volumes.key],
      gap: d[mdo.gap.key],
      market_share: d[mdo.market_share.key]
    };
    return (
      <div className={this.styleDatabox}>
        <div className={styles.title}>{data.info}</div>
        <div className={styles.itemA}>
          <div className={styles.itemTitle}>{mdo.prestige_car_parc.label}</div>
          <div className={styles.item}>{utils.numberWithCommas(data.prestige_car_parc)}</div>
        </div>
        <div className={styles.itemB}>
          <div className={styles.itemTitle}>{mdo.tyre_potential.label}</div>
          <div className={styles.item}>{utils.numberWithCommas(data.tyre_potential)}</div>
        </div>
        <div className={styles.itemA}>
        <div className={styles.itemTitle}>{mdo.pullthrough_potential.label}</div>
        <div className={styles.item}>{utils.numberWithCommas(data.pullthrough_potential)}</div>
        </div>
        <div className={styles.itemB}>
          <div className={styles.itemTitle}>{mdo.pirelli_volumes.label}</div>
          <div className={styles.item}>{utils.numberWithCommas(data.pirelli_volumes)}</div>
        </div>
        <div className={styles.itemA}>
          <div className={styles.itemTitle}>{mdo.gap.label}</div>
          <div className={styles.item}>{utils.numberWithCommas(data.gap)}</div>
        </div>
        <div className={styles.itemB}>
          <div className={styles.itemTitle}>{mdo.market_share.label}</div>
          <div className={styles.item}>{utils.numberWithCommas(data.market_share)} %</div>
        </div>
      </div>
    );
  }
  renderLandkreis() {
    let d = this.renderCore('landkreiser');
    if (d === -1) {
      return;
    }
    let data = {
      info: d.landkreis,
      prestige_car_parc: d[mdo.prestige_car_parc.key],
      tyre_potential: d[mdo.tyre_potential.key],
      pullthrough_potential: d[mdo.pullthrough_potential.key],
      pirelli_volumes: d[mdo.pirelli_volumes.key],
      gap: d[mdo.gap.key],
      cd_pos: d[mdo.cd_pos.key],
      pos_prestige: d[mdo.cd_pos_prestige.key],
      cdPrestigePotential: d['CD Prestige Potential'],
      posTyreTrade: d['#Pos TyreTrade'],
      ttPrestigePotential: d['TT Prestige Potential'],
      market_share: d[mdo.market_share.key]
    };

    return (
      <div className={this.styleDatabox}>
        <div className={styles.title}>{data.info}</div>
        <div className={styles.itemA}>
          <div className={styles.itemTitle}>{mdo.prestige_car_parc.label}</div>
          <div className={styles.item}>{utils.numberWithCommas(data[mdo.prestige_car_parc.key])}</div>
        </div>
        <div className={styles.itemB}>
          <div className={styles.itemTitle}>{mdo.tyre_potential.label}</div>
          <div className={styles.item}>{utils.numberWithCommas(data.tyre_potential)}</div>
        </div>
        <div className={styles.itemA}>
          <div className={styles.itemTitle}>{mdo.pullthrough_potential.label}</div>
          <div className={styles.item}>{utils.numberWithCommas(data.pullthrough_potential)}</div>
        </div>
        <div className={styles.itemB}>
          <div className={styles.itemTitle}>{mdo.pirelli_volumes.label}</div>
          <div className={styles.item}>{utils.numberWithCommas(data.pirelli_volumes)}</div>
        </div>
        <div className={styles.itemA}>
          <div className={styles.itemTitle}>{mdo.gap.label}</div>
          <div className={styles.item}>{utils.numberWithCommas(data.gap)}</div>
        </div>
        <div className={styles.itemB}>
          <div className={styles.itemTitle}>{mdo.market_share.label}</div>
          <div className={styles.item}>{utils.numberWithCommas(data.market_share, true)} %</div>
        </div>
      </div>
    );
  }

  renderPostcode() {
    let d = this.renderCore('postcode');
    if (d === -1) {
      return;
    }
    return (
      <div className={this.styleDatabox}>
        <div className={styles.title}>{d.postcode}</div>
        <div className={styles.itemA}>
          <div className={styles.itemTitle}>{mdo.vehicles_count.label}</div>
          <div className={styles.item}>{utils.numberWithCommas(d[mdo.vehicles_count.key])}</div>
        </div>
        <div className={styles.itemB}>
          <div className={styles.itemTitle}>{mdo.pirelli_volumes.label}</div>
          <div className={styles.item}>{utils.numberWithCommas(d[mdo.pirelli_volumes.key])}</div>
        </div>
        <div className={styles.itemA}>
          <div className={styles.itemTitle}>{mdo.pos_count.label}</div>
          <div className={styles.item}>{utils.numberWithCommas(d[mdo.pos_count.key])}</div>
        </div>
      </div>
    );
  }

  renderCore(type) {
    if (!this.props.hoverLand || this.props.hoverLand.n !== type) {
      TweenMax.to(this.node, .5, {autoAlpha: 0});
      return -1;
    } else {
      TweenMax.to(this.node, .5, {autoAlpha: 1});
    }
    return this.props.hoverLand.d;
  }
  renderNone() {
    return (
      <div>
      </div>
    );
  }
}

export default GrapherLegenda; ;
