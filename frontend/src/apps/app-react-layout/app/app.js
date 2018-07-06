import React, {Component} from 'react';
import Dashboard from './dashboard/dashboard.js';

import DataSet from './data/example.json';
import {parser} from './services/data-parser';

//** global styles, used across the app
import styles from './style.css';
styles;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.loaded) {
      return true;
    }
    return false;
  }
  componentDidMount() {
    this.initApp();
  }

  initApp() {
    let r = parser(DataSet);
    this.onDataParsed(r);
  }

  onDataParsed(results) {
    this.results = results;
    if (results) {
      if (!this.state.loaded) {
        this.onPageLoaded();
        //** start render */
        this.setState({
          loaded: true
        });
      }
    }
  }
  onDataFailed(error) {
    console.log('error :', error);
  }

  //** all data are ready for render
  onPageLoaded() {
    var loaderPage = document.getElementsByClassName('loader-page')[0];
    var loaderPageContent = document.getElementsByClassName('loader-page-content')[0];
    TweenMax.to(loaderPageContent, .4, {autoAlpha: 0, delay: .5});
    TweenMax.to(loaderPage, 1.5, {
      autoAlpha: 0,
      ease: window.Power4.easeInOut,
      delay: .5
    });
  }

  render() {
    return (
      <Dashboard
        ref={(element) => {
          this.dashboard = element;
        }}>
      </Dashboard>
    );
  }
}

export default App;
