import React from 'react';
import styles from './style.css';
import utils from './../../../utils.js';

export const TabellaRow = (props) => {
  let firstValuePerc = props.firstValuePerc;
  let levKey = props.arrLevels[props.lev - 1].key;
  let levKey2 = props.arrLevels[props.lev].key;
  let arrValues = props.arrValues;
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
    sColor = styles.gColor2A;
    if (props.iter % 2) {
      sColor = styles.gColor2B;
    }
  }
  if (props.lev === 3) {
    sColor = styles.gColor3A;
    if (props.iter % 2) {
      sColor = styles.gColor3B;
    }

  }

  if (props.lev === 4) {
    sColor = styles.gColorBlack;
    if (props.type === 'Territory') {
      sSize = styles.gSuperSize;
    }

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
      <div
        key={Math.random()}
        style={{left: 15 + '%', top: 0, width: '25%', position: 'absolute'}}

        className={[styles.gx, sSize, styles['gLev' + props.lev], styles['grid' + firstValuePerc]].join(' ')}>
        <span>
        {props.data[levKey2]}
        </span>
      </div>
      {
        arrValues.map((d, i) => {
          let levKey = d.key;
          let v = props.data[levKey];
          //** exception for declared potential
          if (levKey === props.metadata.o.territory_declared_potential.key) {
            if (v > 10000) {
              v = '> 10K';
            }
          }
          let percWidthCalc = ((100 - firstValuePerc) / arrValues.length);
          let percLeftCalc = ((100 - firstValuePerc) / arrValues.length) * i + firstValuePerc;
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
