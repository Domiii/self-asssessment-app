import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import ScratchMarkdown from 'src/views/components/scratch/ScratchMarkdown';

export default class ProblemPreview extends Component {
  static propTypes = {
    problemId: PropTypes.string.isRequired,
    problem: PropTypes.object.isRequired
  };

  render() {
    // data
    const { problemId, problem } = this.props;
    const description = problem.description_en || problem.description_zh;

    // render!
    return (
      <ScratchMarkdown text={description} />
    );
  }
}