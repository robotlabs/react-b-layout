import React, {Component} from 'react';
import Tabella3 from './tabella/tabella3.js';

//** api params;
let mdo;

let orderKey;
class DynamicTable3 extends Component {
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
    this.superParsedResults = superParse(this.props.data, this);
    if (!this.props.showAll && this.props.type !== 'landkreis-list') {
      this.superParsedResults.arrList = this.superParsedResults.arrList.slice(0, 20);
    }
    return (
      <div
      ref={(element) => {
        this.node = element;
      }}>
      <Tabella3
        arrLevels={this.props.arrLevels}
        arrValues={this.props.arrValues}
        arrGrouped={this.props.arrGrouped}
        type={this.props.type}
        headerSize={this.props.headerSize}
        arrPercW={this.props.arrPercW}
        mdo={mdo}
        hoverRow={this.props.hoverRow}
        outRow={this.props.outRow}
        clickRow={this.props.clickRow}
        clickable={this.props.clickable}
        data={this.superParsedResults}>
      </Tabella3>

      </div>
    );
  }

  superRenderTables() {
    let arrComponents = [1, 2, 3];
    return arrComponents;
  }
};

//** super parse
const superParse = (data, scope) => {
  let superDict = {};
  superDict.arrList = data;

  superDict.arrList = superDict.arrList.sort((x, y) => {
    return d3.ascending(Number(y[orderKey]), Number(x[orderKey]));
  });

  return superDict;
};

export default DynamicTable3;
