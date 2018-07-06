import Graph from './../../graph';
import germany from './exported/germany.new.json';
import utils from './../../../../utils.js';
import appConstants from './../../../../../../app-utils/app-constants.js';
import styles from './style.css';
styles;

class GraphMapTopo extends Graph {
  constructor(dom, settings) {
    super(dom, settings);
    this.settings = settings;
    this.app = this.settings.grapher.props.app;
    this.match = this.settings.match;
    this.app.map = this;
    this.metadata = this.settings.metadata;
    this.dictLandkreisPath = {};

    this.selectedPosChannel = 0;
    this.strokeSize = .15;

    this.div = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('pointer-events', 'none');
  }
  //** create
  create() {
    let scope = this;

    // this.legendaHover = new GraphMapLegendaHover(this.dom, {});
    initParams();
    prepareMap();

    scope.renderMap('land');
    this.svg.on('dblclick.zoom', null);
    function zoomed() {
      scope.gg.attr('transform', d3.event.transform);
      scope.gg2.attr('transform', d3.event.transform);
      if (scope.mood === 'postcode') {
        scope.gg3.attr('transform', d3.event.transform);
      }
      scope.gg4.attr('transform', d3.event.transform);
      scope.ggExtra.attr('transform', d3.event.transform);
      scope.ggBis.attr('transform', d3.event.transform);
    }
    function zoomEndFunction() {
      if (!scope.zoomOut) {
        scope.renderMap(scope.mood);
      }
    }
    function zoomStartFunction() {
      if (scope.zoomOut) {
        scope.renderMap(scope.mood);
      }
    }

    //** private methods
    function initParams() {
      scope.centerPoint = {
        lng: 11.0,
        lat: 52.0
      };
      scope.baseScale = 1;
      scope.point = scope.centerPoint;
      scope.iter = 0;
      scope.oldTransformX = 0;
      scope.infoSizeH = 35;
      scope.width = window.innerWidth;
      scope.height = window.innerHeight;
    }
    function prepareMap() {
      scope.counties = topojson.feature(germany, germany.objects.counties).features;

      scope.countiesDict = {};
      for (let i = 0; i < scope.counties.length; i++) {
        scope.countiesDict[scope.counties[i].properties.name] = scope.counties[i];
      }
      scope.states = topojson.feature(germany, germany.objects.states).features;
      scope.statesDict = {};
      for (let i = 0; i < scope.states.length; i++) {
        scope.statesDict[scope.states[i].properties.name] = scope.states[i];
      }
      let svgContainer = document.getElementById('svgContainer');
      scope.svg = d3.select(svgContainer).append('svg');
        // .attr('width', scope.width)
        // .attr('height', scope.height);

      scope.gg = scope.svg
        .append('g');
      scope.gg2 = scope.svg
        .append('g');
      scope.gg3 = scope.svg
        .append('g');
      scope.gg4 = scope.svg
        .append('g');
      scope.ggExtra = scope.svg
        .append('g');
      scope.ggBis = scope.svg
        .append('g');
      scope.projection = d3.geoMercator()
        .scale(1500)
        .translate([scope.width / 2, scope.height / 2]);

      scope.path = d3.geoPath()
        .projection(scope.projection);

      scope.zoom = d3.zoom()
        .duration(1500)
        .scaleExtent([1, 8])
        .translateExtent([[0,0], [scope.width, scope.height]])
        .extent([[0, 0], [scope.width, scope.height]])
        .on('end', zoomEndFunction)
        .on('start', zoomStartFunction)
        .on('zoom', zoomed);

      scope.zoomResize = d3.zoom()
        .duration(1500)
        .scaleExtent([1, 8])
        .translateExtent([[0,0], [scope.width, scope.height]])
        .extent([[0, 0], [scope.width, scope.height]])
        .on('zoom', zoomed);
    }

      /*

      TEST GRADIENT!!
    let colorRange = ['#46b225', '#155b6a'];
    let color = d3.scaleLinear().range(colorRange).domain([1, 2, 3, 4, 5]);
    let linearGradient = scope.svg.append('defs')
            .append('linearGradient')
            .attr('id', 'linear-gradient');

    linearGradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', color(1));

    linearGradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', color(2));

            //
            //     .attr("x", 0)
            // .attr("y", 0)
            // .attr("width", width)
            // .attr("height", height)
            // .style("stroke", "black")
            // .style("stroke-width", 2)
            // .style("fill", "url(#linear-gradient)");
    scope.svg
      .append('rect')
      .attr('x', 0)
      .attr('y', (d) => {
        return 0;
      })
      .attr('width', (d) => {
        return 200;
      })
      .attr('height', 200)
      .style('fill', 'url(#linear-gradient)');
      */
  }

