import React, {Component} from 'react';
import AppConstants from './../app-utils/app-constants.js';
import DashboardLayout from './dashboard-layout/dashboard-layout';
import LayoutMap from './dashboard-layout/layouts/layout-map.js';

import Header from './header/header.js';
import Menu from './components/menu/menu';

import DvRightSide from './components/dv-rightside/dv-rightside.js';
import DvBottom from './components/dv-bottom/dv-bottom.js';
import GrapherMap from './components/grapher/grapher-map.js';

// var BigData;
//** style
import style from './style.css';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.onUpdateValueHover = this.onUpdateValueHover.bind(this);
    this.state = {
      selectedSection: 0,
      updateHover: null
      // layout: layoutA
    };
    this.switchButtonArray = {
      label: '',
      values: [
        {
          name: 'by CAR PARC',
          d: 0
        },
        {
          name: 'by TERRITORY',
          d: 1
        },
        {
          name: 'ACTION LIST',
          d: 2
        }
      ]
    };
    this.landkData = {};
    this.headerSize = 100;

  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.appReady) {
      let layoutObj = LayoutMap.getLayout(nextProps.match);
      if (layoutObj.valid) {
        this.layout = layoutObj.layout;
        return true;
      } else {
        this.props.app.redirectHome();
        return false;
      }
    }
    return false;
  }

  componentDidMount(props) {}
  componentWillMount() {}

  componentWillUpdate(nextProps, nextState) {
    this.navStatus;
    this.landkData;
    if (nextProps.match.params.landkreiser) {
      switch (nextProps.match.params.profileLayout) {
      case AppConstants.L_ACTION:
        this.navStatus = 'action';
        break;
      case AppConstants.L_CLIENT:
        this.navStatus = 'client';
        break;
      default:
        this.navStatus = 'postcode';
        break;
      }
      if (nextProps.landkDataFetching === 0) {
        if (this.props.app.dictLandkData[nextProps.match.params.landkreiser]) {
          //** we already have data. no need of api
          this.landkData = this.props.app.dictLandkData[nextProps.match.params.landkreiser];
        } else {
          //** we don't have data. call api
          this.props.app.fetchLandkreisData(nextProps.match.params.landkreiser);
          this.landkData = {};
        }
      } else {
        //** data is fetching. wait
        this.landkData = {};
      }

    } else {
      if (nextProps.match.params.land) {
        this.navStatus = 'landkreiser';
      } else {
        this.navStatus = 'land';
      }
    }

    if (this.navStatus === 'postcode') {
      this.selectedSection = nextState.selectedSection;
    }
    if (this.navStatus === 'action') {
      this.selectedSection = 2;
    }
  }

  updateLayout(layout) {
    this.setState({
    });
  }

  requestLocale(r) {
    this.props.app.requestLocale(r);
  }
  onUpdateValueHover(l) {
    // this.updateValueHover = l;
    // this.setState({updateValueHover: l});
  }
  render() {
    let landkDataFetched = {};

    if (this.landkData.lkd) {
      landkDataFetched = {
        d: this.landkData
      };
    } else {
      landkDataFetched = {};
    }
    return (
      <div className={style.dashboard}>

        <Header
          id='header'
          app={this.props.app}
          size={this.headerSize}
          metadata={this.props.metadata}
          navStatus={this.navStatus}
          filter = {this.switchButtonArray}
          selectedPosChannel={this.props.selectedPosChannel}
          selectedSeason={this.props.selectedSeason}
          selectedSection={this.selectedSection}
          passSubClick = {(button, bt) => {

            if (bt.d === 2) {
              this.selectedSection = bt.d;
              //** go in action list for landkreis
              this.props.app.goUrl({
                nav: 'action',
                params: {
                  land: this.props.match.params.land,
                  landkreis: this.props.match.params.landkreiser
                }
              });

            } else {
              this.setState({
                selectedSection: bt.d
              });
              this.selectedSection = bt.d;
              if (this.navStatus !== 'postcode') {
                this.props.app.goUrl({
                  nav: 'landkreis',
                  params: {
                    land: this.props.match.params.land,
                    landkreis: this.props.match.params.landkreiser
                  }
                });
              }
            }
          } }
        ></Header>

        <DashboardLayout
          headerSize={this.headerSize}
          appReady={this.props.appReady}
          ref={(element) => {
            this.dashboardLayout = element;
          }}
          layout={this.layout}
          >
          <Dv1
            id='dv-1'>
          </Dv1>
          <Dv2
            id='dv-2'>
          </Dv2>
          <Dv3
            id='dv-3'>
          </Dv3>
          <Dv4
            id='dv-4'>
          </Dv4>
        </DashboardLayout>
      </div>
    );
  }
}

export default Dashboard;
