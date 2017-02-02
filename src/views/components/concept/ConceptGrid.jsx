import React, { Component, PropTypes } from 'react';
import { 
  Alert, Button, Jumbotron, Well,
  Grid, Row, Col,
  Popover, Tooltip
} from 'react-bootstrap';
import { SimpleGrid, FormInputField, FAIcon } from 'src/views/components/util';

import {
  ConceptViewSmall
} from 'src/views/components/concept';

export default class ConceptGrid extends Component {
  static propTypes = {
    busy:  PropTypes.bool.isRequired,
    conceptId: PropTypes.string.isRequired, 
    concepts: PropTypes.object.isRequired,
    mayEdit: PropTypes.bool.isRequired,
    updateConcept: PropTypes.func.isRequired,
    deleteConceptId: PropTypes.func.isRequired
  };

  render() {
    const { 
      busy, conceptId, concepts, mayEdit, updateConcept, deleteConceptId
    } = this.props;

    // actions
    const keyOrder = key => concepts[key] && concepts[key].num;

    // prepare props
    const conceptProps = _.mapValues(concepts, 
      (concept, conceptId) => ({
        busy,
        conceptId,
        concept,
        mayEdit,
        updateConcept,
        deleteConceptId
      })
    );

    // create grid
    return (<SimpleGrid objects={concepts} 
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
          <ConceptViewSmall key={key} {...conceptProps[key]}/>
        );
      }}
    >
    </SimpleGrid>);
  }
}