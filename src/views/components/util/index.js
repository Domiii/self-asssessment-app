import React from 'react';

// Online demo: https://codepen.io/Domiii/pen/mOaGWG?editors=0010
export class FAIcon extends React.Component {
  static propTypes = {
    name: React.PropTypes.string.isRequired,
    spinning: React.PropTypes.bool,
    childProps: React.PropTypes.object
  };

  render() {
    let classes = "fa fa-" + this.props.name + (!!this.props.className && (' ' + this.props.className) || '');
    if (this.props.spinning) {
      classes += ' fa-spin';
    }
    return (
    <i className={classes} aria-hidden="true" {...this.props.childProps}>
      {this.props.children}
    </i>);
  }
}