  renderMap(mood) {
    this.mood = mood;
    switch (mood) {
    case 'land':
      this.mainFeatures = this.states;
      switch (this.selectedPosChannel) {
      case 0:
        this.renderLands();
        break;
      case 1:
        this.renderLandCarDealer();
        break;
      case 2:
        this.renderLandTyreTrader();
        break;

      default:
        this.renderLands();
      }

      this.renderLandkreiser();
      this.renderPostcodes();
      this.renderPos();
      break;
    case 'landkreiser':
      this.mainFeatures = this.counties;
      this.renderLands();
      this.renderLandkreiser();
      this.renderPostcodes();
      this.renderPos();
      break;

    case 'postcode':
      this.mainFeatures = this.postcodes;
      switch (this.selectedPosChannel) {
      case 0:
        this.renderLands();
        break;
      case 1:
        // this.renderLandCarDealer();
        break;
      case 2:
        this.renderLandTyreTrader();
        break;

      default:
        this.renderLands();
      }
      this.renderLandkreiser();
      break;
    }
  }

  updateGlobalData(parsedResults) {
    this.landsColors = parsedResults.landsColors;
    this.landsColorsCarDealer = parsedResults.landsColorsCarDealer;
    this.landsColorsTyreTrade = parsedResults.landsColorsTyreTrade;
    this.dictCarDealers = parsedResults.dictCarDealers;
    this.dictTyreTrade = parsedResults.dictTyreTrade;
    this.dictLandkreis = parsedResults.dictLandkreis;

    this.scaleColorCarDealers = parsedResults.scaleColorCarDealers;
    this.scaleColorTyreTrader = parsedResults.scaleColorTyreTrader;
  }
  renderLands() {
    this.closeLSM();

    let rects = this.gg.selectAll('path')
      .data(this.states.filter((d) => {
        return d;
      }));

    //** REMOVE
    rects
      .exit()
      .remove();

    //** UPDATE
    rects
      .transition()
      .duration(500)
      .ease(d3.easeCubic)
      .attr('d', this.path)
      .attr('fill', (d) => {
        if (this.mood === 'land') {
          if (!this.landsColors) {
            return '#2b2c3d';
          }
          return this.landsColors[d.properties.name].color;
        }
        if (this.mood === 'landkreiser') {
          return '#726767';
        }
        if (this.mood === 'postcode') {
          return '#2b2c3d';
        }
      })
      .style('stroke-width', this.strokeSize)
			.style('stroke', 'black');

    //** ADD
    rects
        .enter().append('path')
        .attr('d', this.path)
        .attr('fill', (d) => {
          if (this.mood === 'land') {
            if (!this.landsColors) {
              return '#2b2c3d';
            }

            return this.landsColors[d.properties.name].color;
          }
          if (this.mood === 'landkreiser') {
            return '#726767';
          }
          if (this.mood === 'postcode') {
            return '#2b2c3d';
          }
        })
        .style('stroke-width', this.strokeSize)
        .style('stroke', 'black')
        .style('cursor', 'pointer')
        .on('mouseover', (d, a, b) => {
          d3.select(b[a])
            .style('opacity', 0.8);
          this.settings.grapher.updateHover(d.properties.name);
        })
        .on('mouseout', (d, a, b) => {
          d3.select(b[a])
            .style('opacity', 1);
          this.settings.grapher.updateHover(0);
        })
        .on('click', (d) => {
          if (this.mood === 'landkreiser') {
            this.clickBack(d);
          } else {
            this.clicked(d);
          }
        });
  }

