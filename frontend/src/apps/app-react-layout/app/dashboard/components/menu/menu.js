import React, {Component} from 'react';
import MenuButton from './menu-button';
import Burger from './burger/burger';
import styles from './style.css';
import stylesBurger from './burger/style.css';
import AppConstants from './../../../app-utils/app-constants';

class Menu extends Component {
  //** avoid useless renders
  shouldComponentUpdate(nextProps) {
    //** prevent rendering on menu if no filters
    return true;
  }
  constructor(props) {
    super(props);
    this.rendered = false;
  }

  //** we are IN
  componentDidMount() {
    this.mainBurger = document.getElementById('main-burger');
    this.mainBurger.addEventListener('click', () => this.openCloseMenu());

    this.menuNode = this.node.getElementsByClassName(styles.menu)[0];
    this.backgroundNode = this.node.getElementsByClassName(styles.background)[0];

    window.addEventListener('resize', this.updateDimensions.bind(this));
    this.updateDimensions();
  }

  updateDimensions() {
    this.updateLayout(window.innerWidth, window.innerHeight);
  }
  //** resize
  updateLayout(w, h) {
    if (this.backgroundNode) {
      this.backgroundNode.style.height = h + 'px';
      this.backgroundNode.style.width = w + 'px';
    }
  }

  //** toggle to open close the menu panel
  openCloseMenu() {
    let t = this.mainBurger.classList.toggle(stylesBurger.open);
    //** if toggle is true;
    if (t) {
      //** open
      this.openFilterPanel();
    } else {
      //** close
      this.closeFilterPanel();
    }
  }

  //** open panel background window
  openFilterPanel() {
    this.menuIsOpened = true;
    TweenMax.to(this.menuNode, 1, {
      left: 0,
      ease: window.Power4.easeInOut
    });
    TweenMax.to(this.backgroundNode, 1, {
      left: 0,
      autoAlpha: .9,
      ease: window.Power4.easeInOut
    });
  }

  //** close panel background window
  closeFilterPanel() {
    this.menuIsOpened = false;
    TweenMax.to(this.menuNode, 1, {
      left: -300,
      ease: window.Power4.easeInOut
    });
    TweenMax.to(this.backgroundNode, 1, {
      // left: '-150%',
      autoAlpha: 0,
      ease: window.Power4.easeInOut
    });
  }

  //** filter from submenu has been selected. pass this info to app, for a new url request
  subMenuClicked(filter, subfilterId) {
    this.props.requestLocale(subfilterId);
    this.closeMenuPanel();
  }

  //** main button is pressed.
  buttonClicked(buttonIndex, infoClick) {
    //** if reset button (exc) don't open a submenu
    if (buttonIndex === AppConstants.RESET) {
      let urlObj = {
        filters: {
          filterId: AppConstants.RESET
        }
      };
      store.getState().default.appRef.urlRequest(urlObj);
      this.closeMenuPanel();
    } else {
      //** show sub-menu
      //** close other buttons
      let buttonClicked = this.refs['menuButton' + buttonIndex];
      for (let buttonId in this.refs) {
        let button = this.refs[buttonId];
        if (button !== buttonClicked) {
          this.closeButton(button);
        }
      }

      if (buttonClicked.opened) {
        if (infoClick) {
          //** if the click is from filter bar close the menu
          this.closeMenuPanel();
        } else {
          //** else (click is from menu itself ) close the submenu
          this.closeButton(buttonClicked);
        }

      } else {
        //** open the button menu
        this.openButton(buttonClicked);
      }
    }
  }

  //** close the menu panel
  closeMenuPanel() {
    this.mainBurger.classList.toggle(stylesBurger.open);
    this.closeFilterPanel();

    for (let buttonId in this.refs) {
      let button = this.refs[buttonId];
      this.closeButton(button);
    }
  }

  //** open sub-menu
  openButton(button) {
    TweenMax.to(button.contentOuter, .7, {
      height: button.content.offsetHeight,
      ease: window.Power4.easeOut
    });
    TweenMax.to(button.content, .5, {
      ease: window.Power4.easeOut,
      y: 0
    });
    TweenMax.to(button.plusVertical, .6, {
      rotation: 90,
      ease: window.Back.easeOut
    });
    button.opened = true;
  }

  //** close sub-menu
  closeButton(button) {
    TweenMax.to(button.contentOuter, .7, {
      height: 0,
      ease: window.Power4.easeOut
    });
    TweenMax.to(button.content, .5, {
      ease: window.Power4.easeOut,
      y: -button.content.offsetHeight
    });
    TweenMax.to(button.plusVertical, .6, {
      rotation: 0,
      ease: window.Back.easeOut
    });
    button.opened = false;
  }

  //** filter-bar action
  filterInfoClick(filterClicked) {
    if (!this.menuIsOpened) {
      //** open
      this.mainBurger.classList.toggle(stylesBurger.open);
      this.openFilterPanel();
    }
    this.buttonClicked(filterClicked, true);
  }

  //** and finally render
  render() {
    let listButtons = <div></div>;
    if (this.props.settings) {

      let tyres = this.props.settings;
      listButtons =  Object.keys(tyres).map((keyName, keyIndex) => {
        return (
          <MenuButton
            index={keyIndex}
            key = {keyIndex}
            filter = {tyres[keyName]}
            id = {keyName}
            passClick = {(buttonIndex) => this.buttonClicked(buttonIndex) }
            passSubClick = {(button, filter) => this.subMenuClicked(button, filter) }
          ></MenuButton>
        );
      });

      const resetButtonFilter = {
        label: AppConstants.RESET_ALL
      };
      const resetButton = (
        <MenuButton
          index= '11'
          key = '11'
          filter = {resetButtonFilter}
          id = {AppConstants.RESET}
          passClick = {(buttonIndex) => this.buttonClicked(buttonIndex) }
        ></MenuButton>
    );
      listButtons.push(resetButton);
    }
    this.list = listButtons;

    return (
      <div
        className={styles.menuContainer}
        ref={(element) => {
          this.node = element;
        }}>
        <Burger></Burger>
        <div className={styles.background}></div>
        <div className={styles.menu}>
          {React.Children.map(listButtons, (element, idx) => {
            return React.cloneElement(element, {
              ref: 'menuButton' + element.props.id
            });
          })}
        </div>
      </div>
    );
  }
}

export default Menu;
