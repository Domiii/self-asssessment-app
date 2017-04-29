import React, { Component, PropTypes } from 'react';
import {
  Alert, Button, Jumbotron, Well,
  Grid, Row, Col
} from 'react-bootstrap';
import { Flex, Item } from 'react-flex';
import { FAIcon } from 'src/views/components/util';

export default class ConceptResponse extends Component {
  static propTypes = {
    conceptResponse: PropTypes.object,
    updateConceptResponse: PropTypes.func
  };

  render() {
    const { conceptResponse, updateConceptResponse } = this.props;

    return (
      <Well>
        <span>TODO: Add redux form for conceptResponse</span>
      </Well>
    );
  }
}