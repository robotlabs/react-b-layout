import React, {Component} from 'react';
import Dashboard from './dashboard/dashboard.js';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import Api from '../../shared-services/api.js';
import appConstants from './app-utils/app-constants.js';
import {
  parserGlobalData,
  parseLandkData
} from './services/data-parser.js';

import landkreisFilters from './data/filter.pirelli-geo.maps.markets.json';
import AlertPop from './dashboard/components/alertpop/alertpop.js';

import Metadata from './services/metadata.js';

let globalDataParsed;
//** global styles, used across the app
import styles from './style.css';
styles;
const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#30f509',
      dark: '#002884',
      contrastText: '#fff'
    },
    secondary: {
      light: '#ff7961',
      main: '#30f509',
      dark: '#ba000d',
      contrastText: '#000'
    }
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    this.globals = {};
    this.globals.data = {};
    this.dictLandkData = {};
    let today = new Date();
    let month = today.getMonth() + 1;
    let initSeason = 0;
    if (month < 4 || month > 9) {
      initSeason = 1;
    }
    this.state = {
      appReady: false,
      landkDataFetching: 0,
      landkDataFetched: 'nada',
      selectedPosChannel: 0,
      selectedSeason: initSeason
    };

    this.history = false;
  }
  //** called by any url update or when app state change
  shouldComponentUpdate(nextProps, nextState) {
    //** detect if any posChannel in urlObject
    if (nextState.selectedPosChannel === this.state.selectedPosChannel) {
      switch (nextProps.match.params.profileLayout) {
      case 'l-home-cd':
        nextState.selectedPosChannel = 1;
        break;
      case 'l-home-tt':
        nextState.selectedPosChannel = 2;
        break;
      case 'l-lsm-cd':
        nextState.selectedPosChannel = 1;
        break;
      case 'l-lsm-tt':
        nextState.selectedPosChannel = 2;
        break;
      }
    }
    //** is app ready ?
    if (nextProps.match.params.profileLayout === appConstants.L_LAND) {
      this.state.landkDataFetching = 0;
    }
    if (nextState.appReady) {
      //** if first time, render
      if (!this.state.appReady) {
        return true;
      //** not first time ? render only if url change, or datafetching
      } else {
        if (this.props.match.url !== nextProps.match.url) {
          return true;
        } else {
          //** loading done
          if (nextState.landkDataFetching !== this.state.landkDataFetching) {
            return true;
          }
          if (nextState.selectedPosChannel !== this.state.selectedPosChannel) {
            this.updatedChannel(nextState);
            return true;
          }
          if (nextState.selectedSeason !== this.state.selectedSeason) {
            return true;
          }
          return false;
        }
      }
    } else {
      return false;
    }
  }

  componentDidMount() {
    this.fetchGermanyData();
  }

  //** call after germany data are fetched
  initApp() {
    this.onPageLoaded();
    this.setState({
      appReady: true
    });
  }

  redirectHome() {
    this.goUrl();
  }

  //** request global data. then the app can start
  fetchGermanyData() {
    let token = {};
    let apiParams = {};
    Api.fetchData(
      Api.endpoints.getGermanyData(),
      //** eventual parser
      this.callParseGlobalData.bind(this),
      this.onDataFetchedFail,
      token,
      apiParams
    ).then(
      this.onGermanyDataFetched.bind(this),
      this.onDataFetchedFail
    );
  }
  //** request landkreis data
  fetchLandkreisData(landkreis, callback) {

    // "Neumarkt in der Oberpfalz": "Neumarkt i.d.OPf.",

    this.setState({
      landkDataFetching: 1,
      landkDataFetched: {}
    });
    let apiParamsTopojson = {
      test: landkreis
    };
    let landkreisApi = landkreis;
    if (landkreisFilters[landkreis]) {
      landkreisApi = landkreisFilters[landkreis];
    }
    let apiParamsData = {
      landk: landkreisApi
    };
    this.getLandkTopojson(apiParamsTopojson)
    .then(
      (topojsonPostcodes) => {
        this.getLandkData(apiParamsData)
        .then(
          (landkData) => {
            if (!landkData) {
              return;
            }
            if (Object.keys(landkData).length > 0) {
              let d = {
                tp: topojsonPostcodes,
                lkd: landkData
              };
              this.dictLandkData[landkreis] = d;
              this.setState({
                landkDataFetching: 0,
                landkDataFetched: {
                  l: landkreis,
                  d: d
                }
              });
            } else {
              apiParamsData.landk = landkreisFilters[apiParamsData.landk];
              this.getLandkData(apiParamsData)
              .then(
                (landkData) => {
                  let d = {
                    tp: topojsonPostcodes,
                    lkd: landkData
                  };
                  this.dictLandkData[landkreis] = d;
                  this.setState({
                    landkDataFetching: 0,
                    landkDataFetched: {
                      l: landkreis,
                      d: d
                    }
                  });
                }
              );
            }
          }
        );
      }
    );
  }

  getLandkTopojson(apiParams) {
    return Api.fetchData(
      Api.endpoints.getTopojsonLandkreis(),
      (r) => {
        return r;
      },
      this.onDataFetchedFail.bind(this),
      {},
      apiParams
    );
  }
  getLandkData(apiParams) {
    return Api.fetchData(
      Api.endpoints.getLandkreisData(),
      this.parseLandkData,
      this.onDataFetchedFail.bind(this),
      {},
      apiParams
    );
  }

  onDataFetchedFail(e) {
    console.log('** ERROR ', e);
    this.state.landkDataFetching = 0;
    this.createAlertPop('Sorry, data not available at the moment');
    this.goBack();
  }
  callParseGlobalData(r) {
    Metadata.digestMetadata(r, this.state.selectedSeason);
    return parserGlobalData(r, Metadata);
  }
  parseLandkData(r) {
    return parseLandkData(r);
  }
  onGermanyDataFetched(r) {
    globalDataParsed = r;
    this.initApp();
  }

  createAlertPop(message) {
    this.alertPop.call(message, 4, 'no-data');
  }
  thanks() {
    this.alertPop.call('Thanks!', 2.5, 'no-data');
  }

  goLandkreisView(name, state) {
    this.goUrl({
      nav: 'landkreis',
      params: {
        land: state,
        landkreis: name
      }
    });
  }
  goUrl(urlObject) {
    let uo = urlObject;
    let url;

    //** in case there are no info, go home
    if (!uo) {
      let t = null;
      switch (this.selectedPosChannel) {
      case 1:
        t = 'cd';
        break;
      case 2:
        t = 'tt';
        break;
      }
      uo = {
        nav: 'home',
        params: {
          type: t
        }
      };
    }
    if (this.state.selectedSeason === 2) {
      this.urlWaitSeason = urlObject;
      this.alertPop.call('Please choose a seson', -1, 'no-season');
      return;
    }
    switch (uo.nav) {
    case 'home':
      switch (uo.params.type) {
      case 'cd':
        this.state.selectedPosChannel = 1;
        // this.selectedMap = 1;
        url = appConstants.BASE_URL + appConstants.L_HOME_CD;
        break;
      case 'tt':
        this.state.selectedPosChannel = 2;
        // this.selectedMap = 2;
        url = appConstants.BASE_URL + appConstants.L_HOME_TT;
        break;
      default:
        this.state.selectedPosChannel = 0;
        // this.selectedMap = 0;
        url = appConstants.BASE_URL + appConstants.L_HOME;
      }

      break;
    case 'land':
      switch (uo.params.type) {
      case 'cd':
        this.lastCd = uo.params.cd;
        url = appConstants.BASE_URL + appConstants.L_LSM_CD + '/' + uo.params.cd;
        break;
      case 'tt':
        this.lastTt = uo.params.tt;
        url = appConstants.BASE_URL + appConstants.L_LSM_TT + '/' + uo.params.tt;
        break;
      default:
        switch (this.state.selectedPosChannel) {
        case 0://** no pos channel selected
          url = appConstants.BASE_URL + appConstants.L_LAND + '/' + uo.params.land;
          this.globals.data.info = uo.params.land;
          break;
        case 1://** Car Dealer selected in pos channel
          if (this.lastCd) {
            url = appConstants.BASE_URL + appConstants.L_LSM_CD + '/' + this.lastCd;
          } else {
            this.goSafeHome();
          }
          break;
        case 2://** Tyre Trade selected in pos channel
          if (this.lastTt) {
            url = appConstants.BASE_URL + appConstants.L_LSM_TT + '/' + this.lastTt;
          } else {
            this.goSafeHome();
          }
          break;
        }
      }

      break;
    case 'landkreis':
      url = appConstants.BASE_URL + appConstants.L_LANDKREIS + '/' + uo.params.land + '/' + uo.params.landkreis;
      this.globals.data.info = uo.params.landkreis;
      break;
    case 'action':
      url = appConstants.BASE_URL + appConstants.L_ACTION + '/' + uo.params.land + '/' + uo.params.landkreis;
      break;
    default:
      console.log('LOG * DEFAULT ?');
    }

    this.props.history.push(url);
    this.history = true;
  }

  //** go back to previous
  goBack() {
    switch (this.dashboard.navStatus) {
    case 'land':
      if (this.history) {
        this.props.history.goBack();
      }
      break;
    case 'landkreiser':
      this.goCarefullyHome();
      break;
    case 'postcode':
      this.goUrl({
        nav: 'land',
        params: {
          land: this.props.match.params.land
        }
      });
      break;
    case 'action':
      this.goUrl({
        nav: 'landkreis',
        params: {
          land: this.props.match.params.land,
          landkreis: this.props.match.params.landkreiser
        }
      });
      break;
    }
  }
  goHome() {
    this.goCarefullyHome();
  }
  goCarefullyHome() {
    switch (this.state.selectedPosChannel) {
    case 1:
      this.goUrl({
        nav: 'home',
        params: {
          type: 'cd'
        }
      });
      break;
    case 2:
      this.goUrl({
        nav: 'home',
        params: {
          type: 'tt'
        }
      });
      break;
    default:
      this.goUrl();
    }
  }

  updateChannel(item) {
    switch (this.dashboard.navStatus) {
    case 'landkreiser':
      this.goSafeHome(item.d);
      break;
    default:
      this.setState(() => {
        return {
          selectedPosChannel: item.d
        };
      });
    }
  }
  updateSeason(item) {
    let season;
    switch (item.d) {
    case 0:
      season = 'Summer';
      break;
    case 1:
      season = 'Winter';
      break;
    case 2:
      season = 'Total';
      break;
    }
    Metadata.updateSeason(season);
    globalDataParsed = parserGlobalData(globalDataParsed.globalData, Metadata);
    this.setState(() => {
      return {
        selectedSeason: item.d
      };
    });
  }
  goSafeHome(requestedSelectedPosChannel) {
    let type;
    switch (requestedSelectedPosChannel) {
    case 0:
      type = null;
      break;
    case 1:
      type = 'cd';
      break;
    case 2:
      type = 'tt';
      break;
    }
    this.goUrl({
      nav: 'home',
      params: {
        type: type
      }
    });
  }
  updatedChannel(nextState) {
    if (this.dashboard.navStatus === 'land') {
      let type;
      switch (nextState.selectedPosChannel) {
      case 0:
        type = null;
        break;
      case 1:
        type = 'cd';
        break;
      case 2:
        type = 'tt';
        break;
      }
      this.goUrl({
        nav: 'home',
        params: {
          type: type
        }
      });
    }
  }
  updateChecked(posChannel) {
    this.setState({selectedPosChannel: posChannel});
  }

  //** all data are ready for render
  onPageLoaded() {
    let loaderPage = document.getElementsByClassName('loader-page')[0];
    let loaderPageContent = document.getElementsByClassName('loader-page-content')[0];
    TweenMax.to(loaderPageContent, .4, {autoAlpha: 0, delay: .5});
    TweenMax.to(loaderPage, 1.5, {
      autoAlpha: 0,
      ease: window.Power4.easeInOut,
      delay: .5
    });
  }
  render() {
    return (
      <div>
        <MuiThemeProvider theme={theme}>
        <div>
          <AlertPop
            ref={(element) => {
              this.alertPop = element;
            }}
            id='alert-pop'
            app={this}
            message={this.message}>
          </AlertPop>
          <Dashboard
            ref={(element) => {
              this.dashboard = element;
            }}
            app={this}
            metadata={Metadata}
            selectedPosChannel={this.state.selectedPosChannel}
            selectedSeason={this.state.selectedSeason}
            landkDataFetching={this.state.landkDataFetching}
            landkDataFetched={this.state.landkDataFetched}
            globalDataParsed={globalDataParsed}
            filters={landkreisFilters}
            match={this.props.match}
            appReady={this.state.appReady}>
          </Dashboard>
        </div>

        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
