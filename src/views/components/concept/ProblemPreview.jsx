import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import Markdown from 'src/views/components/markdown';

export default class ProblemPreview extends Component {
  static contextTypes = {
    lookupLocalized: PropTypes.func
  };

  static propTypes = {
    problemId: PropTypes.string.isRequired,
    problem: PropTypes.object.isRequired
  };

  render() {
    // data
    const { lookupLocalized } = this.context;
    const { problemId, problem } = this.props;
    const description = lookupLocalized(problem, 'description');

    // tags
    // hierarchy

    // actions

    // render!
    return (
      <Markdown source={description} />
    );
  }
}