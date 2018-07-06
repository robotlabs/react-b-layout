line chart instructions.

*Hot to use*
======
instantiate like that
```
this.chart = new D3LineChart({
  type: 'line',
  margins: {top: 20, right: 30, bottom: 40, left: 30},
  styles: styles,
  node: this.node,
  onClick: onClick,
  hideAxes: false,
  showGrid: {
    x: true, //comment if you don't want grid
    y: true
  },
  dots: { // these will be render when data are available
    r: 4.5
  },
  dotFollower: { // in case you want a dot following the mouse
     r: 12,
     fill: false
  },
  areaFilled: true, // in case you decide to fill the area
  typeCurve: d3.curveCardinal, // type of line curve
  data: { // array of data, for multiple chart. if more than one line, areaFilled must be false, for obvious horrible results
    dataset: [
      {
        data: data1,
        lineColor: '#ff0099'
      }
      {
         data: data2,
         lineColor: '#ffdd00'
       }
    ],
    xParam: 'timestamp',
    yParam: 'downloads'
  },
  timeseries: { // in case data need to be parsed as date
    dateTickFormat: '%m-%d'
  },
  tooltipParams: { // tool tip params
    offsety: -10,
    offsetx: 0,
    copybase: 'd: '
  },
  rotateText: {
    y: true
  }
});
function onClick(node) {
  var cc = d3.select(node);
}
```

*line chart style*
=======
```
.lineStyle {
  fill: none;
  stroke-width: 2px;
}
.areaStyle {
  fill: lightsteelblue;
}

.grid line {
  stroke: white;
  stroke-opacity: 0.2;
  shape-rendering: crispEdges;
}

.grid path {
  stroke-width: 0;
}

.point {
  /* fill: yellow; */
  cursor: pointer;
  opacity: .6;
}
.point:hover {
  fill: red;
}

.followerCircles{
  /* fill: green !important; */
  /* stroke: #ff0099; */
  opacity: .9;
}
.followerLine{
  stroke: white;
  stroke-width: 1.2px;
  opacity: .5
}


.d3tip{
  line-height: 1;
  padding: 6px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  border-radius: 4px;
  font-size: 12px;
}
.d3tip:after {
  box-sizing: border-box;
  display: inline;
  font-size: 10px;
  width: 100%;
  line-height: 1;
  color: rgba(0, 0, 0, 0.8);
  content: "\25BC";
  position: absolute;
  text-align: center;
  left: 0;
  top: 90%;
}
/*axis styles */
.axisStyle line{
  stroke: white;
}

.axisStyle path{
  stroke: white;
}

.axisStyle text{
  fill: white;
}

```

*data structure example*
=======
```
[
  {
          "timestamp": "2017-12-05T00:00:00",
          "downloads": 11
      },
      {
          "timestamp": "2017-12-11T00:00:00",
          "downloads": 10
      },
      {
          "timestamp": "2017-12-12T00:00:00",
          "downloads": 23
      },
      {
          "timestamp": "2017-12-13T00:00:00",
          "downloads": 80
      }
]
```
