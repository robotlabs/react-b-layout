import React from 'react';
import styles from './style.css';

export const TabellaHeader = (props) => {
  let firstValuePerc = props.firstValuePerc;
  let levLabel = props.arrLevels[props.lev - 1].label;
  let levLabel2 = props.arrLevels[props.lev].label;
  let arrValues = props.arrValues;
  let sColor = styles.gColorHeader;
  let sx = styles.gx;
  if (props.lev > 1) {
    sx = styles.gxSmall;
  }
  let moreBrand;
  if (props.lev === 4) {
    moreBrand = (
      <div
        key={Math.random()}
        style={{left: 15 + '%', top: 0, width: '25%', position: 'absolute'}}

        className={[sColor, sx, styles['gLev' + props.lev], styles['grid' + firstValuePerc]].join(' ')}>
        <span>
        {levLabel2}
        </span>
      </div>
    );
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
      {moreBrand}
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
