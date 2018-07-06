import React, {Component} from 'react';
import Tabella from './tabella/tabella.js';

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
    return (
      <div
      ref={(element) => {
        this.node = element;
      }}>
      <Tabella
        metadata={this.props.metadata}
        arrLevels={this.props.arrLevels}
        arrValues={this.props.arrValues}
        arrGrouped={this.props.arrGrouped}
        type={this.props.type}
        clickable={this.props.clickable}
        data={this.superParsedResults}>
      </Tabella>

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
  let groupKey2 = scope.props.arrGrouped[1];
  let groupKey3 = scope.props.arrGrouped[2];
  let groupKey4 = scope.props.arrGrouped[3];
  let superDict = {};
  superDict.list = {};
  superDict.arrList = [];
  let calcValue = calcValuesObj['calcValues' + type];
  d3.nest()
  .key((d) => {
    if (d[groupKey] === 'Auto Center') {
      return 'Tyre Specialist';
    }
    return d[groupKey];
  })
  .rollup((d) => {
    let dLev0Value = d[0][groupKey];
    superDict.list[dLev0Value] = {};
    superDict.list[dLev0Value].list = [];
    superDict.list[dLev0Value].arrList = [];
    d3.nest()
      .key((d) => {
        return d[groupKey2];
      })
      .rollup((d) => {
        let globals = calcValue(d, groupKey2);
        superDict.list[dLev0Value].list[d[0][groupKey2]] = {};
        superDict.list[dLev0Value].list[d[0][groupKey2]].list = [];
        superDict.list[dLev0Value].list[d[0][groupKey2]].arrList = [];
        superDict.list[dLev0Value].list[d[0][groupKey2]].globals = globals;
        superDict.list[dLev0Value].arrList.push(globals);

        //*********
        //** THIRD LEVEL
        d3.nest()
          .key((d) => {
            return d[groupKey3];
          })
          .rollup((d) => {
            let globals = calcValue(d, groupKey3);
            superDict.list[dLev0Value].list[d[0][groupKey2]].list[d[0][groupKey3]] = {};
            superDict.list[dLev0Value].list[d[0][groupKey2]].list[d[0][groupKey3]].list = [];
            superDict.list[dLev0Value].list[d[0][groupKey2]].list[d[0][groupKey3]].arrList = [];
            superDict.list[dLev0Value].list[d[0][groupKey2]].list[d[0][groupKey3]].globals = globals;
            superDict.list[dLev0Value].list[d[0][groupKey2]].arrList.push(globals);
            //***********
            //** 4TH LEVEL
            d3.nest()
              .key((d) => {
                return d[groupKey4];
              })
              .rollup((d) => {
                let globals = d[0];
                let indirectVolumes = globals[mdo.territory_indirect_volumes.key];
                if (indirectVolumes && indirectVolumes === 'N/A') {
                  globals[mdo.territory_indirect_volumes.key] = 0;
                }
                superDict.list[dLev0Value].list[d[0][groupKey2]].list[d[0][groupKey3]].list[d[0][groupKey4]] = {};
                superDict.list[dLev0Value].list[d[0][groupKey2]].list[d[0][groupKey3]].list[d[0][groupKey4]].list = [];
                superDict.list[dLev0Value].list[d[0][groupKey2]].list[d[0][groupKey3]].list[d[0][groupKey4]].arrList = [];
                superDict.list[dLev0Value].list[d[0][groupKey2]].list[d[0][groupKey3]].list[d[0][groupKey4]].globals = globals;
                for (let i = 0; i < d.length; i++) {
                  let indirectVolumes = d[i][mdo.territory_indirect_volumes.key];
                  let directVolumes = d[i][mdo.territory_direct_volumes.key];
                  // console.log('++ indirectVolumes ', indirectVolumes);
                  if (indirectVolumes && indirectVolumes === 'N/A') {
                    d[i][mdo.territory_indirect_volumes.key] = 0;
                  }
                  if (directVolumes && directVolumes === 'N/A') {
                    d[i][mdo.territory_direct_volumes.key] = 0;
                  }
                  // if (d[i].subtipology === 'BMW') {
                  //   // console.log('XXXXXX', d[i]);
                  // }
                  superDict.list[dLev0Value].list[d[0][groupKey2]].list[d[0][groupKey3]].arrList.push(d[i]);
                }
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

  for (let brand in superDict.list) {
    if (superDict.list[brand].globals[groupKey] !== 'N/A') {
      superDict.arrList.push({...superDict.list[brand].globals});
    }
  }
  if (superDict.list['N/A']) {
    delete superDict.list['N/A'];
  }

  //** remove 0 lines
  superDict.arrList = verifyZeroLine(superDict.arrList, superDict.list, scope, 0);
  for (let m in superDict.list) {
    let mm = superDict.list[m];
    mm.arrList = verifyZeroLine(mm.arrList, mm.list, scope, 1);
    for (let x in mm.list) {
      let xx = mm.list[x];
      xx.arrList = verifyZeroLine(xx.arrList, xx.list, scope, 2, x);
      for (let y in xx.list) {
        let yy = xx.list[y];
        yy.arrList = verifyZeroLine(yy.arrList, yy.list, scope, 3, y);
      }
    }
  }

  //** ordering ;
  //** lev 1
  superDict.arrList = superDict.arrList.sort((x, y) => {
    return d3.ascending(Number(y[orderKey]), Number(x[orderKey]));
  });

  //** lev 2
  for (let brand in superDict.list) {
    let brandObj = superDict.list[brand];
    let arrList = brandObj.arrList;
    arrList = reorder(arrList);

    //** lev 3
    for (let nameplate in brandObj.list) {
      let nameplateObj = brandObj.list[nameplate];
      let arrList = nameplateObj.arrList;
      arrList = reorder(arrList);

      //** lev 4
      for (let program in nameplateObj.list) {
        let programObj = nameplateObj.list[program];
        let arrList = programObj.arrList;
        arrList = reorder(arrList);
      }
    }
  }
  console.log('superDict ', superDict);
  return superDict;
};

const reorder = (arr) => {
  return arr = arr.sort((x, y) => {
    return d3.ascending(Number(y[orderKey]), Number(x[orderKey]));
  });
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

//** calc values
const calcValuesTerritory = (d, groupKey) => {
  let declaredPotential = 'N/A';
  let directVolumes = 'N/A';
  let indirectVolumes = 0;
  for (let i = 0; i < d.length; i++) {
      //** #vehicles
    let dDeclaredPotential = d[i][mdo.territory_declared_potential.key];
    if (!isNaN(dDeclaredPotential)) {
      if (declaredPotential === 'N/A') {
        declaredPotential = 0;
      }
      declaredPotential += Number(dDeclaredPotential);
    }

      //** total potential
    let dDirectVolumes = d[i][mdo.territory_direct_volumes.key];
    if (!isNaN(dDirectVolumes)) {
      if (directVolumes === 'N/A') {
        directVolumes = 0;
      }
      directVolumes += Number(dDirectVolumes);
    }

    //** Summer Pullthrough
    let dIndirectVolumes = d[i][mdo.territory_indirect_volumes.key];
    if (!isNaN(dIndirectVolumes)) {
      if (indirectVolumes === 'N/A') {
        indirectVolumes = 0;
      }
      indirectVolumes += Number(dIndirectVolumes);
    }
  }

  if (directVolumes === 'N/A') {
    directVolumes = 0;
  }
  if (indirectVolumes === 'N/A') {
    indirectVolumes = 0;
  }

  let objReturn = {
    [mdo.territory_declared_potential.key]: declaredPotential,
    [mdo.territory_direct_volumes.key]: directVolumes,
    [mdo.territory_indirect_volumes.key]: indirectVolumes
  };
  objReturn[groupKey] = d[0][groupKey];
  return objReturn;
};

const calcValuesObj = {
  calcValuesTerritory: calcValuesTerritory,
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
      delete list[g[scope.arrGrouped[groupedIter]]];
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