  renderLandCarDealer() {
    this.closeLSM();

    let duration = 500;
    for (let carDealer in this.dictCarDealers) {
      let merge = [topojson.merge(germany, germany.objects.counties.geometries.filter((d) => {
        if (this.dictLandkreis[d.properties.name].globals.car_dealer === carDealer) {
          return d;
        }
      }))];

      this.dictCarDealers[carDealer].merge = merge;
      this.ggExtra
        .append('path')
        .data(merge)
        .attr('class', 'state selected')
        .attr('d', this.path)

        .on('mouseover', (d, a, b) => {
          // d3.select(b[a])
          //   .style('opacity', 0.8);
          this.settings.grapher.updateHover(carDealer);
        })
        .on('mouseout', (d, a, b) => {
          // d3.select(b[a])
          //   .style('opacity', 1);
          this.settings.grapher.updateHover(0);
        })
        .on('click', (d) => {
          // this.testZoom(this.dictCarDealers[carDealer].merge);
          // this.clickedCarDealer(carDealer);

          this.clicked(carDealer);
        })

        .attr('fill', (d) => {
          let c = this.dictCarDealers[carDealer].globals[this.metadata.o.gap.key];
          return this.scaleColorCarDealers(c);
        })
        .style('cursor', 'pointer')
        .style('stroke-width', .5)
        .style('stroke', 'white')
        .style('opacity', 0)
        .transition()
        .duration(duration)
        .delay(0)
        .ease(d3.easeCubic)
        .style('opacity', 1);
    }
  }

  renderLandTyreTrader() {
    this.closeLSM();

    let duration = 500;
    for (let tyreTrade in this.dictTyreTrade) {
      let merge = [topojson.merge(germany, germany.objects.counties.geometries.filter((d) => {
        if (this.dictLandkreis[d.properties.name].globals.tyre_trade === tyreTrade) {
          return d;
        }
      }))];
      this.dictTyreTrade[tyreTrade].merge = merge;
      this.ggExtra
        .append('path')
        .data(merge)
        .attr('class', 'state selected')
        .attr('d', this.path)

        .on('mouseover', (d, a, b) => {
          // d3.select(b[a])
          //   .style('opacity', 0.8);
          this.settings.grapher.updateHover(tyreTrade);
        })
        .on('mouseout', (d, a, b) => {
          // d3.select(b[a])
          //   .style('opacity', 1);
          this.settings.grapher.updateHover(0);
        })
        .on('click', (d) => {
          this.clicked(tyreTrade);
        })
        .attr('fill', (d) => {
          let c = this.dictTyreTrade[tyreTrade].globals[this.metadata.o.gap.key];
          return this.scaleColorTyreTrader(c);
        })
        .style('cursor', 'pointer')
        .style('stroke-width', .5)
        .style('stroke', 'white')
        .style('opacity', 0)
        .transition()
        .duration(duration)
        .delay(300)
        .ease(d3.easeCubic)

        .style('opacity', 1);
    }
  }

