import React, {Component} from 'react';
import styles from './style.css';
import SwitcherButton from './switcher-button/switcher-button.js';
import GrapherLegenda from './grapher-legenda/grapher-legenda.js';
import GraphMapTopo from './src/graphs/maps/graph-map-topo';
import utils from './../utils.js';

class GraphMap extends Component {
  constructor(props) {
    super();
    this.test = 'GERMANY';
    this.state = {
      hoverLand: null
    };
  }
  shouldComponentUpdate(nextProps) {
    if (!this.visible) {
      return false;
    }
    if (nextProps.pageStatus === 'fetching') {
      //** don't do anything when fetching
      return false;
    }
    if (nextProps.pageReady && !this.g.firstTime) {
      //** give a re-paint when page is ready ( we we are sure that all info will be rendered)
      this.g.firstTime = true;
      this.g.render();
      return true;
    }
    return true;
  }
  componentDidMount() {
    window.addEventListener('resize', () => {
      this.resize();
    });
    let tempSettings = {
      type: this.props.type,
      grapher: this,
      match: this.props.match,
      filters: this.props.filters,
      metadata: this.props.metadata
    };
    this.g = new GraphMapTopo(this.node, tempSettings);//, this.node);
    this.g.create();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.visible) {
      return false;
    }
    //** update metadata on map
    this.g.metadata = this.props.metadata;
    if (nextProps.updateValueHover !== this.props.updateValueHover) {
      this.updateMapHover(nextProps.updateValueHover);
    }
    if (nextProps.landkDataFetched.d) {
      if (nextProps.navStatus !== 'land' && nextProps.navStatus !== 'landkreiser') {
        this.g.mood = nextProps.navStatus;
        this.g.onDataLandk(nextProps.landkDataFetched.d, nextProps.selectedPosChannel);
      }
    }
    if (nextProps.globalDataParsed) {
      this.dictCarDealers = nextProps.globalDataParsed.dictCarDealers;
      this.dictTyreTrade = nextProps.globalDataParsed.dictTyreTrade;
      this.g.updateGlobalData(nextProps.globalDataParsed);
    }

    if (!this.props.selectedPosChannel && this.props.selectedPosChannel !== 0) {
      this.g.updateMap(nextProps);
    } else {
      if (nextProps.selectedPosChannel !== this.props.selectedPosChannel) {
        if (nextProps.navStatus === 'land') {
          this.g.updateTypeMap(nextProps);
        }
        this.g.updateMap(nextProps);
      } else {
        this.g.updateMap(nextProps);
      }
    }

    if (!this.postcodeDict) {
      this.postcodeDict = {
        lk: null,
        d: {}
      };
    }
    if (this.postcodeDict.lk !== nextProps.match.params.landkreiser && nextProps.landkDataFetched.d) {
      for (let i = 0; i < nextProps.landkDataFetched.d.lkd.postcodes.length; i++) {
        let postcode = nextProps.landkDataFetched.d.lkd.postcodes[i].postcode;
        this.postcodeDict.d[postcode] = nextProps.landkDataFetched.d.lkd.postcodes[i];
      }
    }
  }
  sizeWillUpdate(w, h, isResize) {
    this.g.updatedSize(w, h, isResize);
  }

  resize() {
    setTimeout(() => {
      this.g.updatedSize();
    }, 300);
  }
  updateMapHover(l) {
    this.g.updateMapHover(l);
  }
  updateHover(l) {
    let output = null;
    switch (this.props.navStatus) {
    case 'land':
      switch (this.props.selectedPosChannel) {
      case 0:
          //** geo
        if (this.props.globalDataParsed.globalData.Germany.lands[l]) {
          output = {
            d: this.props.globalDataParsed.globalData.Germany.lands[l].globals,
            n: this.props.navStatus
          };
        }
        break;
      case 1:
          //** car dealers
        if (this.dictCarDealers[l]) {
          output = {
            d: this.dictCarDealers[l].globals,
            n: this.props.navStatus
          };
        }

        break;
      case 2:
          //** tyre trader
        if (this.dictTyreTrade[l]) {
          output = {
            d: this.dictTyreTrade[l].globals,
            n: this.props.navStatus
          };
        }
        break;
      }

      break;
    case 'landkreiser':
      //** check for filter exceptions
      if (this.props.globalDataParsed.dictLandkreis[l]) {
        output = {
          d: this.props.globalDataParsed.dictLandkreis[l].globals,
          n: this.props.navStatus
        };
      } else {
        if (this.props.globalDataParsed.dictLandkreis[this.props.filters[l]]) {
          output = {
            d: this.props.globalDataParsed.dictLandkreis[this.props.filters[l]].globals,
            n: this.props.navStatus
          };
        }
      }
      break;
    case 'postcode':
      if (this.postcodeDict.d[l]) {
        // output = this.postcode
        output = {
          d: this.postcodeDict.d[l],
          n: this.props.navStatus
        };
      }
      break;
    case 'action':
      break;
    }

    this.setState(
      {
        hoverLand: output
      });
  }
  render() {
    return (
      <div
        ref={(element) => {
          this.node = element;
        }}
        className={styles.graph}>

        <div className={styles.infoBar}>
          <SwitcherButton
            selectedPosChannel={this.props.selectedPosChannel}
            app={this.props.app}
            match={this.props.match}
            navStatus={this.props.navStatus}
            selectedSection={this.props.selectedSection}>
          </SwitcherButton>
        </div>
          <div
            className={styles.svgContainer}
            id='svgContainer'>
          </div>
          <GrapherLegenda
            dom={this.node}
            metadata={this.props.metadata}
            navStatus={this.props.navStatus}
            hoverLand={this.state.hoverLand}
          >
          </GrapherLegenda>

      </div>
    );
  }
}

export default GraphMap;
