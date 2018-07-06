import React, {Component} from 'react';
import styles from './style.css';
import {TabellaRow2} from './tabella-row2.js';
import {TabellaHeader2} from './tabella-header2.js';

const rowH = 50;
class Tabella extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    for (let targeting in this.action1Dict) {
      let el = this.action1Dict[targeting].target;
      clickLev1Action(el, this);
    }
    this.absDict = {};
    this.action1Dict = {};
    this.action2Dict = {};
    this.action3Dict = {};
    this.results = this.props;
    let firstValuePerc = 50;
    setTimeout(() => {
    //** store height sizes
      for (let i = 0; i < this.results.data.arrList.length; i++) {
        let el = this.results.data.arrList[i];
        let nodeEl = this.node.getElementsByClassName('gr' + i)[0];
        nodeEl.style.display = 'block';
        this.absDict[String(i)] = nodeEl.offsetHeight;
        nodeEl.style.top = -nodeEl.offsetHeight + 'px';
      }

      for (let i = 0; i < this.results.data.arrList.length; i++) {
        let nodeEl = this.node.getElementsByClassName('gr' + i)[0];
        nodeEl.style.display = 'none';
      }
    }, 10);
    return (
    <div
    ref={(element) => {
      this.node = element;
    }}>
    <TabellaHeader2
      key={Math.random()}
      lev={1}
      firstValuePerc={firstValuePerc}
      arrLevels={this.results.arrLevels}
      arrValues={this.results.arrValues}
      >
    </TabellaHeader2>
    <div
      className={styles['tableBodyContainer' + this.props.headerSize]}>
    {
      this.results.data.arrList.map((d, i) => {
        return (
          <div
            className={[styles.tabellaOverflow, 'grrr' + i].join(' ')}
          key={i}>
            <TabellaRow2
              lev={1}
              firstValuePerc={firstValuePerc}
              iter={i}
              metadata={this.props.metadata}
              clickable={this.props.clickable}
              arrLevels={this.results.arrLevels}
              arrValues={this.results.arrValues}
              data={d}
              onClick={
                (e) => {
                  clickLev1(e, this);
                }
              }
              >
            </TabellaRow2>
            <div
              className={[styles.tabellaLev2Out].join(' ')}>
              <div
                className={['gr' + i].join(' ')}>
                <TabellaHeader2
                  key={Math.random()}
                  lev={2}
                  iter={i}
                  metadata={this.props.metadata}
                  clickable={this.props.clickable}
                  firstValuePerc={firstValuePerc}
                  arrLevels={this.results.arrLevels}
                  arrValues={this.results.arrValues}
                  >
                </TabellaHeader2>
                {
                  this.results.data.list[String(d[this.props.arrGrouped[0]]) + String(d[this.props.arrGrouped[1]]) + String(d[this.props.arrGrouped[2]]) + String(d[this.props.arrGrouped[3]])].map((dd, j) => {
                    return (
                      <div
                        className={[styles.tabellaOverflow, 'g2rrr' + j + '-' + i].join(' ')}
                        key={j + i}>
                        <TabellaRow2
                          lev={2}
                          iter={j}
                          metadata={this.props.metadata}
                          clickable={this.props.clickable}
                          firstValuePerc={firstValuePerc}
                          arrLevels={this.results.arrLevels}
                          arrValues={this.results.arrValues}
                          data={dd}
                          >
                        </TabellaRow2>
                      </div>
                    );
                  })
                }
              </div>
            </div>
          </div>
        );
      })
    }
    </div>
    </div>
    );
  };
}
const clickLev1 = (e, scope) => {
  clickLev1Action(e.currentTarget, scope);
};

