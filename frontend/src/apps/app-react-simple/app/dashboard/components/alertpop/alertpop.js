import React, {Component} from 'react';
import styles from './style.css';

export default class AlertPop extends Component {
  constructor(props) {
    super(props);
    this.onClickClose = this.onClickClose.bind(this);
  }
  shouldComponentUpdate(nextProps) {
    return false;
  }
  componentWillUpdate(nextProps) {}
  call(message, timer, mood) {
    this.mood = mood;
    this.message = message;
    TweenMax.to(this.node, 1, {
      autoAlpha: 1,
      delay: .5,
      ease: window.Power4.easeOut
    });
    if (timer > -1) {
      this.close(timer);
    }
    this.forceUpdate();
  }
  close(d) {
    TweenMax.to(this.node, .5, {
      autoAlpha: 0,
      delay: d,
      ease: window.Power4.easeOut
    });
  }
  onClickClose() {
    this.close(0);
  }
  createSeasonChoice() {
    return (
      <div className={styles.messageSeason}>
        <div className={styles.messageInSeason}>
          <span>{this.message}</span>
        </div>
        <div
          className={styles.seasonBox}>
        <div
          onClick={() => {
            this.props.app.updateSeason({d: 0});
            // this.props.app.thanks();
            setTimeout(() => {
              this.props.app.goUrl(this.props.app.urlWaitSeason);
            }, 200);

          }}
          className={[styles.seasonBoxLeft, styles.seasonBoxItem].join(' ')}>
          <span>SUMMER</span>
        </div>
        <div
          onClick={() => {
            this.props.app.updateSeason({d: 1});
            // this.props.app.thanks();
            setTimeout(() => {
              this.props.app.goUrl(this.props.app.urlWaitSeason);
            }, 200);
          }}
          className={[styles.seasonBoxRight, styles.seasonBoxItem].join(' ')}>
          <span>WINTER</span>
        </div>
        </div>
      </div>
    );
  }
  createAlert() {
    return (
      <div className={styles.message}>
        <span>{this.message}</span>
      </div>
    );
  }
  render() {
    let content;
    if (this.mood === 'no-season') {
      content = this.createSeasonChoice();
    }
    if (this.mood === 'no-data') {
      content = this.createAlert();
    }
    return (
      <div
        ref={(element) => {
          this.node = element;
        }}
        id={this.props.id}
        onClick={this.onClickClose}
        className={styles.alertpopBox}>
        {content}
      </div>
    );
  }
  // }
}
