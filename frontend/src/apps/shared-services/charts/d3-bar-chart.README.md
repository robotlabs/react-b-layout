bar chart instructions.

*Hot to use*
======
instantiate like that
```
this.chart = new D3Chart({
  margins: {top: 20, right: 30, bottom: 20, left: 30},
  styles: styles, // pass styles to bar chart
  node: this.node,
  barClick: barClick, // optional click
  hideAxes: true, //in case you want to hide axes
  padding: .4, // distance between bar. default is .1 if not set
  data: { // see below a date example
    dataset: data1,
    xParam: 'timestamp',
    yParam: 'downloads'
  },
  timeseries: { //will tell the chart to parse data as date
    active: true,
    dateTickFormat: '%y-%m-%d'
  },
  tooltipParams: { // tool tip settings
    offsety: -10,
    offsetx: 0,
    copybase: 'd: '
  }
});
function barClick(node) {
  var cc = d3.select(node);
}
```

*simple bar chart style*
=======
bar charts
```
.bar {
  fill: #ffdd00;
  cursor: pointer;
}
.bar:hover{
  fill: #ff0099;
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
