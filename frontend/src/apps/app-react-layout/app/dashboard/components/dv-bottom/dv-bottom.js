import React, {Component} from 'react';
import styles from './style.css';
import DVBottomLandkreisList from './dv-bottom-landkreis-list/dv-bottom-landkreis-list.js';
import DVBottomFocus from './dv-bottom-focus/dv-bottom-focus.js';
import DVBottomAction from './dv-bottom-action/dv-bottom-action.js';
export default class Dv1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
  }
  shouldComponentUpdate() {
    if (this.visible) {
      return true;
    } else {
      return false;
    }
  }
  componentWillReceiveProps(nextProps) {
    this.dataActive = null;
    this.dataProspect = null;

  }
  componentWillUpdate(nextProps, nextState) {}

  render() {
    switch (this.props.navStatus) {
    case 'land':
      this.returnRenderObject = this.renderNone();
      break;
    case 'landkreiser':
      this.returnRenderObject = this.renderLandkreis();
      break;
    case 'postcode':
      if (this.props.landkDataFetched) {
        this.returnRenderObject = this.renderPostcode();
      } else {
        this.returnRenderObject = this.renderNone();
      }
      break;
    case 'action':
      this.returnRenderObject = this.renderAction();
      break;
    case 'client':

      break;
    default:
      this.returnRenderObject = this.renderNone();
    }
    return (
      <div
        ref={(element) => {
          this.node = element;
        }}
        className={[styles.box].join(' ')}>
        <div className={styles.datavizBox}>
          {this.returnRenderObject}
        </div>
      </div>
    );
  }

  renderNone() {
    return (<div></div>);
  }
  renderLandkreis() {
    return (
      <DVBottomLandkreisList
        app={this.props.app}
        metadata={this.props.metadata}
        match={this.props.match}
        globalDataParsed={this.props.globalDataParsed}
        onUpdateValueHover={this.props.onUpdateValueHover}
        selectedPosChannel={this.props.selectedPosChannel}
      >
      </DVBottomLandkreisList>
    );
  }
  renderPostcode() {
    return (
      <DVBottomFocus
        app={this.props.app}
        metadata={this.props.metadata}
        match={this.props.match}
        navStatus={this.props.navStatus}
        landkDataFetched={this.props.landkDataFetched}
        landkDataFetching={this.props.landkDataFetching}
        selectedPosChannel={this.props.selectedPosChannel}
        selectedSection={this.props.selectedSection}
      >
      </DVBottomFocus>
    );
  }

  renderAction() {
    return (
      <DVBottomAction
        metadata={this.props.metadata}
        app={this.props.app}
        match={this.props.match}
        navStatus={this.props.navStatus}
        landkDataFetched={this.props.landkDataFetched}
        landkDataFetching={this.props.landkDataFetching}
        selectedPosChannel={this.props.selectedPosChannel}
      >
      </DVBottomAction>
    );
  }
}
