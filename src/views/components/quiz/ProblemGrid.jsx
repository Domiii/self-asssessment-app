import React, { Component, PropTypes } from 'react';
import { 
  Alert, Button, Jumbotron, Well,
  Grid, Row, Col,
  Popover, Tooltip
} from 'react-bootstrap';
import { SimpleGrid, FormInputField, FAIcon } from 'src/views/components/util';

import {
  ProblemViewSmall
} from 'src/views/components/quiz';

export default class ProblemGrid extends Component {
  static propTypes = {
    busy:  PropTypes.bool.isRequired,
    quizId: PropTypes.string.isRequired, 
    problems: PropTypes.object.isRequired,
    mayEdit: PropTypes.bool.isRequired,
    updateProblem: PropTypes.func.isRequired,
    deleteProblemId: PropTypes.func.isRequired
  };

  render() {
    const { 
      busy, quizId, problems, mayEdit, updateProblem, deleteProblemId
    } = this.props;

    // actions
    const keyOrder = key => problems[key] && problems[key].num;

    // prepare props
    const problemProps = _.mapValues(problems, 
      (problem, problemId) => ({
        busy,
        problemId,
        problem,
        mayEdit,
        updateProblem,
        deleteProblemId
      })
    );

    // create grid
    return (<SimpleGrid objects={problems} 
      keyOrder={keyOrder}
      rowProps={{
        className:'show-grid', 
        style: {
          display: 'flex',
          flexWrap: 'wrap'
      }}}
      colProps={{
        className: 'no-padding',
        style: {
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          border: '1px black solid'
      }}}
      nCols={3}
      objectComponentCreator={(key, value) => {
        return (
          <ProblemViewSmall key={key} {...problemProps[key]}/>
        );
      }}
    >
    </SimpleGrid>);
  }
}