  closeLSM() {
    let lsmPaths = this.ggExtra.selectAll('path')
      .data([]);

    //** REMOVE
    lsmPaths
      .exit()
      .transition()
      .duration(700)
      .delay(200)
      .ease(d3.easeCubic)
      .style('opacity', 0)
      .remove();
  }
  //** triggered when list is hovered. highlight geo area in the map
  updateMapHover(l) {
    //let path = this.dictLandkreisPath[l];
    // if (path) {
    //   setTimeout(() => {
    //     d3.select(path)
    //       .style('stroke-width', this.strokeSize * 5)
    //       .style('stroke', 'white')
    //       .style('zIndex', 2000)
    //       .style('opacity', 0);
    //   }, 500);
    // }
  }
  renderLandkreiser() {
    if (this.mood === 'postcode') {
      this.closeLSM();
    }
    let duration = 400;
    let rects = this.gg2.selectAll('path')
      .data(this.counties.filter((d) => {
        if (this.mood === 'land') {
          return;
        }

        if (this.mood === 'landkreiser') {
          let paramLand = this.match.params.land;
          let name = d.properties.name;
          this.oldLSMName = paramLand;
          if (this.dictCarDealers[paramLand]) {
            let dictLandkreis = this.dictCarDealers[paramLand].dictLandkreis;
            if (dictLandkreis[name]) {
              return d;
            } else {
              if (this.props.filters[name]) {
                if (this.dictCarDealers[paramLand].dictLandkreis[this.props.filters[name]]) {
                  return d;
                }
              }
            }
          }
          if (this.dictTyreTrade[paramLand]) {
            let dictLandkreis = this.dictTyreTrade[paramLand].dictLandkreis;
            if (dictLandkreis[name]) {
              return d;
            } else {
              if (this.props.filters[name]) {
                if (this.dictTyreTrade[paramLand].dictLandkreis[this.props.filters[name]]) {
                  return d;
                }
              }
            }
          }
          if (d.properties.state === paramLand) {
            return d;
          }
        }
        if (this.mood === 'postcode') {
          // return d;
          let paramLand = this.match.params.land;
          if (this.oldLSMName) {
            if (this.dictTyreTrade[this.oldLSMName]) {
              if (this.dictTyreTrade[this.oldLSMName].dictLandkreis[d.properties.name]) {
                return d;
              } else {
                if (this.props.filters[d.properties.name]) {
                  if (this.dictTyreTrade[this.oldLSMName].dictLandkreis[this.props.filters[d.properties.name]]) {
                    return d;
                  }
                }
              }
            }
            if (this.dictCarDealers[this.oldLSMName]) {
              if (this.dictCarDealers[this.oldLSMName].dictLandkreis[d.properties.name]) {
                return d;
              } else {
                if (this.props.filters[d.properties.name]) {
                  if (this.dictCarDealers[this.oldLSMName].dictLandkreis[this.props.filters[d.properties.name]]) {
                    return d;
                  }
                }
              }
            }
            if (d.properties.state === paramLand) {
              return d;
            }
          }
        }
      }));

    //** REMOVE
    rects
      .exit()
      .remove();

    //** UPDATE
    rects
      // .transition()
      // .duration(duration)
      // .ease(d3.easeCubic)
      .attr('d', this.path)
      .attr('fill', (d) => {
        if (this.mood === 'landkreiser') {
          let c = this.getColorLandkreisName(d.properties.name);
          return c;
        }
        if (this.mood === 'postcode') {
          if (d.properties.name === this.match.params.landkreiser) {
            return '#c3c6a9';
          } else {
            return '#726767';
          }
        }
      })

      .transition()
      .duration(duration)
      .delay(0)
      .ease(d3.easeCubic)
      .style('stroke-width', this.strokeSize)
			.style('stroke', 'black')
      .style('opacity', 1);

    //** ADD
    rects
        .enter().append('path')
        .attr('d', this.path)
        .attr('i', (d, a, b) => {
          this.dictLandkreisPath[d.properties.name] = b[a];
        })
        .on('click', (d) => {
          if (this.mood === 'postcode') {
            if (d.properties.name !== this.match.params.landkreiser) {
              this.clickBack(d);
            }
          } else {
            this.clicked(d);
          }
        })
        .on('mouseover', (d, a, b) => {
          if (this.mood !== 'postcode') {
            d3.select(b[a])
              .style('opacity', 0.8);
            this.settings.grapher.updateHover(d.properties.name);
          }

        })
        .on('mouseout', (d, a, b) => {
          d3.select(b[a])
            .style('opacity', 1);
          this.settings.grapher.updateHover(0);
        })
        .style('opacity', 0)
        .attr('fill', (d) => {

          if (this.mood === 'landkreiser') {
            let c = this.getColorLandkreisName(d.properties.name);
            return c;
          }
          if (this.mood === 'postcode') {
            if (d.properties.name === this.match.params.landkreiser) {
              return '#c3c6a9';
            } else {
              return '#726767';
            }
          }
        })

        .style('cursor', 'pointer')
        .transition()
        .duration(duration)
        .delay(0)
        .ease(d3.easeCubic)
        .style('stroke-width', this.strokeSize)
        .style('stroke', 'black')
        .style('opacity', 1);

  }
  getColorLandkreisName(name) {
    let c;
    switch (this.selectedPosChannel) {
    case 0:
      if (this.landsColors[name]) {
        c  = this.landsColors[name].color;
      } else {
        if (this.props.filters[name]) {
          if (this.landsColors[this.props.filters[name]]) {
            c  = this.landsColors[this.props.filters[name]].color;
          }
        }
      }
      break;
    case 1:
      if (this.landsColorsCarDealer[name]) {
        c  = this.landsColorsCarDealer[name].color;
      } else {
        if (this.props.filters[name]) {
          if (this.landsColorsCarDealer[this.props.filters[name]]) {
            c  = this.landsColorsCarDealer[this.props.filters[name]].color;
          }
        }
      }
      break;
    case 2:
      if (this.landsColorsTyreTrade[name]) {
        c  = this.landsColorsTyreTrade[name].color;
      } else {
        if (this.props.filters[name]) {
          if (this.landsColorsTyreTrade[this.props.filters[name]]) {
            c  = this.landsColorsTyreTrade[this.props.filters[name]].color;
          }
        }
      }
      break;
    }

    return c;
  }

