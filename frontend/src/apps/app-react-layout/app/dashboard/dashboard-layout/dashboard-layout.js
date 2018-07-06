import React, {Component} from '../../../../../../../../../../../Library/Caches/typescript/2.9/node_modules/@types/react';
import dispatchManager from '../../../../shared-services/dispatch-manager';
import style from './style.css';

class DashboardLayout extends Component {
  constructor(props) {
    super();
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.appReady) {
      return true;
    }
    return false;
  }
  componentWillMount() {}
  componentDidMount() {
    window.addEventListener('resize', this.resize.bind(this));
    window.addEventListener('orientationchange', this.resize.bind(this), false);
    dispatchManager.addListener(dispatchManager.flags.REQUEST_LAYOUT_UPDATE, this.requestUpdate.bind(this));
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resize.bind(this));
  }

  componentWillReceiveProps(nextProps) {
    //** update layout when layout change
    if (this.layout !== nextProps.layout) {
      this.layout = nextProps.layout;
      this.updateLayout();
    }
  }

  //** update layout called from another component
  requestUpdate() {
    this.updateLayout();
  }

  //** update layout when window resize
  resize() {
    this.updateLayout(true);
  }

  //** UPDATE LAYOUT
  updateLayout(isResize, props) {
    this.layout = this.props.layout;
    
    if (!this.layout) {
      return;
    }
    let width = window.innerWidth;
    let height = window.innerHeight;

    //** evaluate breakpoints in the layouts, and apply the corresponding
    //** this props.layout is being set in dashboard.js
    let breakpoints = this.layout.breakpoints;
    let activeLayout;
    for (let i = 0; i < breakpoints.length; i++) {
      let interval = breakpoints[i].interval;
      if (interval[1] === -1) {
        if (width > interval[0]) {
          activeLayout = breakpoints[i].layout;
        }
      } else {
        if (width > interval[0] && width < interval[1]) {
          activeLayout = breakpoints[i].layout;
        }
      }
    }
    if (this.node) {
      this.node.style.height = height + 'px';
      this.renderLayout(width, height, activeLayout, isResize);
    }
  }

  renderLayout(width, height, layout, isResize) {
    //** set TimelineMax that will manage the component size and position
    let layoutTlArgs = {
      onComplete: this.layoutUpdated
    };

    //** reset component visibility
    for (let i in this.refs) {
      this.refs[i].visible = false;
    }

    let arrTweens = [];
    let rows = layout.rows;
    let margins = layout.margins;
    let totalH = 0;
    let columnSizeCalculator = {};

    //** if overlay
    if (layout.overlay) {
      let overlay = layout.overlay;
      let comp = this.refs[overlay.id];
      comp.visible = true;
      let div = comp.node;
      let w = (width * overlay.w) / 100;
      let h = (height * overlay.h) / 100 - margins * 2;
      let l = (width * overlay.l) / 100 - margins;
      let t = (height * overlay.t) / 100 + margins;
      let tw = new TweenMax.to(div, 1, { // eslint-disable-line new-cap
        width: w,
        left: l,
        height: h,
        top: t,
        ease: window.Power4.easeOut,
        force3D: true
      });
      arrTweens.push(tw);
      div.style.display = 'block';
      div.style.zIndex = 10;
    }

    //** height  without margins
    let hhh = height - margins * (rows.length + 1);
    //** loop the rows
    for (let j = 0; j < rows.length; j++) {
      let row = layout.rows[j];
      let cl = row.columns.length;
      //** total width needed without margins
      let www = width - margins * (cl + 1);
      let prevRowH = 0;
      let prevRowT = 0;
      //** it is not the first row, get previous row height and previouw row top, for positioning
      if (j > 0) {
        prevRowH = layout.rows[j - 1].storeH;
        prevRowT = layout.rows[j - 1].storeT;
      }

      //** loop the columns
      for (let i = 0; i < cl; i++) {
        let column = row.columns[i];
        let prevColumnW = this.getPrevColumnW(i, row);
        let prevColumnL = this.getPrevColumnL(i, row);

        //** get component from refs and set it visible.
        let comp = this.refs[column.id];
        comp.visible = true;

        //**get div and calculate size and position
        let div = comp.node;
        let w = (www * column.w) / 100;
        let rowH = (hhh * row.h) / 100;
        let h;
        //** optional column height. in case the component need to be higher, in height, than his row
        //** if parameter h (optional) is set in layout
        if (column.h) {
          h = (hhh * column.h) / 100 + margins;//TODO make this dynamic. now works only for one column
        } else {
          h = rowH;
        }
        //** optional left position, in case there is a compnent longer than his row, we can control the left of any component
        let optionalL = 0;
        if (column.l) {
          optionalL = (www * column.l) / 100;
        }
        let l = margins + prevColumnW + prevColumnL + optionalL;
        let t = margins + prevRowH + prevRowT;
        //** dont set h if we are in auto.
        if (row.h === 'auto') {
          h = div.offsetHeight;
          var tw = new TweenMax.to(div, 1, { // eslint-disable-line new-cap
            width: w,
            left: l,
            top: t,
            ease: window.Power4.easeOut,
            force3D: true
          });
        } else {
          var tw = new TweenMax.to(div, 1, { // eslint-disable-line new-cap
            width: w,
            left: l,
            height: h,
            top: t,
            ease: window.Power4.easeOut,
            force3D: true
          });
        }
        //** store for next loop positioning
        comp.storeW = w;
        comp.storeL = l;
        row.storeH = rowH;
        if (row.h === 'auto') {
          row.storeH = h;
        }
        row.storeT = t;
        //** get max h
        if (columnSizeCalculator[j]) {
          //** get just the biggest column
          if (columnSizeCalculator[j] < h) {
            columnSizeCalculator[j] = h;
          }
        } else {
          columnSizeCalculator[j] = h;
        }
        //** save last t and last H to add border bottom, in case of scroll
        var lastT = t;
        var lastH = h;
        div.style.display = 'block';
        //** save all tweens in the arr for TimelineMax
        arrTweens.push(tw);

        let sizeWillUpdate = comp.sizeWillUpdate;
        if (sizeWillUpdate) {
          comp.sizeWillUpdate(w, h, isResize);
        }
      }
    }
    //** sum all rows height
    for (let i in columnSizeCalculator) {
      totalH = totalH + columnSizeCalculator[i];
    }
    //** if sum of all heights is bigger than available space, add a border at the bottom, to follow the margin pattern
    if (totalH > hhh) {
      this.bottom.style.position = 'absolute';
      this.bottom.style.height = margins + 'px';
      this.bottom.style.top = lastT + lastH + 'px';
    } else {
      this.bottom.style.position = 'absolute';
      this.bottom.style.height = 0 + 'px';
      this.bottom.style.top = lastT + lastH + 'px';
    }
    //** remove the not defined component in the layout or show
    for (let m in this.refs) {
      if (!this.refs[m].visible) {
        let div = this.refs[m].node;
        TweenMax.to(div, .5, {
          autoAlpha: 0,
          onComplete: this.divHidden,
          onCompleteParams: [div]
        });
        this.refs[m].visible = false;
      } else {
        let div = this.refs[m].node;
        TweenMax.to(div, .5, {
          autoAlpha: 1
        });
      }
    }

    //** layout is ready to go
    let movesTl = new window.TimelineMax(layoutTlArgs);
    movesTl
        .add(arrTweens);
    movesTl.play();
  }

  getPrevColumnW(i, row) {
    //** it is not the first column, get previous column width and previous column left, for positioning
    if (i > 0) {
      let prevColumn = row.columns[i - 1];
      return this.refs[prevColumn.id].storeW;
    }
    return 0;
  }
  getPrevColumnL(i, row) {
    //** it is not the first column, get previous column width and previous column left, for positioning
    if (i > 0) {
      let prevColumn = row.columns[i - 1];
      return this.refs[prevColumn.id].storeL;
    }
    return 0;
  }
  divHidden(div) {
    div.style.display = 'none';
  }
  layoutUpdated() {
    //** signal sent to all components that need to know when layout has been updated
    dispatchManager.dispatch(dispatchManager.flags.LAYOUT_UPDATED);
  }
  render() {
    return (
      <div
        ref={(element) => {
          this.node = element;
        }}
        className={style.dashboardLayout}>
        {React.Children.map(this.props.children, (element, idx) => {
          return React.cloneElement(element, {
            ref: element.props.id
          });
        })}
        <div
          ref={(element) => {
            this.bottom = element;
          }}
          className={style.bottom}></div>
      </div>
    );
  }

}

export default DashboardLayout;
