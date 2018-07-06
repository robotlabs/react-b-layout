import React, {Component} from 'react';
import styles from './style.css';
import Dropdown from './../components/dropdown';
export default class Header extends Component {
  constructor(props) {
    super(props);
    this.imageLogo = window.DSA.staticBase +  'img/logo-pirelli-dsa.png';
    this.backImgPath = window.DSA.staticBase +  'img/back-arrow-fat.png';
    this.homeImgPath = window.DSA.staticBase +  'img/home.png';
    let mdo = this.props.metadata.strings;
    this.dropHomeChannelArray = {
      label: 'Point of View: ',
      values: [
        {
          name: mdo.Geo,
          d: 0
        },
        {
          name: mdo.CarDealer,
          d: 1
        },
        {
          name: mdo.TyreTrade,
          d: 2
        }
      ]
    };
    this.dropChannelArray = {
      label: 'Channel: ',
      values: [
        {
          name: mdo.All,
          d: 0
        },
        {
          name: mdo.CarDealer,
          d: 1
        },
        {
          name: mdo.TyreTrade,
          d: 2
        }
      ]
    };
    this.dropHomeSeasonalityArray = {
      label: 'Seasonality: ',
      values: [
        {
          name: mdo.Summer,
          d: 0
        },
        {
          name: mdo.Winter,
          d: 1
        },
        {
          name: mdo.Total,
          d: 2
        }
      ]
    };
    this.dropSeasonalityArray = {
      label: 'Seasonality: ',
      values: [
        {
          name: mdo.Summer,
          d: 0
        },
        {
          name: mdo.Winter,
          d: 1
        }
      ]
    };

  }
  componentDidMount() {
    this.node.style.height = this.props.size;
  }
  componentWillReceiveProps(nextProps) {}
  sizeWillUpdate(w, h) {}

  render() {
    let headerVar = <div></div>;
    switch (this.props.navStatus) {
    case 'land':
      headerVar
      = <div
        ref={(element) => {
          this.node = element;
        }}
        className={styles.headerNav}>
        {this.renderDropdowns(this.dropHomeChannelArray, this.dropHomeSeasonalityArray)}
        <div
          className={[styles.headerNavRight, styles.border].join(' ')}>
        </div>
      </div>;
      break;
    case 'landkreiser':
      headerVar
      = <div
        ref={(element) => {
          this.node = element;
        }}
        className={styles.headerNav}>
        {this.renderDropdowns(this.dropChannelArray, this.dropSeasonalityArray)}
        <div
          className={[styles.headerNavRight].join(' ')}>
        </div>
      </div>;
      break;
    default://** postcode || action
      headerVar
      = <div
        ref={(element) => {
          this.node = element;
        }}
        className={styles.headerNav}>
        {this.renderDropdowns(this.dropChannelArray, this.dropSeasonalityArray)}
        <div
          className={[styles.headerNavRight, styles.border].join(' ')}>
          {this.renderfocusActions()}
        </div>
      </div>;
      break;
    }

    return (
      <div>
        <div
          ref={(element) => {
            this.node = element;
          }}
          className={styles.headerBox}>
          <div className={styles.logo}><img src={this.imageLogo}></img></div>
          <div className={styles.imgContainer}>
            <a
              className={styles.headerMenuItem}
              onClick={() => {
                this.props.app.goBack();
              }}>
              <img width='15' height='20' src={this.backImgPath}></img>
            </a>
            <a
              className={styles.headerMenuItem}
              onClick={() => {
                this.props.app.goHome();
              }}>
              <img width='25' height='20' src={this.homeImgPath}></img>
            </a>
          </div>
        </div>
        {headerVar}
      </div>
    );
  }

  renderDropdowns(arrLeft, arrRight) {
    return (
      <div
        className={styles.headerNavLeft}>
        <div
          className={[styles.btDropLeft, styles.borderRight].join(' ')}>
          <Dropdown
            selected = {this.props.selectedPosChannel}
            filter = {arrLeft}
            id = {'0'}
            passSubClick = {(e, item) => {
              this.updateChannel(item);
            }}
          ></Dropdown>
        </div>
        <div
          className={[styles.btDropRight, styles.border].join(' ')}>
          <Dropdown
            style={styles.border}
            selected = {this.props.selectedSeason}
            filter = {arrRight}
            id = {'0'}
            passSubClick = {(e, item) => {
              this.updateSeason(item);
            }}
          ></Dropdown>
        </div>
      </div>
    );
  }

  updateChannel(item) {
    this.props.app.updateChannel(item);
  }
  updateSeason(item) {
    this.props.app.updateSeason(item);
  }
  renderfocusActions() {
    return (
      this.props.filter.values.map((item, i) => {
        let sBorder = styles.border;
        let sClicked;
        if (i === this.props.selectedSection) {
          sClicked = styles.clicked;
        }
        return (
            <li
              onClick = { () => {
                this.props.passSubClick(this, item);
              }}
              key={i}>
              <a
                className={[sBorder, sClicked].join(' ')}>
                <span>
                  {item.name}
                </span>
              </a>
            </li>
        );
      })
    );
  }
}
