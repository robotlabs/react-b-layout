import React from 'react';
import styles from './style.css';
import utils from './../../../utils.js';

export const TabellaRow3 = (props) => {
  let arrValues = props.arrValues;
  let sSize = styles.gSize;
  let iter = props.iter;
  let iterFather = props.iterFather;
  let iterGranFather = props.iterGranFather;
  let sColor = styles.gColorA;
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
        </span>
      </div>
      {
        arrValues.map((d, i) => {
          let levKey = d.key;
          let value = utils.numberWithCommas(props.data[levKey]);
          if (levKey === props.mdo.market_share.key) {
            value = value + '%';
          }
          //** exception for declared potential
          let v = props.data[levKey];
          if (levKey === props.mdo.territory_declared_potential.key) {
            if (v > 10000) {
              v = '> 10K';
            }
          }
          return (
            <div
              onClick={props.clickRow}
              onMouseEnter={props.hoverRow}
              onMouseLeave={props.outRow}
              data-iter={props.iter}
              key={Math.random()}
              style={{width: props.arrPercW[i] + '%', top: 0, left: props.arrPercL[i] + '%'}}
              className={[styles.gx, sSize, styles.gValues].join(' ')}>
              <span>
              {value}
              </span>
            </div>
          );
        })
      }

    </div>
  );
};
