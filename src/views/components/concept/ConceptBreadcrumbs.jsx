import React, { Component, PropTypes } from 'react';

import { Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router';
import { hrefConceptView } from 'src/views/href';

export default class ConceptBreadcrumbs extends Component {
  static contextTypes = {
    lookupLocalized: PropTypes.func.isRequired
  };

  static propTypes = {
    ownerConcepts: PropTypes.object,
    currentConceptId: PropTypes.string,
  };

  makeBreadcrumbs() {
    const { lookupLocalized } = this.context;
    const { ownerConcepts, currentConceptId } = this.props;

    let iteratorConceptId = currentConceptId, concept;
    const items = [];
    while (iteratorConceptId && (concept = ownerConcepts[iteratorConceptId])) {
      const title = lookupLocalized(concept, 'title');

      // we are nesting a Link in the Item, and set active to always be true
      //    because, for some reason the default link handler triggers a page reload
      const itemEl = currentConceptId === iteratorConceptId ? 
        title :
        (<Link to={ hrefConceptView(concept.ownerId, iteratorConceptId) }>
          {title}
        </Link>);

      items.push(
        <Breadcrumb.Item 
          key={iteratorConceptId}
          //href={hrefConceptView(concept.ownerId, iteratorConceptId)}
          active={ true }>
          { itemEl }
        </Breadcrumb.Item>
      );

      iteratorConceptId = concept.parentId;
    }
    items.push(<Breadcrumb.Item 
        key={1}
        active={ true }>
        <Link to="/" >
          All
        </Link>
      </Breadcrumb.Item>
    );

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