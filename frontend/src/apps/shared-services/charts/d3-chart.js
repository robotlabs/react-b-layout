class D3Chart {
  constructor(settings) {
    this.legendDotRay = 4;
    this.ss = {};
    for (let m in settings) {
      this.ss[m] = settings[m];
    }
    //** give space to legenda if available
    if (this.ss.legenda) {
      this.ss.margins.top = this.ss.margins.top + 20;
    }
    //** create main g
    this.createMainG();
    this.createToolTip();
    //** create scales
    this.createScales();
    //** create axis
    if (!this.hideAxes) {
      this.createAxis();
    }

    //** in case we have already data, we render without waiting any external update
    if (this.ss.data) {
      //** we store data. render will be called with updateSize
      this.dataStore = this.parseData(this.ss.data.dataset);
    }

    if (this.ss.legenda) {
      this.gLegenda = this.svg.append('g');
      this.renderLegenda();
    }

  }

  //***************
  // update
  //** new data coming
  updateData(data) {
    let databars = data;
    if (databars.length > this.ss.data.dataset.length) {
      let diff = databars.length - this.ss.data.dataset.length - 1;
      databars = databars.slice(0, diff);
    }
    this.dataStore = this.parseData(databars);
    this.renderChart(this.dataStore);
    if (this.ss.legenda) {
      this.renderLegenda();
    }
  }

  updateTitle(title) {
    if (!this.chartTitle) {
      this.chartTitle = this.gLegenda
        .append('text')
        .attr('fill', this.ss.legenda.colorText)
        .attr('class', this.ss.styles.legenda);
    }
    this.chartTitle
      .text(title);
  }

  updateSize(w, h, isResize) {
    this.axisSpeed = 0;
    if (isResize) {
      this.axisSpeed = 1000;
    }
    this.w = w - this.ss.margins.left - this.ss.margins.right;
    this.h = h - this.ss.margins.top - this.ss.margins.bottom;
    this.svg
      .attr('width', w)
      .attr('height', h);

    //** update scales
    this.x
        .range([0,this.w]);
    this.y
        .range([this.h, 0]);

    //** if data are stored, update bar charts
    if (this.dataStore) {
      this.renderChart(this.dataStore);
    }
    if (this.ss.legenda) {
      this.renderLegenda();
    }
  }
  updateAxis(width, height) {
    let t = d3.transition()
              .ease(d3.easeCubic)
              .duration(this.axisSpeed);
    // add the X gridlines
    if (this.ss.showGrid) {
      if (this.ss.showGrid.x) {
        this.xGrid
            .transition(t)
            .attr('transform', 'translate(0,' + height + ')')
            .call(this.makeXGridLines()
                .tickSize(-height)
                .tickFormat('')
            );
      }

      if (this.ss.showGrid.y) {
        this.yGrid
            .transition(t)
            .call(this.makeYGridLines()
                .tickSize(-width)
                .tickFormat('')
            );
      }
    }

    this.xAxis.scale(this.x);
      // .ticks(4);
    this.yAxis.scale(this.y);

    this.g.select('.xx')
            .transition(t)
            .attr('transform', 'translate(0,' + height + ')')
            .call(this.xAxis);
    if (this.ss.rotateText) {
      if (this.ss.rotateText.x) {
        this.g.select('.xx')
          .selectAll('text')
          .style('text-anchor', 'end')
          // .style('fill', '#ff0099')
          .attr('dx', '-.8em')
          .attr('dy', '.15em')
          .attr('transform', 'rotate(-65)');
      }
    }

    this.g.select('.yy')
            .transition(t)
            .call(this.yAxis);

    if (this.ss.rotateText) {
      if (this.ss.rotateText.y) {
        this.g.select('.yy')
          .selectAll('text')
          .style('text-anchor', 'end')
          .attr('dx', '.8em')
          .attr('dy', '-.85em')
          .attr('transform', 'rotate(-65)');
      }
    }
  }

  //** render bar chart
  renderChart(data) {
  }

  updateLegenda(legendaUpdateObj) {
    this.ss.name = legendaUpdateObj.title;
    this.renderLegenda();
  }
  //** LEGENDA ( IF AVAILABLE )
  renderLegenda() {
    let legendBlockWidth = 0;
    let textMargin = 25;
    let offset = textMargin;
    let scope = this;
    let dd = this.ss.data.dataset;

    let legend = this.gLegenda.selectAll('.legend').data(dd);

    this.gLegenda.selectAll('g')
      .remove();

    this.updateTitle(this.ss.copyFunc(this.ss.copyTitleId));

    if (dd.length > 1) {
      legend.enter().append('g')
        .each(function(key, i) {
          key.index = i;
          let item = d3.select(this)
            .attr('class', scope.ss.styles.legendaItem);
          let text = item.append('text')
            .attr('fill', scope.ss.legenda.colorText)
            .attr('class', scope.ss.styles.legenda)
            .attr('transform',
              'translate(' + [
                scope.legendDotRay + 3,
                0
              ].join(',') + ')'
            )
            .text(scope.ss.copyFunc(key.copyTitleId));

          item.append('circle')
            .attr('r', scope.legendDotRay)
            .attr('fill', key.lineColor)
            .attr('cx', 0)
            .attr('cy', -text.node().getBBox().height / 2 + scope.legendDotRay / 2);

          item.attr('transform', () => {
            return 'translate(' + (offset + scope.chartTitle.node().getBBox().width) + ',0)';
          });

          key.item = item;
          item
            .on('click', scope.handleLegendaClick.bind(scope))
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);

          // Update the offset
          offset += text.node().getBBox().width + legendBlockWidth + textMargin * 1;
        });
    }

    let ww = 0;
    if (this.ss.legenda.position === 'right') {
      ww = this.w - this.gLegenda.node().getBBox().width + this.chartTitle.node().getBBox().width - textMargin;
    }
    this.gLegenda.attr('transform', function() {
      if (!ww) {
        ww = 0;
      }
      return 'translate(' + ww + ',20)';
    });
    //** handle simple hover state on text
    function handleMouseOver(d) {
      d3.select(this).select('text').attr('fill', d.lineColor);
    }
    function handleMouseOut(d) {
      d3.select(this).select('text').attr('fill', '#fff');
    }
  }
  handleLegendaClick(d) {
    //** extend
  }
  //** CREATE
  //** create main container
  createMainG() {
    //** main container
    this.svg = d3.select(this.ss.node).append('svg');
    this.g = this.svg.append('g');
    this.g
      .attr('transform',
            'translate(' + this.ss.margins.left + ',' + this.ss.margins.top + ')');

    this.gGrid = this.svg.append('g');
    this.gGrid
      .attr('transform',
            'translate(' + this.ss.margins.left + ',' + this.ss.margins.top + ')');
  }

  createToolTip() {
    if (!this.ss.tooltipParams) {
      return;
    }
    this.params = this.ss.tooltipParams;
    let toolTip = d3.tip()
      .attr('class', this.ss.styles.d3tip)
      .offset([this.params.offsety, this.params.offsetx])
      .html((d) => {
        let copybase = '';
        if (this.params.copybase) {
          copybase = this.params.copybase;
        }
        return copybase + d.yValue;
      });
    this.svg.call(toolTip);
    this.toolTip = toolTip;
  }

  createAxis() {
    // add the X gridlines
    if (this.ss.showGrid) {
      if (this.ss.showGrid.x) {
        this.xGrid = this.gGrid.append('g')
            .attr('class', this.ss.styles.grid)
            .call(this.makeXGridLines()
            );
      }
      if (this.ss.showGrid.y) {
        // // add the X gridlines
        this.yGrid = this.gGrid.append('g')
            .attr('class', this.ss.styles.grid)
            .call(this.makeYGridLines()
            );
      }
    }

    //** add x Axis
    this.xAxis = d3.axisBottom(this.x);
    // .ticks(10);
    if (this.ss.timeseries) {
      this.xAxis
          .tickFormat(d3.timeFormat(this.ss.timeseries.dateTickFormat));
    }
    this.g.append('g')
        .attr('class', 'xx axis ' + this.ss.styles.axisStyle)
        .call(this.xAxis);

    //** add the y Axis
    this.yAxis = d3.axisLeft(this.y);
    this.g.append('g')
        .attr('class', 'yy axis ' + this.ss.styles.axisStyle)
        .call(this.yAxis);
  }

  makeXGridLines() {
    return d3.axisBottom(this.x)
            .ticks(8);
  }
  makeYGridLines() {
    return d3.axisLeft(this.y)
            .ticks(8);
  }
  //** parse array data. convert date if needed
  parseData(data) {
    //**extended
  }
}
export default D3Chart;
