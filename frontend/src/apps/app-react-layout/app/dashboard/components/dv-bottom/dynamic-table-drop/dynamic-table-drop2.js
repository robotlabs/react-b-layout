import React, {Component} from 'react';
import Tabella2 from './tabella/tabella2.js';

//** api params;
let mdo;

let orderKey;
class DynamicTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 0
    };
    this.onClick = this.onClick.bind(this);
    this.superParsedResults;
    this.arrGrouped;
  }
  componentWillUnmount() {
  }
  componentDidMount() {}

  onClick(e) {}
  componentWillReceiveProps(nextProps) {
    this.setState({
      status: nextProps.status
    });
  }
  render() {
    this.arrValues = this.props.arrValues;
    mdo = this.props.metadata.o;
    orderKey = this.props.orderKey;
    this.arrGrouped = this.props.arrGrouped;
    this.superParsedResults = superParse(this.props.data, this.props.type, this);
    if (!this.props.showAll) {
      this.superParsedResults.arrList = this.superParsedResults.arrList.slice(0, 20);
    }
    let parsedRenderArr = [];
    for (let value in this.superParsedResults) {
      parsedRenderArr.push(this.superParsedResults[value].globals);
    }
    let renderArrChildren = [];
    for (let i = 0; i < parsedRenderArr.length; i++) {
      renderArrChildren.push(parsedRenderArr[i]);
      renderArrChildren.push({
        empty: true
      });
    }
    return (
      <div
      ref={(element) => {
        this.node = element;
      }}>
      <Tabella2
        metadata={this.props.metadata}
        arrLevels={this.props.arrLevels}
        arrValues={this.props.arrValues}
        arrGrouped={this.props.arrGrouped}
        type={this.props.type}
        headerSize={this.props.headerSize}
        clickable={this.props.clickable}
        data={this.superParsedResults}>
      </Tabella2>

      </div>
    );
  }

  superRenderTables() {
    let arrComponents = [1, 2, 3];
    return arrComponents;
  }
};

//** super parse
const superParse = (data, type, scope) => {
  let groupKey = scope.props.arrGrouped[0];
  // let groupKey = ap.brand.key;
  let groupKey2 = scope.props.arrGrouped[1];
  let groupKey3 = scope.props.arrGrouped[2];//ap.program.key;
  let groupKey4 = scope.props.arrGrouped[3];//ap.rim.key;
  let groupKey5 = scope.props.arrGrouped[4];//ap.rim.key;
  let superDict = {};
  superDict.list = {};
  superDict.arrList = [];
  let calcValue = calcValuesObj['calcValues' + type];
  d3.nest()
  .key((d) => {
    return d[groupKey];
  })
  .rollup((d) => {
    superDict.list[d[0][groupKey]] = {};
    superDict.list[d[0][groupKey]].list = [];
    superDict.list[d[0][groupKey]].arrList = [];
    d3.nest()
      .key((d) => {
        return d[groupKey2];
      })
      .rollup((d) => {
        let dd1 = d[0][groupKey];
        let globals = calcValue(d, groupKey2);
        //*********
        //** THIRD LEVEL
        d3.nest()
          .key((d) => {
            return d[groupKey3];
          })
          .rollup((d) => {
            let dd2 = d[0][groupKey2];
            let globals = calcValue(d, groupKey3);

            //***********
            //** 4TH LEVEL
            d3.nest()
              .key((d) => {
                return d[groupKey4];
              })
              .rollup((d) => {
                let dd3 = d[0][groupKey3];
                let globals = calcValue(d, groupKey4);

                globals[groupKey] = dd1;
                globals[groupKey2] = dd2;
                globals[groupKey3] = dd3;
                if (globals[groupKey] !== 'N/A') {
                  superDict.arrList.push(globals);
                }
                superDict.list[String(dd1) + String(dd2) + String(dd3) + String(d[0][groupKey4])] = [];
                d3.nest()
                  .key((d) => {
                    return d[groupKey5];
                  })
                  .rollup((d) => {
                    let globals = calcValue(d, groupKey5);
                    for (let i = 0; i < d.length; i++) {
                      globals[groupKey4] = d[i][groupKey4];
                      let totals = {...d[i]};
                      totals[groupKey] = dd1;
                      totals[groupKey2] = dd2;
                      totals[groupKey3] = dd3;
                      superDict.list[String(dd1) + String(dd2) + String(dd3) + String(d[0][groupKey4])].push(totals);
                    }
                    return globals;
                  })
                  .entries(d);
                return globals;
              })
              .entries(d);
            return globals;
          })
          .entries(d);
          //*****
        return globals;
      })
      .entries(d);
    let globals = calcValue(d, groupKey);
    superDict.list[d[0][groupKey]].globals = globals;
    return globals;
  })
  .entries(data);

  for (let m in superDict.list) {
    let mm = superDict.list[m];
    if (!mm.arrList) {
      superDict.list[m] = verifyZeroLine(mm, mm.list, scope, 1);
    }
  }

  //** remove 0 lines
  superDict.arrList = verifyZeroLine(superDict.arrList, superDict.list, scope, 0);
  // for (let m in superDict.list) {
  //   let mm = superDict.list[m];
  //   mm.arrList = verifyZeroLine(mm.arrList, mm.list, scope, 1);
  //   for (let x in mm.list) {
  //     let xx = mm.list[x];
  //     xx.arrList = verifyZeroLine(xx.arrList, xx.list, scope, 2, x);
  //     for (let y in xx.list) {
  //       let yy = xx.list[y];
  //       yy.arrList = verifyZeroLine(yy.arrList, yy.list, scope, 3, y);
  //     }
  //   }
  // }

  //** ordering ;
  //** lev 1
  superDict.arrList = superDict.arrList.sort((x, y) => {
    return d3.ascending(Number(y[mdo.gap.key]), Number(x[mdo.gap.key]));
  });
  return superDict;
};

