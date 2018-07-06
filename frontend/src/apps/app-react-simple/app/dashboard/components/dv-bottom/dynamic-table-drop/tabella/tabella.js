import React, {Component} from 'react';
import styles from './style.css';
import {TabellaRow} from './tabella-row.js';
import {TabellaHeader} from './tabella-header.js';

const rowH = 50;
const speed = 1;
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
    //** delay to allow animation to go back in place ( and have a nice reset)
    let timeoutReadSize = 700;
    setTimeout(() => {
    //** store height sizes
      for (let i = 0; i < this.results.data.arrList.length; i++) {
        let el = this.results.data.arrList[i];
        let brand = el[this.props.arrGrouped[0]];
        let nodeEl = this.node.getElementsByClassName('gr' + i)[0];
        nodeEl.style.display = 'block';
        this.absDict[String(i)] = nodeEl.offsetHeight;
        nodeEl.style.top = -nodeEl.offsetHeight + 'px';
        let brandObj = this.results.data.list[brand];
        for (let j = 0; j < brandObj.arrList.length; j++) {
          let nameplate = brandObj.arrList[j][this.props.arrGrouped[1]];
          let nodeEl = this.node.getElementsByClassName('g2r' + j + '-' + i)[0];
          nodeEl.style.display = 'block';
          this.absDict[String(i) + String(j)] = nodeEl.offsetHeight;
          nodeEl.style.top = -nodeEl.offsetHeight + 'px';
          let nameplateObj = brandObj.list[nameplate];
          for (let z = 0; z < nameplateObj.arrList.length; z++) {
            let nodeEl = this.node.getElementsByClassName('g3r' + z + '-' + j + '-' + i)[0];
            nodeEl.style.display = 'block';
            this.absDict[String(i) + String(j) + String(z)] = nodeEl.offsetHeight;
            nodeEl.style.top = -nodeEl.offsetHeight + 'px';
          }
        }
      }

      for (let i = 0; i < this.results.data.arrList.length; i++) {
        let el = this.results.data.arrList[i];
        let brand = el[this.props.arrGrouped[0]];
        let nodeEl = this.node.getElementsByClassName('gr' + i)[0];
        nodeEl.style.display = 'none';
        let brandObj = this.results.data.list[brand];
        for (let j = 0; j < brandObj.arrList.length; j++) {
          let nameplate = brandObj.arrList[j][this.props.arrGrouped[1]];
          let nodeEl = this.node.getElementsByClassName('g2r' + j + '-' + i)[0];
          nodeEl.style.display = 'none';
          let nameplateObj = brandObj.list[nameplate];
          for (let z = 0; z < nameplateObj.arrList.length; z++) {
            let nodeEl = this.node.getElementsByClassName('g3r' + z + '-' + j + '-' + i)[0];
            nodeEl.style.display = 'none';
          }
        }
      }
    }, timeoutReadSize);
    return (
    <div
    ref={(element) => {
      this.node = element;
    }}>
    <TabellaHeader
      key={Math.random()}
      lev={1}
      firstValuePerc={firstValuePerc}
      arrLevels={this.results.arrLevels}
      arrValues={this.results.arrValues}
      >
    </TabellaHeader>
    {
      this.results.data.arrList.map((d, i) => {
        return (
          <div
            className={[styles.tabellaOverflow, 'grrr' + i].join(' ')}
          key={i}>
            <TabellaRow
              lev={1}
              metadata={this.props.metadata}
              firstValuePerc={firstValuePerc}
              iter={i}
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
            </TabellaRow>
            <div
              className={[styles.tabellaLev2Out].join(' ')}>
              <div
                className={['gr' + i].join(' ')}>
                <TabellaHeader
                  key={Math.random()}
                  lev={2}
                  iter={i}
                  firstValuePerc={firstValuePerc}
                  arrLevels={this.results.arrLevels}
                  arrValues={this.results.arrValues}
                  >
                </TabellaHeader>
                {
                  this.results.data.list[d[this.props.arrGrouped[0]]].arrList.map((dd, j) => {
                    return (
                      <div
                        className={[styles.tabellaOverflow, 'g2rrr' + j + '-' + i].join(' ')}
                        key={j + i}>
                        <TabellaRow
                          lev={2}
                          iter={j}
                          iterFather={i}
                          onClick={
                            (e) => {
                              clickLev2(e, this);
                            }
                          }
                          metadata={this.props.metadata}
                          clickable={this.props.clickable}
                          firstValuePerc={firstValuePerc}
                          arrLevels={this.results.arrLevels}
                          arrValues={this.results.arrValues}
                          data={dd}
                          >
                        </TabellaRow>

                        <div
                          className={[styles.tabellaLev2Out].join(' ')}>
                          <div
                            className={['g2r' + j + '-' + i].join(' ')}>
                            <TabellaHeader
                              key={Math.random()}
                              lev={3}
                              iter={j}
                              iterFather={i}
                              firstValuePerc={firstValuePerc}
                              arrLevels={this.results.arrLevels}
                              arrValues={this.results.arrValues}
                              >
                            </TabellaHeader>
                            {
                              this.results.data.list[d[this.props.arrGrouped[0]]].list[dd[this.props.arrGrouped[1]]].arrList.map((ddd, z) => {
                                return (
                                  <div
                                    className={[styles.tabellaOverflow, styles.third, 'g3rrr' + z + '-' + j + '-' + i].join(' ')}
                                    key={j + z + i}>
                                    <TabellaRow
                                      lev={3}
                                      onClick={
                                        (e) => {
                                          clickLev3(e, this);
                                        }
                                      }
                                      metadata={this.props.metadata}
                                      firstValuePerc={firstValuePerc}
                                      iter={z}
                                      iterFather={j}
                                      iterGranFather={i}
                                      clickable={this.props.clickable}
                                      type={this.results.type}
                                      arrLevels={this.results.arrLevels}
                                      arrValues={this.results.arrValues}
                                      data={ddd}
                                      >
                                    </TabellaRow>

                                    <div
                                      className={[styles.tabellaLev2Out].join(' ')}>
                                    <div
                                      className={['g3r' + z + '-' + j + '-' + i].join(' ')}>
                                      <TabellaHeader
                                        key={Math.random()}
                                        lev={4}
                                        iter={z}
                                        iterFather={j}
                                        iterGranFather={i}
                                        firstValuePerc={firstValuePerc}
                                        type={this.results.type}
                                        arrLevels={this.results.arrLevels}
                                        arrValues={this.results.arrValues}
                                        >
                                      </TabellaHeader>
                                      {
                                        this.results.data.list[d[this.props.arrGrouped[0]]].list[dd[this.props.arrGrouped[1]]].list[ddd[this.props.arrGrouped[2]]].arrList.map((dddd, f) => {
                                          return (
                                            <div
                                              className={[styles.tabellaOverflow, styles.fourth, 'g4rrr' + f + '-' + z + '-' + j + '-' + i].join(' ')}
                                              key={j + z + i + f}>
                                              <TabellaRow
                                                lev={4}
                                                firstValuePerc={firstValuePerc}
                                                iter={f}
                                                iterFather={z}
                                                metadata={this.props.metadata}
                                                clickable={this.props.clickable}
                                                type={this.results.type}
                                                arrLevels={this.results.arrLevels}
                                                arrValues={this.results.arrValues}
                                                data={dddd}
                                                >
                                              </TabellaRow>
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
    );
  };
}
const clickLev1 = (e, scope) => {
  clickLev1Action(e.currentTarget, scope);
};
const clickLev2 = (e, scope) => {
  clickLev2Action(e.currentTarget, scope);
};
const clickLev3 = (e, scope) => {
  clickLev3Action(e.currentTarget, scope);
};
const displayNone = (el) => {
  el.style.display = 'none';
};
const clickLev1Action = (target, scope, speedTarget) => {

  if (speedTarget === -1) {
    speedTarget = 0;
  } else {
    speedTarget = 1;
  }

  target.style.zIndex = 20000;
  //** close other tabs
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
  if (scope.action1Dict[dataIter]) {
    //** CLOSE
    target.classList.remove(styles.gColorAClicked);
    TweenMax.to(ell, speedTarget, {
      height: rowH,
      ease: window.Power4.easeOut
    });
    el.style.display = 'block';
    TweenMax.to(el, speedTarget, {
      top: -superH,
      ease: window.Expo.easeOut,
      onComplete: displayNone,
      onCompleteParams: [el]
    });

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

    TweenMax.to(ell, speedTarget, {
      height: superH  + rowH ,
      ease: window.Power4.easeOut
    });
    el.style.display = 'block';
    TweenMax.to(el, speedTarget, {
      top: 0,
      ease: window.Expo.easeOut
    });

  }
};
const clickLev2Action = (target, scope, speedTarget) => {
  target.style.zIndex = 10000;

  if (speedTarget === -1) {
    speedTarget = 0;
  } else {
    speedTarget = 1;
  }
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
    clickLev3Action(el.target, scope, speedTarget);
  }

  let el = scope.node.getElementsByClassName('g2r' + dataIter + '-' + dataIterFather)[0];
  el.style.position = 'relative';
  let ell = scope.node.getElementsByClassName('g2rrr' + dataIter + '-' + dataIterFather)[0];
  let ellFather = scope.node.getElementsByClassName('grrr' + dataIterFather)[0];

  if (scope.action2Dict['d' + dataIter + dataIterFather]) {
    //** bring on top
    target.classList.remove(styles.gColor2Clicked);

    TweenMax.to(ell, speedTarget, {
      height: rowH,
      ease: window.Power4.easeOut
    });
    TweenMax.to(el, speedTarget, {
      top: 0,
      ease: window.Expo.easeOut
    });
    TweenMax.to(ellFather, speedTarget, {
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
    TweenMax.to(ell, speedTarget, {
      height: superH + rowH,
      ease: window.Power4.easeOut
    });
    TweenMax.to(ellFather, speedTarget, {
      height: superHFather + superH + rowH,
      ease: window.Power4.easeOut
    });
    el.style.display = 'block';
    TweenMax.to(el, speedTarget, {
      top: 0,
      ease: window.Expo.easeOut
    });
  }
};
const clickLev3Action = (target, scope, speedTarget) => {
  target.style.zIndex = 20000;
  if (speedTarget === -1) {
    speedTarget = 0;
  } else {
    speedTarget = 1.2;
  }
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

    TweenMax.to(ell, speedTarget, {
      height: rowH,
      ease: window.Power4.easeOut
    });
    TweenMax.to(el, speedTarget, {
      top: -superH,
      ease: window.Expo.easeOut
    });
    TweenMax.to(ellFather, speedTarget, {
      height: superHFather + rowH,
      ease: window.Power4.easeOut
    });
    TweenMax.to(ellGranFather, speedTarget, {
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

    TweenMax.to(ell, speedTarget, {
      height: superH + rowH,
      ease: window.Power4.easeOut
    });
    TweenMax.to(ellFather, speedTarget, {
      height: superH + superHFather + rowH,
      ease: window.Power4.easeOut
    });
    TweenMax.to(ellGranFather, speedTarget, {
      height: superH + superHFather + superHGranFather + rowH,
      ease: window.Power4.easeOut
    });
    el.style.display = 'block';
    TweenMax.to(el, speedTarget, {
      top: 0,
      ease: window.Expo.easeOut
    });
  }
};
export default Tabella;
