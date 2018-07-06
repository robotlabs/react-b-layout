import React from 'react';
import styles from './style.css';

export const TabellaHeader2 = (props) => {
  let firstValuePerc = props.firstValuePerc;
  let levLabel = props.arrLevels[props.lev - 1].label;
  let arrValues = props.arrValues;
  let arrLevels = props.arrLevels;
  let sColor = styles.gColorHeader;
  let sx = styles.gx;
  if (props.lev > 1) {
    sx = styles.gxSmall;
    levLabel = props.arrLevels[props.arrLevels.length - 1].label;
  }
  let arrPercLeft = [15, 30, 40];
  let arrPercWidth = [15, 15, 10];
  let arrLevelsPure = [];
  for (let i = 0; i < arrLevels.length - 1; i++) {
    if (i > 0) {
      arrLevelsPure.push(arrLevels[i]);
    }
  }

  return (
    <div
      className={styles.container}>
      <div
        key={Math.random()}
        style={{left: 0 + '%'}}
        className={[sColor, sx, styles['gLev' + props.lev], styles['grid' + firstValuePerc]].join(' ')}>
        <span>
        {levLabel}
        </span>
      </div>

      {
        arrLevelsPure.map((d, i) => {
          let levLabel = d.label;
          let s = styles.gValues;
          if (props.lev > 1) {
            levLabel = '';
            s = styles.gValuesNoBorder;
          }
          return (
            <div
              key={Math.random()}
              style={{width: arrPercWidth[i] + '%', top: 0, left: arrPercLeft[i] + '%', position: 'absolute'}}
              className={[sColor, sx, styles['gLev' + props.lev], styles['grid' + firstValuePerc]].join(' ')}>
              <span>
              {levLabel}
              </span>
            </div>
          );
        })
      }
      {
        arrValues.map((d, i) => {
          let levLabel = d.label;
          let percWidthCalc = ((100 - firstValuePerc) / arrValues.length);
          let percLeftCalc = ((100 - firstValuePerc) / arrValues.length) * i + firstValuePerc;
          let s = styles.gValues;
          if (props.lev > 1) {
            levLabel = '';
            s = styles.gValuesNoBorder;
          }
          return (
            <div
              key={Math.random()}
              style={{width: percWidthCalc + '%', top: 0, left: percLeftCalc + '%'}}
              className={[sColor, styles.gx, s].join(' ')}>
              <span>
              {levLabel}
              </span>
            </div>
          );
        })
      }

    </div>
  );
};