//** calc values
const calcValuesCarParc = (d, groupKey) => {
  let vehicles = 'N/A';
  let totalPotential = 'N/A';
  let summerPull = 'N/A';
  let pirelliVolumes = 'N/A';
  let gapSummer = 'N/A';
  for (let i = 0; i < d.length; i++) {
      //** #vehicles
    let dVehicles = d[i][mdo.vehicles_count.key];
    if (!isNaN(dVehicles)) {
      if (vehicles === 'N/A') {
        vehicles = 0;
      }
      vehicles += Number(dVehicles);
    }

      //** total potential
    let dTotalPotential = d[i][mdo.tyre_potential.key];
    if (!isNaN(dTotalPotential)) {
      if (totalPotential === 'N/A') {
        totalPotential = 0;
      }
      totalPotential += Number(dTotalPotential);
    }

    //** Summer Pullthrough
    let spt = d[i][mdo.pullthrough_potential.key];
    if (!isNaN(spt)) {
      if (summerPull === 'N/A') {
        summerPull = 0;
      }
      summerPull += Number(spt);
    }

    let dPirelliVolumes = d[i][mdo.pirelli_volumes.key];
    if (!isNaN(dPirelliVolumes)) {
      if (pirelliVolumes === 'N/A') {
        pirelliVolumes = 0;
      }
      pirelliVolumes += Number(dPirelliVolumes);
    }
  }
  if (pirelliVolumes !== 'N/A' && summerPull !== 'N/A') {
    gapSummer = summerPull - pirelliVolumes;
  } else {
    if (summerPull !== 'N/A') {
      gapSummer = summerPull;
    }
  }

  if (gapSummer < 0) {
    gapSummer = 0;
  }

  let objReturn = {
    [mdo.vehicles_count.key]: vehicles,
    [mdo.tyre_potential.key]: totalPotential,
    [mdo.pullthrough_potential.key]: summerPull,
    [mdo.pirelli_volumes.key]: pirelliVolumes,
    [mdo.gap.key]: gapSummer
  };
  objReturn[groupKey] = d[0][groupKey];
  return objReturn;
};

const calcValuesObj = {
  calcValuesCarParc: calcValuesCarParc
};
const verifyZeroLine = (arrList, list, scope, groupedIter, test) => {
  let tempArrList = [];
  for (let i = 0; i < arrList.length; i++) {
    let g = arrList[i];
    let isV0 = false;
  //  for (let v in g) {
    for (let i = 0; i < scope.arrValues.length; i++) {

      let v = scope.arrValues[i].key;
      let vv = Math.floor(g[v]);
      if (vv !== 0) {
        if (isNumeric(vv)) {
          isV0 = true;
        }
      }
    }
    if (!isV0) {
      if (list) {
        delete list[g[scope.arrGrouped[groupedIter]]];
      }

    } else {
      tempArrList.push(arrList[i]);
    }
  }
  return tempArrList;
};
const isNumeric = (n) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};
export default DynamicTable;