  renderPostcodes(mypostcodes, dictColorPostcode) {
    /*

                */

    if (!mypostcodes) {
      mypostcodes = [];
    }

    if (this.mood === 'postcode') {
      this.closeLSM();
    }

    let duration = 500;
    let rects = this.gg3.selectAll('path')
      .data(mypostcodes.filter((d) => {
        if (this.mood === 'land') {
          return;
        }
        if (this.mood === 'landkraiser') {
          return;
        }
        if (this.mood === 'postcode') {
          return d;
        }
      }));

    //** REMOVE
    rects
      .exit()
      .remove();

    //** UPDATE
    rects
      .transition()
      .duration(duration)
      .ease(d3.easeCubic)
      .attr('d', this.path)
      .attr('fill', (d) => {
        if (dictColorPostcode) {
          return dictColorPostcode[d.properties.postcode];
        }
      })
      .style('stroke-width', this.strokeSize)
			.style('stroke', 'black')
      .transition()
      .duration(duration)
      .delay(300)
      .ease(d3.easeCubic)

      .style('opacity', 1);

    //** ADD
    rects
        .enter().append('path')
        .attr('d', this.path)
        .on('click', (d) => {
          let c = dictColorPostcode[d.properties.postcode];
          if (c) {
            // this.clicked(d);
          }
        })
        .on('mouseover', (d, a, b) => {
          let c = dictColorPostcode[d.properties.postcode];
          if (c) {
            d3.select(b[a])
              .style('opacity', 0.8);
            this.settings.grapher.updateHover(d.properties.postcode);
          }
        })
        .on('mouseout', (d, a, b) => {
          let c = dictColorPostcode[d.properties.postcode];
          if (c) {
            d3.select(b[a])
              .style('opacity', 1);
            this.settings.grapher.updateHover(0);
          }

        })
        .style('opacity', 0)
        .attr('fill', (d) => {
          if (dictColorPostcode) {
            return dictColorPostcode[d.properties.postcode];
          }
        })
        .style('stroke-width', this.strokeSize)
        .style('stroke', 'black')
        .style('cursor', (d) => {
          let c = dictColorPostcode[d.properties.postcode];
          if (c) {
            return 'pointer';
          }
        })
        .transition()
        .duration(duration)
        .delay(300)
        .ease(d3.easeCubic)
        .style('opacity', 1);
  }
  renderPos() {
    let posArr = [];
    if (!this.posArr) {
      posArr = [];
    } else {
      //** no pos displayed on map, unless we are in territory
      if (this.settings.grapher.props.selectedSection !== 1) {
        posArr = [];
      } else {
        if (this.mood === 'postcode') {
          posArr = this.posArr;
        }

      }
    }

    let r = 1 / (this.scale / 10);
    let duration = 500;

    let rectTest = this.ggBis.selectAll('circle');
    let rects = this.gg4.selectAll('circle')
      .data(posArr.filter((d) => {
        return d;
      }));

    //** REMOVE
    rects
      .exit()
      .transition()
      .duration(duration)
      .ease(d3.easeCubic)
      .style('opacity', 0)
      .remove();

    //** UPDATE
    rects
      .attr('transform', (d) => {
        return 'translate(' + this.projection([d.pos_longitude,d.pos_latitude]) + ')';
      })
      .style('stroke-width', r / 10)
      .style('stroke', 'black')
      .attr('fill', (d) => {
        let channel = d[this.metadata.o.macrotypology.key];
        if (channel === appConstants.TYRE_SPECIALIST || channel === appConstants.AUTO_CENTRE) {
          return '#09c0f5';
        } else {
          return '#30f509';
        }
      })
      .transition()
      .duration(300)
      // .delay(300)
      .ease(d3.easeCubic)
      .attr('r', (d) => {
        let channel = d[this.metadata.o.macrotypology.key];
        return this.getR(channel, r);
      })
      .style('opacity', 1);

    //** ADD
    rects
        .enter()
        .append('circle')
        .attr('transform', (d) => {
          return 'translate(' + this.projection([d.pos_longitude,d.pos_latitude]) + ')';
        })
        .on('mouseover', (d, a, b) => {
          d3.select(b[a])
            .style('opacity', 0.8);
          this.settings.grapher.updateHover(d.postcode);

          this.div.transition().duration(300)
            .style('opacity', 1);
          this.div.html(d[this.metadata.o.pos_name.key] + '</br>' + d[this.metadata.o.subtipology.key])
          .style('left', (d3.event.pageX) + 'px')
          .style('top', (d3.event.pageY - 30) + 'px');
        })
        .on('mouseout', (d, a, b) => {
          d3.select(b[a])
            .style('opacity', 1);
          this.settings.grapher.updateHover(0);

          this.div.transition().duration(300)
            .style('opacity', 0);
        })
        .style('stroke-width', r / 10)
        .style('stroke', 'black')
        .style('cursor', 'pointer')

        .attr('fill', (d) => {
          let channel = d[this.metadata.o.macrotypology.key];
          if (channel === appConstants.TYRE_SPECIALIST || channel === appConstants.AUTO_CENTRE) {
            return '#09c0f5';
          } else {
            return '#30f509';
          }
        })
        .transition()
        .duration(duration)
        .ease(d3.easeCubic)
        .attr('r', (d) => {
          let channel = d[this.metadata.o.macrotypology.key];
          return this.getR(channel, r);
        })
        .style('opacity', 1);

  }
  getR(channel, r) {
    switch (this.selectedPosChannel) {
    case 0://**ALL
      return r;
    case 1://** CAR DEALER
      if (channel === appConstants.CAR_DEALER) {
        return r;
      } else {
        return 0;
      }
    case 2://** TYRE TRADE
      if (channel === appConstants.TYRE_SPECIALIST || channel === appConstants.AUTO_CENTRE) {
        return r;
      } else {
        return 0;
      }
    }
    return r;
  }
  clickBack(d) {
    if (this.mood === 'landkreiser') {
      this.app.goUrl();
    }
    if (this.mood === 'postcode') {
      this.app.goUrl({
        nav: 'land',
        params: {
          land: d.properties.state
        }
      });
    }
  }
  clicked(d) {
    switch (this.mood) {
    case 'land':
      switch (this.selectedPosChannel) {
      case 1:
        this.app.goUrl({
          nav: 'land',
          params: {
            type: 'cd',
            cd: d
          }
        });
        break;
      case 2:
        this.app.goUrl({
          nav: 'land',
          params: {
            type: 'tt',
            tt: d
          }
        });
        break;
      default:
        this.app.goUrl({
          nav: 'land',
          params: {
            land: d.properties.name
          }
        });

      }

      break;
    case 'landkreiser':
      switch (this.selectedPosChannel) {
      case 1:
        this.app.goUrl({
          nav: 'landkreis',
          params: {
            land: d.properties.state,
            landkreis: d.properties.name
          }
        });
        break;
      case 2:
        this.app.goUrl({
          nav: 'landkreis',
          params: {
            land: d.properties.state,
            landkreis: d.properties.name
          }
        });
        break;
      default:
        this.app.goLandkreisView(d.properties.name, d.properties.state);
      }

      break;
    case 'postcode':
      this.app.goBack();
    }
  }

