import React from 'react';
import styles from './style.css';
import utils from './../../../utils.js';

export const TabellaRow2 = (props) => {
  let firstValuePerc = props.firstValuePerc;
  let levKey = props.arrLevels[props.lev - 1].key;
  let levKey2 = props.arrLevels[props.lev].key;
  let levKey3 = props.arrLevels[props.lev + 1].key;
  let levKey4 = props.arrLevels[props.lev + 2].key;
  let arrValues = props.arrValues;
  let arrLevels = props.arrLevels;
  let sColor = styles.gColorA;
  let sSize = styles.gSize;
  let iter = props.iter;
  let iterFather = props.iterFather;
  let iterGranFather = props.iterGranFather;
  let sColorHover;
  if (props.clickable) {
    sColorHover = styles.gColorAHover;
  }
  if (props.iter % 2 === 0) {
    if (props.clickable) {
      sColorHover = styles.gColorBHover;
    }
    sColor = styles.gColorB;
  }

  if (props.lev === 2) {
    sColor = styles.gColor2A2;
    if (props.iter % 2 === 0) {
      sColor = styles.gColor2B2;
    }
  }

  let arrPercLeft = [15, 30, 40];
  let arrPercWidth = [15, 15, 10];
  let arrLevelsPure = [];
  for (let i = 0; i < arrLevels.length - 1; i++) {
    if (i > 0) {
      arrLevelsPure.push(arrLevels[i]);
    }
  }
  let arrLevelsPureTemp = [];
  if (props.lev > 1) {
    arrLevelsPureTemp = [];
    arrLevelsPureTemp.push(arrLevels[arrLevels.length - 1]);
    levKey = levKey4;
  }

  return (
    <div
      onClick={props.onClick}
      data-iter={iter}
      data-iterfather={iterFather}
      data-itergranfather={iterGranFather}
      className={[styles.container, sColor, sColorHover, styles['containerLev' + props.lev]].join(' ')}>
      <div
        key={Math.random()}
        style={{left: 0 + '%'}}
        className={[styles.gx, sSize, styles['gLev' + props.lev], styles.grid20].join(' ')}>
        <span>
        {utils.numberWithCommas(props.data[levKey])}
        </span>
      </div>

      {
        arrLevelsPure.map((d, i) => {
          if (props.lev > 1) {
            return;
          }
          let levKeyTemp;
          switch (i) {
          case 0:
            levKeyTemp = levKey2;
            break;
          case 1:
            levKeyTemp = levKey3;
            break;
          case 2:
            levKeyTemp = levKey4;
          }
          return (
            <div
              key={Math.random()}
              style={{width: arrPercWidth[i] + '%', top: 0, left: arrPercLeft[i] + '%', position: 'absolute'}}
              className={[styles.gx, sSize, styles['gLev' + props.lev], styles['grid' + firstValuePerc]].join(' ')}>
              <span>
              {utils.numberWithCommas(props.data[levKeyTemp])}
              </span>
            </div>
          );
        })
      }
      {
        arrValues.map((d, i) => {
          let levKey = d.key;
          let percWidthCalc = ((100 - firstValuePerc) / arrValues.length);
          let percLeftCalc = ((100 - firstValuePerc) / arrValues.length) * i + firstValuePerc;

          //** exception for declared potential
          let v = props.data[levKey];
          if (levKey === props.metadata.o.territory_declared_potential.key) {
            if (v > 10000) {
              v = '> 10K';
            }
          }
          return (
            <div
              data-iter={props.iter}
              key={Math.random()}
              style={{width: percWidthCalc + '%', top: 0, left: percLeftCalc + '%'}}
              className={[styles.gx, sSize, styles.gValues].join(' ')}>
              <span>
              {utils.numberWithCommas(v)}
              </span>
            </div>
          );
        })
      }

    </div>
  );
};