const displayNone = (el) => {
  el.style.display = 'none';
};
const clickLev1Action = (target, scope) => {
  //** close other tabs
  target.style.zIndex = 2000;
  let dataIter = target.getAttribute('data-iter');
  for (let targeting in scope.action2Dict) {
    clickLev2Action(scope.action2Dict[targeting].target, scope);
  }
  for (let targeting in scope.action1Dict) {
    let el = scope.action1Dict[targeting];
    if (el.dataIter !== dataIter) {
      clickLev1Action(scope.action1Dict[targeting].target, scope);
    }
  }

  //** size h enlargement
  let superH = scope.absDict[dataIter];
  let el = scope.node.getElementsByClassName('gr' + dataIter)[0];
  el.style.position = 'relative';
  let ell = scope.node.getElementsByClassName('grrr' + dataIter)[0];
  let speed = 1.2;
  if (scope.action1Dict[dataIter]) {
    //** CLOSE
    target.classList.remove(styles.gColorAClicked);
    TweenMax.to(ell, speed, {
      height: rowH,
      ease: window.Power4.easeOut
    });
    el.style.display = 'block';
    TweenMax.to(el, speed, {
      top: -superH,
      ease: window.Expo.easeOut,
      onComplete: displayNone,
      onCompleteParams: [el]
    });
    target.style.zIndex = 20000;
    //** button released
    delete scope.action1Dict[String(dataIter)];
  } else {
    //** OPEN
    target.classList.add(styles.gColorAClicked);
    //** store click
    scope.action1Dict[String(dataIter)] = {
      target: target,
      dataIter: dataIter
    };

    TweenMax.to(ell, speed, {
      height: superH  + rowH ,
      ease: window.Power4.easeOut
    });
    el.style.display = 'block';
    TweenMax.to(el, speed, {
      top: 0,
      ease: window.Expo.easeOut
    });

  }
};
const clickLev2Action = (target, scope) => {
  let dataIter = target.getAttribute('data-iter');
  let dataIterFather = target.getAttribute('data-iterfather');

  let superH = scope.absDict[String(dataIterFather) + String(dataIter)];
  let superHFather = scope.absDict[String(dataIterFather)];

  //** close other stuff
  for (let targeting in scope.action2Dict) {
    let el = scope.action2Dict[targeting];
    if (el.dataIter !== dataIter) {
      clickLev2Action(scope.action2Dict[targeting].target, scope);
    }
  }
  for (let targeting in scope.action3Dict) {
    let el = scope.action3Dict[targeting];
    clickLev3Action(el.target, scope);
  }

  let el = scope.node.getElementsByClassName('g2r' + dataIter + '-' + dataIterFather)[0];
  el.style.position = 'relative';
  let ell = scope.node.getElementsByClassName('g2rrr' + dataIter + '-' + dataIterFather)[0];
  let ellFather = scope.node.getElementsByClassName('grrr' + dataIterFather)[0];
  let speed = 1.2;

  if (scope.action2Dict['d' + dataIter + dataIterFather]) {
    //** bring on top
    target.classList.remove(styles.gColor2Clicked);
    target.style.zIndex = 10000;
    TweenMax.to(ell, speed, {
      height: rowH,
      ease: window.Power4.easeOut
    });
    TweenMax.to(el, speed, {
      top: rowH,
      ease: window.Expo.easeOut
      // onComplete: displayNone,
      // onCompleteParams: [el]
    });
    TweenMax.to(ellFather, speed, {
      height: superHFather + rowH,
      ease: window.Power4.easeOut
    });
    //** remove click
    delete scope.action2Dict['d' + dataIter + dataIterFather];
  } else {
    target.classList.add(styles.gColor2Clicked);
    //** store click
    scope.action2Dict['d' + dataIter + dataIterFather] = {
      target: target,
      dataIter: dataIter
    };
    TweenMax.to(ell, speed, {
      height: superH + rowH,
      ease: window.Power4.easeOut
    });
    TweenMax.to(ellFather, speed, {
      height: superHFather + superH + rowH,
      ease: window.Power4.easeOut
    });
    el.style.display = 'block';
    TweenMax.to(el, speed, {
      top: 0,
      ease: window.Expo.easeOut
    });
  }
};
const clickLev3Action = (target, scope) => {
  let dataIter = target.getAttribute('data-iter');
  let dataIterFather = target.getAttribute('data-iterfather');
  let dataIterGranFather = target.getAttribute('data-itergranfather');

  let superH = scope.absDict[String(dataIterGranFather) + String(dataIterFather) + String(dataIter)];
  let superHFather = scope.absDict[String(dataIterGranFather) + String(dataIterFather)];
  let superHGranFather = scope.absDict[String(dataIterGranFather)];

  for (let targeting in scope.action3Dict) {
    let el = scope.action3Dict[targeting];
    if (el.dataIter !== dataIter) {
      clickLev3Action(scope.action3Dict[targeting].target, scope);
    }
  }

  let el = scope.node.getElementsByClassName('g3r' + dataIter + '-' + dataIterFather + '-' + dataIterGranFather)[0];
  el.style.position = 'relative';
  let ell = scope.node.getElementsByClassName('g3rrr' + dataIter + '-' + dataIterFather + '-' + dataIterGranFather)[0];
  let ellFather = scope.node.getElementsByClassName('g2rrr' + dataIterFather + '-' + dataIterGranFather)[0];
  let ellGranFather = scope.node.getElementsByClassName('grrr' + dataIterGranFather)[0];
  let speed = 1.2;

  if (scope.action3Dict['dd' + dataIter + dataIterFather + dataIterGranFather]) {
    //** OPEN
    target.classList.remove(styles.gColor3Clicked);
    //** bring it on
    target.style.zIndex = 20000;
    TweenMax.to(ell, speed, {
      height: rowH,
      ease: window.Power4.easeOut
    });
    TweenMax.to(el, speed, {
      top: -superH,
      ease: window.Expo.easeOut
      // onComplete: displayNone,
      // onCompleteParams: [el]
    });
    TweenMax.to(ellFather, speed, {
      height: superHFather + rowH,
      ease: window.Power4.easeOut
    });
    TweenMax.to(ellGranFather, speed, {
      height: superHGranFather + superHFather + rowH,
      ease: window.Power4.easeOut
    });
    delete scope.action3Dict['dd' + dataIter + dataIterFather + dataIterGranFather];
  } else {
    //** CLOSE
    target.classList.add(styles.gColor3Clicked);
    //** store click
    scope.action3Dict['dd' + dataIter + dataIterFather + dataIterGranFather] = {
      target: target,
      dataIter: dataIter
    };

    TweenMax.to(ell, speed, {
      height: superH + rowH,
      ease: window.Power4.easeOut
    });
    TweenMax.to(ellFather, speed, {
      height: superH + superHFather + rowH,
      ease: window.Power4.easeOut
    });
    TweenMax.to(ellGranFather, speed, {
      height: superH + superHFather + superHGranFather + rowH,
      ease: window.Power4.easeOut
    });
    el.style.display = 'block';
    TweenMax.to(el, speed, {
      top: 0,
      ease: window.Expo.easeOut
    });
  }
};
export default Tabella;

/*

*/

/*

*/
