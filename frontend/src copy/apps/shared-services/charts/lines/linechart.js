import D3Chart from './../d3-chart.js';
class D3LineChart extends D3Chart {
  constructor(settings) {
    super(settings);
    //** if type of curve is not set, just set the default
    if (!settings.typeCurve) {
      this.ss.typeCurve = d3.curveLinear;
    }
    //** animation duration
    this.d = 900;

    //** dot follower works only with timeseries, and if settings are defined
    if (this.ss.dotFollower && this.ss.timeseries) {
      //** line to follow the mouse
      this.line = this.svg.append('line')
        .attr('class', this.ss.styles.followerLine)
        .classed('x', true)
        .attr('display', 'none');
      //** action called on mouse move
      this.svg
        .on('mousemove', this.onMouseMove.bind(this));
    }
  }

  createScales() {
    //** define scales. scalePoint as it is a discreet domain, or timescale if timeseries is active
    if (!this.ss.timeseries) {
      this.x = d3.scalePoint();
      this.y = d3.scaleLinear();
    } else {
      this.x = d3.scaleTime();
      this.y = d3.scaleLinear();
    }
  }

  renderChart(data) {
    //** min and max of merged arrays
    let yMinMax = this.getMinMax(data);

    //** parse data to get only x axis values
    let datax = this.getxAxisValues(data);
    if (this.ss.timeseries) {
      //TODO ORDER RESULTS
    }

    //** update domains
    if (!this.ss.timeseries) {
      this.x.domain(datax);
    } else {
      this.x
        .domain(d3.extent(datax, (d) => {
          return d;
        }));
    }
    this.y.domain([
      yMinMax.min,
      yMinMax.max
    ]);

    //** create path containers
    for (let i = 0; i < this.ss.data.dataset.length; i++) {
      // if (!this.ss.data.dataset[i]) {
      //   return;
      // }
      if (!this['path' + i]) {
        this['path' + i] = this.svg.append('path');
        this['path' + i].activeOpacity = 1;
        this['path' + i]
        .attr('transform',
              'translate(' + this.ss.margins.left + ',' + this.ss.margins.top + ')');

        //** if we opt for a filled area chart
        if (this.ss.areaFilled) {
          this['pathArea' + i] = this.svg.append('path');
          this['pathArea' + i]
          .attr('transform',
                'translate(' + this.ss.margins.left + ',' + this.ss.margins.top + ')');
        }
      }
      //** if we want to add a mouse dot follower
      if (this.ss.dotFollower) {
        if (!this['circle' + i]) {
          this['circle' + i]
            = this.svg.append('circle')
              .attr('r', this.ss.dotFollower.r)
              .style('stroke', (d) => {
                return this.ss.data.dataset[i].lineColor;
              })
              .style('fill', 'none')
              .attr('class', this.ss.styles.followerCircles)
              .attr('display', 'none');

          if (this.ss.dotFollower.fill) {
            this['circle' + i]
              .style('fill', this.ss.data.dataset[i].lineColor);
          }
        }
      }

      //** render single lines
      this.renderLineChart(data[i], i);
      this.datarr = data[0];
    }

    //** oh, and when you have done, update axis with updated domains
    if (!this.ss.hideAxes) {
      this.updateAxis(this.w, this.h);
    }
  }

