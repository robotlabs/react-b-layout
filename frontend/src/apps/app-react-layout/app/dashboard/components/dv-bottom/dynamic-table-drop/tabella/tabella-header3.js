import React from 'react';
import styles from './style.css';

export const TabellaHeader3 = (props) => {
  let firstValuePerc = props.firstValuePerc;
  // let levLabel = props.arrLevels[props.lev - 1].label;
  let arrValues = props.arrValues;
  let arrLevels = props.arrLevels;
  let sColor = styles.gColorHeader;
  let sx = styles.gx;

  let arrPercLeft = [15, 30, 40];
  let arrPercWidth = [15, 15, 10];
  let arrLevelsPure = [];
  let arrValuesPure = [];

  for (let i = 0; i < arrValues.length - 1; i++) {
    if (i > 0) {
      arrValuesPure.push(arrValues[i]);
    }
  }

  return (
    <div
      className={styles.container}>
      <div
        key={Math.random()}
        style={{left: 0 + '%'}}
        className={[sColor, sx].join(' ')}>
        <span>
        {}
        </span>
      </div>
      {
        arrValues.map((d, i) => {
          let levLabel = d.label;
          let s = styles.gValues;
          if (props.lev > 1) {
            levLabel = '';
            s = styles.gValuesNoBorder;
          }
          return (
            <div
              key={Math.random()}
              style={{width: props.arrPercW[i] + '%', top: 0, left: props.arrPercL[i] + '%'}}
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
