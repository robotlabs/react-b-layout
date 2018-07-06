import React, {Component} from 'react';
import Dropdown from './../../dropdown';

import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import green from '@material-ui/core/colors/green';

import styles from './style.css';

const stylesM = {
  root: {
    color: '#09c0f5',
    '&$checked': {
      color: '#09c0f5'
    },
    label: green[600]
  },

  checked: {
    color: '#09c0f5',
    '&$checked': {
      color: '#09c0f5'
    }
  },
  root2: {
    color: '#30f509',
    '&$checked': {
      color: '#30f509'
    }
  },

  label: {
    color: '#ffffff',
    textTransform: 'capitalize',
    backgroundColor: '#1d212c',
    padding: 2
  }
};
const posChannelLabels = {
  'car-dealer': 'CAR DEALER',
  'tyre-trader': 'TYRE TRADE'
};

class SwitcherButton extends Component {
  //** avoid useless renders
  shouldComponentUpdate(nextProps) {
    return true;
  }
  constructor(props) {
    super(props);
    this.check = this.check.bind(this);
    this.state = {
      selectedChannel: 0
    };
  }
  goHome() {
    this.props.app.redirectHome();
  }
  goLand(land, landkreis) {
    this.props.app.goUrl({
      nav: 'land',
      params: {
        land: land
      }
    });
  }

  navRender() {
    let land = this.props.match.params.land;
    let landkreiser = this.props.match.params.landkreiser;
    let postcode = this.props.match.params.extraInfo;
    switch (this.props.navStatus) {
    case 'land':
      return this.renderLand();
    case 'landkreiser':
      return this.renderLandkreis(land);
    case 'postcode':
      return this.renderPostcodes(land, landkreiser);
    case 'action':
      postcode = 'Action List :';
      return this.renderAction(land, landkreiser, postcode);
    }
  }

  renderLand() {
    return (
      <div>
        <div  className={styles.btli}>
          Germany
        </div>
      </div>
    );
  }
  renderLandkreis(land) {
    let label = land;
    switch (this.props.selectedPosChannel) {
    case 1:
      label = 'CAR DEALER: ' + land;
      break;
    case 2:
      label = 'TYRE TRADE: ' + land;
    }
    return (
      <div>
        <div className={styles.n}>
          <ul className={styles.nav}>
            <li className={styles.btli}>{label}</li>
            <li className={styles.btli}><a onClick={() => {
              this.props.app.redirectHome();
            }}>- Germany</a></li>
          </ul>
        </div>
      </div>
    );
  }
  check(c) {
    let v = Number(c.target.value);
    let posChannel = v;
    if (this.props.selectedPosChannel === v) {
      posChannel = 0;
    }
    this.props.app.updateChecked(posChannel);
  }

  renderPostcodes(land, landkreiser) {
    const {classes} = this.props;
    let checkedCD;
    let checkedTT;
    switch (this.props.selectedPosChannel) {
    case 0://** ALL
      checkedCD = true;
      checkedTT = true;
      break;
    case 1://** CAR DEALER
      checkedCD = true;
      checkedTT = false;
      break;
    case 2://** TYRE TRADE
      checkedCD = false;
      checkedTT = true;
      break;
    }

    let channelMapSwitcher;
    if (this.props.selectedSection === 1) {
      channelMapSwitcher
        = <div className={styles.cbCont}>
          <div className={styles.cb}>
            <FormControlLabel
              control={
                <Checkbox
                  className={styles.cb}
                  checked={checkedCD}
                  value="2"
                  onChange={this.check}
                  classes={{
                    root: classes.root2
                  }}
                />
              }
              label={posChannelLabels['car-dealer']}
              classes={{
                label: classes.label
              }}
            />
          </div>
          <div className={styles.cb2}>
            <FormControlLabel
              control={
                <Checkbox
                  className={styles.cb}
                  checked={checkedTT}
                  value="1"
                  onChange={this.check}
                  classes={{
                    root: classes.root,
                    checked: classes.checked
                  }}
                />
              }
              label={posChannelLabels['tyre-trader']}
              classes={{
                label: classes.label
              }}
            />
          </div>
        </div>;
    }
    return (
      <div>
        <div className={styles.n}>
          <ul className={styles.nav}>
            <li className={styles.btli}>{landkreiser}</li>
            <li className={styles.btli}><a onClick={() => {
              this.props.app.redirectHome();
            }}>- Germany</a></li>
            {channelMapSwitcher}
          </ul>
        </div>
      </div>
    );
  }
  renderAction(land, landkreiser, postcode) {

  }
  //** and finally render
  render() {
    return (
      <div
        className={styles.pos}
        ref={(element) => {
          this.node = element;
        }}>

        {this.navRender()}
      </div>
    );
  }
}

SwitcherButton.propTypes = {
  classes: PropTypes.object.isRequired
};
// export default SwitcherButton;
export default withStyles(stylesM)(SwitcherButton);