  //** render single line
  renderLineChart(data, lineIter, min, max) {
    //** animation values
    let t = d3.transition()
            .duration(this.d);

    //** create line values
    this.valueline = d3.line()
        .curve(this.ss.typeCurve)
        .x((d) => {
          return this.x(d.xValue);
        })
        .y((d) => {
          return this.y(d.yValue);
        });

    //** get corrected path container, and apply valueline corresponding
    this['path' + lineIter]
        .data([data])
        .attr('class', this.ss.styles.lineStyle)
        .style('stroke', (d, i) => {
          return this.ss.data.dataset[lineIter].lineColor;
        })
        .transition(t)
        .attr('d', this.valueline);

    if (this.ss.areaFilled) {
      // define the area
      this.area = d3.area()
      .curve(this.ss.typeCurve)
      .x((d) => {
        return this.x(d.xValue);
      })
      .y0(this.h)
      .y1((d) => {
        return this.y(d.yValue);
      });
      this['pathArea' + lineIter]
            .data([data])
            .attr('class', this.ss.styles.areaStyle)
            .attr('opacity', .4)
            .transition(t)
            .attr('d', this.area);

      if (this.ss.areaFilled.gradient) {
        this.svg.append('linearGradient')
          .attr('id', 'area-gradient')
          .attr('gradientUnits', 'userSpaceOnUse')
          .attr('x1', 0).attr('y1', '100%')
          .attr('x2', 0).attr('y2', '0%')
        .selectAll('stop')
          .data([
            {offset: '0%', color: '', opacity: 0},
            {offset: '180%', color: this.ss.data.dataset[lineIter].lineColor, opacity: 1}
          ])
        .enter().append('stop')
          .attr('offset', function(d) {
            return d.offset;
          })
          .attr('stop-color', function(d) {
            return d.color;
          })
          .attr('stop-opacity', (d) => {
            return d.opacity;
          });

        this['pathArea' + lineIter]
            .style('fill', 'url(#area-gradient)');
      } else {
        this['pathArea' + lineIter]
          .style('fill', (d, i) => {
            return this.ss.data.dataset[lineIter].lineColor;
          });
      }
    }

    //** are we showing the dots? if yes updateDots
    if (this.ss.dots) {
      this.updateDots(data, lineIter);
    }
  }
  //** in case we decided to render dots
  updateDots(data, lineIter) {
    let easeExp = d3.easeExp;
    let easeCubic = d3.easeCubic;
    if (!this['g' + lineIter]) {
      this['g' + lineIter] = this.svg.append('g');
      this['g' + lineIter]
        .attr('transform',
              'translate(' + this.ss.margins.left + ',' + this.ss.margins.top + ')');
    }
    let bars = this['g' + lineIter].selectAll('circle')
      .data(data, function(d) {
        return (d.xValue + d.yValue);
      });

    //** REMOVE DOTS
    bars.exit()
      .transition()
        .ease(easeExp)
        .duration(this.d)
        .attr('r', function(d, i) {
          return 0;
        })
      .remove();

    //** UPDATE DOTS
    bars
      .transition()
        .ease(easeCubic)
        .duration(this.d)
        // .delay(250)
        .attr('cx', (d, i) => {
          return this.x(d.xValue);
        })
        .attr('cy', (d, i) => {
          return this.y(d.yValue);
        })
        .attr('r', (d, i) => {
          return this.ss.dots.r;
        });

    //** ADD
    bars
      .enter().append('circle')
      .attr('class', this.ss.styles.point)
      .style('fill', (d, i) => {
        return this.ss.data.dataset[lineIter].lineColor;
      })
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
        if (this.onClick) {
          this.onClick(nodes[i]);
        }
      })
      .attr('cx', (d, i) => {
        return this.x(d.xValue);// + this.r / 2;
      })
      .attr('cy', (d, i) => {
        return this.y(d.yValue);
      })
      .transition()
        .ease(easeCubic)
        .duration(this.d)
        .delay(0)
        .attr('r', (d, i) => {
          return this.ss.dots.r;
        });
  }

  handleLegendaClick(d) {
    //** extended
    let hiddenLineOpacity = .1;
    let path = this['path' + d.index];
    let g = this['g' + d.index];
    if (path.activeOpacity < 1) {
      path.activeOpacity = 1;
    } else {
      path.activeOpacity = .1;
    }

    TweenMax.to(path.node(), .3, {
      alpha: path.activeOpacity
    });
    TweenMax.to(g.node(), .3, {
      alpha: path.activeOpacity
    });

    let op = path.activeOpacity;
    if (op < 1) {
      op = .5;
    }
    TweenMax.to(d.item.node(), .3, {
      alpha: op
    });

  }
  //** UTILS **//
  onMouseMove() {
    if (this.dataStore) {
      for (let i = 0; i < this.dataStore.length; i++) {
        let iter = i;
        let pathEl = this['path' + iter].node();
        let mouse = d3.mouse(this.svg.node());
        mouse[0] = mouse[0] - this.ss.margins.left;
        if (mouse[0] < 0 || mouse[0] > this.w) {
          this['circle' + iter]
              .attr('display', 'none');
          this.line
              .attr('display', 'none');
        } else {
          this['circle' + iter]
            .attr('display', 'null')
            .attr('transform', () => {
              let tempM = mouse[0] + 0;
              let beginning = 0;
              let end = pathEl.getTotalLength() + 0;
              let target = null;
              while (true) {
                target = Math.floor((beginning + end) / 2);
                let pos = pathEl.getPointAtLength(target);
                if ((target === end || target === beginning) && pos.x !== tempM) {
                  break;
                }
                if (pos.x > tempM) {
                  end = target;
                } else if (pos.x < tempM) {
                  beginning = target;
                } else {
                  break;
                }
              }
              return 'translate(' + (mouse[0] + this.ss.margins.left) + ',' + (pos.y + this.ss.margins.top) + ')';
            });
          this.line
              .attr('display', 'null')
              .attr('x1', mouse[0] + this.ss.margins.left)
              .attr('x2', mouse[0] + this.ss.margins.left)
              .attr('y1', 0)
              .attr('y2', this.w);
        }
      }
    }
  }
  //** parse array data. convert date if needed
  parseData(lines) {

    //**check if data are available in dataset, otherwise skip
    if (!lines[0].data) {
      return;
    }
    //** we got data. do parsing
    let parsedLine = [];
    for (let i = 0; i < lines.length; i++) {
      let parsedData = [];
      let line = lines[i];
      let dataLine = line.data;
      for (let i = 0; i < dataLine.length; i++) {
        let xx;
        if (this.ss.timeseries) {
          xx = (d3.isoParse(dataLine[i][this.ss.data.xParam])) ? d3.isoParse(dataLine[i][this.ss.data.xParam]) : dataLine[i][this.ss.data.xParam];
        } else {
          xx = dataLine[i][this.ss.data.xParam];
        }
        let a = {
          xValue: xx,
          yValue: dataLine[i][this.ss.data.yParam]
        };
        parsedData.push(a);
      }
      parsedLine.push(parsedData);
    }
    return parsedLine;
  }

  //** get min and max of array of arrays of data (to support multiple lines)
  getMinMax(data) {
    let yMax = d3.max(data.map((array) => {
      return d3.max(array, (d) => {
        return Number(d.yValue);
      });
    }));
    let yMin = d3.min(data.map((array) => {
      return d3.min(array, (d) => {
        return Number(d.yValue);
      });
    }));
    return {max: yMax, min: yMin};
  }
  //** pull xAxis from array of arrays
  getxAxisValues(data) {
    let datax = [];
    let dictXValue = {};
    for (let i = 0; i < data.length; i++) {
      let dataArray = data[i];
      for (let i = 0; i < dataArray.length; i++) {
        let dataObj = dataArray[i];
        if (dictXValue[dataObj.xValue] !== 1) {
          datax.push(dataObj.xValue);
        }
        dictXValue[dataObj.xValue] = 1;
      }
    }
    return datax;
  }
}

export default D3LineChart;
