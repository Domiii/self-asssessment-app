import map from 'lodash/map';

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {
  Alert, Badge, Button,
  OverlayTrigger, Tooltip
} from 'react-bootstrap';
import Markdown from 'src/views/components/markdown';
import { Flex, Item } from 'react-flex';
import { FAIcon } from 'src/views/components/util';

import {
  ConceptCheckResponseTypes
} from 'src/core/concepts';

import {
  //ConceptReferenceType,
  parseConceptReferences
} from 'src/core/concepts/ConceptChecksRef';

import { EmptyObject } from 'src/util';


export const ConceptReferenceSettings = {
  i: {
    name: 'Image',
    icon: '📷',
    render: src => (
      <img src={src} alt={src} />
    )
  },
  l: {
    name: 'Link',
    icon: '🔗',
    render: link => (
      <a target="_blank" rel="noopener noreferrer" href={link}>
        [link]({link})
      </a>
    )
  },
  s: {
    name: 'Search',
    icon: '🔍',
    render: q => {
      const url = 'https://www.google.com.tw/search?q=' + encodeURIComponent(q).replace('%20', '+');
      return (<a href={url}>{q}</a>);
    }
  },
  v: {
    name: 'VideoSearch',
    icon: '🎥',
    render: q => {
      const url = 'https://www.google.com.tw/search?source=lnms&tbm=vid&q=' + encodeURIComponent(q).replace('%20', '+');
      return (<a href={url}>{q}</a>);
    }
  }
};

export class ConceptReference extends Component {
  render() {
    const {
      type,
      data
    } = this.props;

    const settings = ConceptReferenceSettings[type];
    if (!settings) {
      return <Alert bsStyle="warn">invalid ref type: {type} </Alert>;
    }
    if (!type || !data) {
      return <Alert bsStyle="warn">empty reference: {type} - {data} </Alert>;
    }

    return (<span>
      &nbsp;
      <Badge className="background-lightgray concept-reference">
        {settings.icon} &nbsp;
        {settings.render(data)}
      </Badge>
    </span>);
  }
}

export default class ConceptCheckItem extends Component {
  static contextTypes = {
    lookupLocalized: PropTypes.func
  };
  static propTypes = {
    conceptId: PropTypes.string.isRequired,
    checkId: PropTypes.string.isRequired,
    check: PropTypes.object,
    selectedResponse: PropTypes.object,
    responseDetails: PropTypes.object,
    updateCheckResponse: PropTypes.func.isRequired
  };

  constructor(...args) {
    super(...args);
  }

  onCheckReponseClick(responseName) {
    // store result
    const {
      conceptId, checkId, check, updateCheckResponse
    } = this.props;
    const responses = ConceptCheckResponseTypes.default.byName;
    const response = responses[responseName];
    if (response) {
      // store response!
      updateCheckResponse(conceptId, checkId, !!check, response);
    }

    ReactDOM.findDOMNode(this.refs['check-' + responseName]).blur();  // blur it
  }

  get CheckButton() {
    const { lookupLocalized } = this.context;
    const {
      selectedResponse,
      responseDetails
    } = this.props;

    const response = ConceptCheckResponseTypes.default.byName.done;
    const responseName = 'done';

    const isDone = selectedResponse && !!selectedResponse.done || false;

    const tooltip = (
      <Tooltip className="in" id="tooltip">
        {lookupLocalized(response, 'title') || ''}
      </Tooltip>
    );

    const responseEls = (
      <OverlayTrigger placement="left" overlay={tooltip}>
        <Button
          bsSize="large"
          active={isDone}
          bsStyle={isDone ? 'success' : 'danger'}
          ref={'check-' + responseName}
          onClick={this.onCheckReponseClick.bind(this, responseName)}
          className={'concept-check-response-button no-padding '}>
          {response.icon && <FAIcon name={response.icon} />}
        </Button>
      </OverlayTrigger>
    );

    return (
      <span style={{ display: 'flex' }}>{responseEls}</span>
    );

    // TODO: revamp the complete response system

    //const responseCategories = ConceptCheckResponseTypes.default.list;

    // const responseEls = _.map(responseCategories, ({category, responses}, iCategory) => {
    //   const buttonEls = _.map(responses, (response) => {
    //     const responseName = response.name;

    //     const tooltip = (
    //       <Tooltip className="in" id="tooltip">
    //         { lookupLocalized(response, 'title') || '' }
    //       </Tooltip>
    //     );

    //     const selections = selectedResponse && selectedResponse.selected;
    //     return (
    //       <OverlayTrigger key={responseName} placement="bottom" overlay={tooltip}>
    //         <Button 
    //           bsSize="large"
    //           active={ selections && selections[category] === responseName }
    //           bsStyle={ response.bsStyle || 'default' }
    //           ref={ 'check-'+responseName }
    //           onClick={ this.onCheckReponseClick.bind(this, responseName) }
    //           className={'concept-check-response-button no-padding ' + (response.className || '')}>
    //           { response.icon && <FAIcon name={response.icon} /> }
    //         </Button>
    //       </OverlayTrigger>
    //     );
    //   });

    //   return (<span key={ category }>
    //     <ButtonGroup
    //       className="concept-check-response-buttons">
    //       { buttonEls }
    //     </ButtonGroup>
    //     { iCategory < responseCategories.length-1 && <span className="margin-half" /> }
    //   </span>);
    // });
    /*
            <Flex>
              <Item flexGrow="1" key={name}>
                {responseEls}
              </Item>
            </Flex>
    */
  }

  render() {
    const { lookupLocalized } = this.context;
    const { check } = this.props;

    const title = lookupLocalized(check, 'title');
    let contentEl;
    if (check) {
      const {
        referencesRaw
      } = check;

      const references = parseConceptReferences(referencesRaw);
      //const references = null;

      contentEl = (<div className="concept-check-content">
        {title && (
          <span>
            <Markdown source={title} />
          </span>
        )}
        {references && (
          <span>
            {map(references, (refs, type) => (
              <span key={type}>
                { map(refs, data => <ConceptReference key={data} type={type} data={data} />) }
              </span>
            ))}
          </span>
        )}
      </div>);
    }
    else {
      contentEl = (
        <span className="concept-check-deleted">
          {'<deleted check>'}
        </span>
      );
    }

    return (
      <div className="no-padding concept-check-item">
        {this.CheckButton}
        <span className="margin-half" />
        {contentEl}
      </div>
    );
  }
}