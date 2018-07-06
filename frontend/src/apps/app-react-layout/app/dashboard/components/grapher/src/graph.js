class Graph {
  constructor(dom, settings) {
    this.d3 = null;
    this.widthG = null;
    this.heightG = null;
    this.svg = null;
    this.g = null;
    this.dom = dom;
    this.settings = settings;
  }
  create() {
    this.buildEnv();
  }
  hide() {
    TweenMax.to(this.dom.getElementsByTagName('svg'), .4, {autoAlpha: 0});
  }
  show() {
    TweenMax.to(this.dom.getElementsByTagName('svg'), .4, {autoAlpha: 1, delay: .2});
  }
  updatedSize(w, h) {
    //** for nvd3. rest of graph will overwrite. get rid of this once get rid of nvd3
  }
  render() {}
  buildEnvCanvas() {
    this.d3 = window.d3;
    //** standard margin for all graphs
    this.margin = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
    //** select d3 dom element
    var domD3 = this.d3.select(this.dom);
    var canvas = document.createElement('canvas');
    // canvas
    //   .on('click', () => {
    //   });
    canvas.width  = 1224;
    canvas.height = 768;
    canvas.style.position = 'absolute';

    this.canvas = domD3.append('canvas');
    this.canvas.node().style.position = 'absolute';
    this.canvas.node().style.transform = 'translate(' + this.margin.left + 'px' + ',' + this.margin.top + 'px' + ')';

    //** setup initial position for canvas
    this.canvas.node().style.left = 0;
    this.canvas.node().style.top = this.infoSizeH + 'px';
  }
}

export default Graph;