  callLandkApi(dd) {
    //this.app.fetchLandkreisData(dd.properties.name, this.onDataLandk.bind(this));
  }

  onDataLandk(r, selectedPosChannel) {
    let tempArr = [];
    let dictPostcodeColors = {};
    let dataPostcodes = r.lkd.postcodes;
    for (let i = 0; i < dataPostcodes.length; i++) {
      if (dataPostcodes[i][this.metadata.o.gap.key] !== 'N/A') {
        tempArr.push(dataPostcodes[i][this.metadata.o.vehicles_count.key]);
      }

    }
    let scaleColor = utils.createScaleColor2(tempArr);
    for (let i = 0; i < dataPostcodes.length; i++) {
      if (dataPostcodes[i][this.metadata.o.gap.key] !== 'N/A') {
        dictPostcodeColors[dataPostcodes[i].postcode] = scaleColor(dataPostcodes[i][this.metadata.o.vehicles_count.key]);
      } else {
        dictPostcodeColors[dataPostcodes[i].postcode] = '#ffffff';
      }
      // dictPostcode[dataPostcodes[i].postcode] = dataPostcodes[i];
    }

    let posArr = [];
    for (let i = 0; i < dataPostcodes.length; i++) {
      let pos = dataPostcodes[i].pos;
      for (let i = 0; i < pos.length; i++) {
        posArr.push(pos[i]);
      }
    }
    this.selectedPosChannel = selectedPosChannel;
    this.renderPostcodes(r.tp.postcodes, dictPostcodeColors);
    this.posArr = posArr;
    setTimeout(() => {
      this.renderPos();
    }, 500);

  }
  updateTypeMap(props) {
    // this.mood = 'land';
    this.selectedPosChannel = props.selectedPosChannel;
    this.renderMap('land');
  }
  updateMap(props) {
    if (props.navStatus === this.mood) {
      this.renderMap(this.mood);
      //return;
    }

    this.invertedFilters = {};
    for (let f in props.filters) {
      this.invertedFilters[props.filters[f]] = f;
    }

    this.landkreisName = this.match.params.landkreiser;
    if (this.invertedFilters[this.match.params.landkreiser]) {
      this.landkreisName = this.invertedFilters[this.match.params.landkreiser];
    }
    this.zoomOut = false;
    let oldMood = this.mood;
    this.match = props.match;
    this.selectedPosChannel = props.selectedPosChannel;
    this.props = props;
    switch (props.navStatus) {
    case 'land':
      this.mood = 'land';
      if (oldMood === 'postcode') {
        this.zoomOut = true;
      }
      this.mainFeatures = this.states;
      this.renderZoomGermany();
      break;
    case 'landkreiser':
      let d;
      let paramLand = this.match.params.land;

      this.mood = 'landkreiser';
      if (oldMood === 'postcode') {
        this.zoomOut = true;
      }
      if (this.statesDict[paramLand]) {
        d = this.statesDict[paramLand];
        this.renderZoom(d);
      }
      if (this.dictTyreTrade[paramLand]) {
        d = this.dictTyreTrade[paramLand];
        this.renderZoomLSM(d.merge);
      }
      if (this.dictCarDealers[paramLand]) {
        d = this.dictCarDealers[paramLand];
        this.renderZoomLSM(d.merge);
      }

      break;
    case 'postcode':
      let dd = this.countiesDict[this.match.params.landkreiser];
      if (this.invertedFilters[this.match.params.landkreiser]) {
        dd = this.countiesDict[this.invertedFilters[this.match.params.landkreiser]];
      }

      this.mood = 'postcode';
      this.renderZoom(dd);
      break;
    }
  }

