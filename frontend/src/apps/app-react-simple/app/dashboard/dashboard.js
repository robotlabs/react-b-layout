import React, {Component} from 'react';
import DashboardLayout from './dashboard-layout/dashboard-layout';
import LayoutMap from './dashboard-layout/layouts/layout-map.js';
import Dv1 from './components/dv-1/dv-1.js';
import Dv2 from './components/dv-2/dv-2.js';
import Dv3 from './components/dv-3/dv-3.js';
import Dv4 from './components/dv-4/dv-4.js';

// var BigData;
//** style
import style from './style.css';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    let layoutObj = LayoutMap.getLayout();
    this.layout = layoutObj.layout;
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    // Store prevUserId in state so we can compare when props change.
    // Clear out any previously-loaded user data (so we don't render stale stuff).
    console.log('nextProps ', nextProps);
    

    // No state update necessary
    return null;
  }
  shouldComponentUpdate(nextProps, nextState) {
    // if (nextProps.appReady) {
    //   let layoutObj = LayoutMap.getLayout(nextProps.match);
      
    //   if (layoutObj.valid) {
    //     this.layout = layoutObj.layout;
    //     return true;
    //   } else {
    //     this.props.app.redirectHome();
    //     return false;
    //   }
    // }
    return false;
  }

  componentDidMount(props) {}
  componentWillMount() {}

  componentWillUpdate(nextProps, nextState) {
    this.navStatus;
    this.landkData;
    if (nextProps.match.params.landkreiser) {
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
    return (
      <div className={style.dashboard}>
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
