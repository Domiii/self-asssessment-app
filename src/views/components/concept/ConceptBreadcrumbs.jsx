import React, { Component, PropTypes } from 'react';

import { Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router';

export default class ConceptBreadcrumbs extends Component {
  static contextTypes = {
    lookupLocalized: PropTypes.func.isRequired
  };

  static propTypes = {
    ownerConcepts: PropTypes.object.isRequired,
    currentConceptId: PropTypes.string.isRequired,
  };

  makeBreadcrumbs() {
    const { lookupLocalized } = this.context;
    const { ownerConcepts, currentConceptId } = this.props;

    let iteratorId = currentConceptId, concept;
    const items = [];
    while (iteratorId && (concept = ownerConcepts[iteratorId])) {
      const title = lookupLocalized(concept, 'title');
      items.push(
        <Breadcrumb.Item 
          key={iteratorId}
          href="#"
          active={currentConceptId === iteratorId}>
          {title}
        </Breadcrumb.Item>
      );

      iteratorId = concept.parentId;
    }

    return _.reverse(items);
  }

  render() {
    return (
      <Breadcrumb>
        { this.makeBreadcrumbs() }
      </Breadcrumb>
    );
  }
}