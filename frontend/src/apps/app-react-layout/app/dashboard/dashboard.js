import React, {Component} from 'react';
import DashboardLayout from './dashboard-layout/dashboard-layout';
import LayoutMap from './dashboard-layout/layouts/layout-map.js';
import Dv1 from './components/dv-1/dv-1.js';
import Dv2 from './components/dv-2/dv-2.js';
import Dv3 from './components/dv-3/dv-3.js';
import Dv4 from './components/dv-4/dv-4.js';

//** style
import style from './style.css';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    //** declare the initial layout */
    this.state = {
      layout: LayoutMap.getLayout().layout
    };
  }

  //** utils function to update layout ( not used atm ) */
  updateLayout(layout) {
    this.setState({
      layout: layout
    });
  }

  render() {
    return (
      <div className={style.dashboard}>
        <DashboardLayout
          appReady={this.props.appReady}
          ref={(element) => {
            this.dashboardLayout = element;
          }}
          layout={this.state.layout}
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