  renderZoom(d) {
    let scaleBase = 45;
    console.log('d ', d);
    switch (d.properties.name) {
    case 'Bayern':
      scaleBase = 5;
      break;
    }
    this.activeD = d;
    let test = {
      geometry: d.geometry,
      type: d.type
    };
    let bounds = this.path.bounds(test),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = Math.max(1, Math.min(scaleBase, 0.9 / Math.max(dx / this.w, dy / this.h))),
      //scale = Math.max(5, Math.min(20 / Math.max(dx / this.w, dy / this.h), 0.5 / Math.max(dx / this.w, dy / this.h))),
      translate = [this.w / 2 - scale * x, this.h / 2 - scale * y];
    this.scale = scale;
    this.svg.transition()
        .duration(1200)
        .delay(200)
        // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
        .call(this.zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale));
  }
  renderZoomLSM(merge) {
    if (!merge) {
      merge = [topojson.merge(germany, germany.objects.counties.geometries.filter((d) => {
        switch (this.selectedPosChannel) {
        case 1:
          if (this.dictLandkreis[d.properties.name].globals.car_dealer === this.match.params.land) {
            return d;
          }
          break;
        case 2:
          if (this.dictLandkreis[d.properties.name].globals.tyre_trade === this.match.params.land) {
            return d;
          }
          break;
        }
      }))];
    }
    let scaleBase = 45;
    let test = {
      type: 'Feature',
      geometry: merge[0]
    };
    this.activeD = merge;
    let bounds = this.path.bounds(test),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = Math.max(1, Math.min(scaleBase, 0.9 / Math.max(dx / this.w, dy / this.h))),
      //scale = Math.max(5, Math.min(20 / Math.max(dx / this.w, dy / this.h), 0.5 / Math.max(dx / this.w, dy / this.h))),
      translate = [this.w / 2 - scale * x, this.h / 2 - scale * y];

    this.scale = scale;
    this.svg.transition()
        .duration(1200)
        .delay(200)
        .call(this.zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale));
  }
  renderZoomGermany() {
    let minLeft = d3.min(this.mainFeatures.map((array) => {
      let bounds = this.path.bounds(array);
      return d3.min(bounds, (d) => {
        return Number(d[0]);
      });
    }));
    let maxRight = d3.max(this.mainFeatures.map((array) => {
      let bounds = this.path.bounds(array);
      return d3.max(bounds, (d) => {
        return Number(d[0]);
      });
    }));
    let minTop = d3.min(this.mainFeatures.map((array) => {
      let bounds = this.path.bounds(array);
      return d3.min(bounds, (d) => {
        return Number(d[1]);
      });
    }));
    let maxBottom = d3.max(this.mainFeatures.map((array) => {
      let bounds = this.path.bounds(array);
      return d3.max(bounds, (d) => {
        return Number(d[1]);
      });
    }));

    let dx = maxRight - minLeft;
    let dy = maxBottom - minTop;
    let x = (minLeft + maxRight) / 2;
    let y = (minTop + maxBottom) / 2;
    let scale = Math.max(1, Math.min(3, 0.9 / Math.max(dx / this.w, dy / this.h)));
    let translate = [this.w / 2 - scale * (x), this.h / 2 - scale * y];
    this.svg.transition()
          .duration(1200)
          .delay(200)
          .call(this.zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
  }
  //** getting data updates (new data received and parsed)
  update(data) {
    this.component = data.component;
  };

  //** run
  run() {
    // if (this.meter) {
    //   this.meter.tick();
    // }
    // requestAnimationFrame(this.run.bind(this));
  };

  //** getting size update
  onResize(isResize) {
    let w = this.w;
    let h = this.h;

    TweenMax.to(this.svg.node(), 1, {
      width: w,
      height: h - this.infoSizeH,
      ease: window.Power4.easeOut
    });
    if (!isResize) {
      return;
    }
    switch (this.mood) {
    case 'land':
      this.renderZoomGermany();
      break;
    default:
      switch (this.selectedPosChannel) {
      case 0:
        this.renderZoom(this.activeD);
        break;
      default:
        if (this.mood === 'postcode') {
          this.renderZoom(this.activeD);
        } else {
          this.renderZoomLSM(this.activeD);
        }
      }
    }
  };

  //** layout completed move animation. override graph.updatedSize
  updatedSize(w, h, isResize) {
    if (w) {
      this.w = w;
      this.h = h;
    }
    this.onResize(isResize);
  };

  // //** utils
  // createScaleColor(arr) {
  //   let minGap = d3.min(arr);
  //   let maxGap = d3.max(arr);
  //   let scaleColor = d3.scaleLinear()
  //    .domain([minGap, maxGap])
  //    .range(['#f0d124', '#f04524']);
  //
  //   return scaleColor;
  // }
}

export default GraphMapTopo;
