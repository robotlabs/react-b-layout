import D3Chart from './../d3-chart.js';
class D3BarChart extends D3Chart {
  createScales() {
    let p = .1;
    if (this.ss.padding) {
      p = this.ss.padding;
    }
    //** define scales. scaleband as it is a bar chart. linear for y
    this.x = d3.scaleBand()
              .rangeRound([0, 10])
              .padding(p);
    this.y = d3.scaleLinear()
              .range([10, 0]);
  }
  renderChart(data, speed) {
    //** animation values
    var d = 1000;
    if (Number(speed + 1)) {
      d = speed;
    }
    // d = 0;
    let easeExp = d3.easeExp;
    let easeCubic = d3.easeCubic;
    //** update domains
    this.x.domain(data.map(function(d) {
      return d.xValue;
    }));
    this.y.domain([0, d3.max(data, function(d) {
      return d.yValue;
    })]);

    //** set bars datum
    var bars = this.g.selectAll('rect')
      .data(data, function(d) {
        return d.yValue;
      });

    //** REMOVE
    bars.exit()
      .transition()
        .ease(easeExp)
        .duration(d / 2)
      .attr('height', 0)
      .attr('y', (d) => {
        return (this.h);
      })
      .remove();

    //** UPDATE
    bars

      .transition()
        .ease(easeCubic)
        .duration(d)
      .attr('x', (d) => {
        return this.x(d.xValue);
      })
      .attr('width', this.x.bandwidth())
      .attr('y', (d) => {
        if (this.nullHeight) {
          return this.h;
        }
        return this.y(d.yValue);
      })
      .attr('height', (d) => {
        if (this.nullHeight) {
          return 0;
        }
        return this.h - this.y(d.yValue);
      });

    //** ADD
    bars
      .enter().append('rect')
      .attr('class', this.ss.styles.bar)
      .on('mouseover', (d, i, nodes) => {
        if (this.toolTip) {
          this.toolTip.show(d, nodes[i]);
        }
      })
      .on('mouseout', (d, i, nodes) => {
        if (this.toolTip) {
          this.toolTip.hide();
        }
      })
      .on('click', (d, i, nodes) => {
        if (this.ss.onClick) {
          this.ss.onClick(nodes[i]);
        }
      })
      .attr('height', (d) => {
        return 0;
      })
      .attr('y', (d) => {
        return (this.h);
      })
      .attr('x', (d) => {
        return this.x(d.xValue);
      })
      .transition()
        .ease(easeCubic)
        .duration(d)
      .attr('width', this.x.bandwidth())
      .attr('y', (d) => {
        return this.y(d.yValue);
      })
      .attr('height', (d) => {
        return this.h - this.y(d.yValue);
      });
    if (!this.ss.hideAxes) {
      this.updateAxis(this.w, this.h);
    }
  }
  open() {
    //** be sure bars are closed on height
    this.nullHeight = true;
    this.renderChart(this.dataStore, 0);
    //** and then open it with a small delay
    setTimeout(() => {
      this.nullHeight = false;
      this.renderChart(this.dataStore, 1000);
    }, 400);

  }
  close() {
    this.nullHeight = true;
    this.renderChart(this.dataStore, 0);
  }
  //** parse array data. convert date if needed
  parseData(dataset) {
    let parsedData = [];
    for (let i = 0; i < dataset.length; i++) {
      let xx;
      if (this.ss.timeseries && this.ss.timeseries.active) {
        xx = (d3.isoParse(dataset[i][this.ss.data.xParam])) ? d3.isoParse(dataset[i][this.ss.data.xParam]) : dataset[i][this.ss.data.xParam];
      } else {
        xx = dataset[i][this.ss.data.xParam];
      }
      var a = {
        xValue: xx,
        yValue: dataset[i][this.ss.data.yParam]
      };
      parsedData.push(a);
    }
    return parsedData;
  }
}
export default D3BarChart;
