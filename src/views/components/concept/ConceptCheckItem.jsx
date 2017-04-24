import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { 
  Alert, ListGroupItem, ListGroup, ButtonGroup, Button,
  OverlayTrigger, Tooltip
} from 'react-bootstrap';
import { Flex, Item } from 'react-flex';
import { SimpleGrid, FormInputField, FAIcon } from 'src/views/components/util';

import { ConceptCheckResponseTypes } from 'src/core/concepts';

import { EmptyObject } from 'src/util';

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
    const { conceptId, checkId, check, updateCheckResponse } = this.props;
    const responses = ConceptCheckResponseTypes.default.byName;

    const response = responses[responseName];
    if (response) {
      // store response!
      updateCheckResponse(conceptId, checkId, !!check, response);
    }

    ReactDOM.findDOMNode(this.refs['check-'+responseName]).blur();  // blur it
  }

  get ResponsesEl() {
    const { lookupLocalized } = this.context;
    const { 
      selectedResponse,
      responseDetails
    } = this.props;

    const responseCategories = ConceptCheckResponseTypes.default.list;

    const responseEls = _.map(responseCategories, ({category, responses}, iCategory) => {
      const buttonEls = _.map(responses, (response) => {
        const responseName = response.name;

        const tooltip = (
          <Tooltip className="in" id="tooltip">
            { lookupLocalized(response, 'title') || '' }
          </Tooltip>
        );

        const selections = selectedResponse && selectedResponse.selected;
        return (
          <OverlayTrigger key={responseName} placement="bottom" overlay={tooltip}>
            <Button 
              bsSize="large"
              active={ selections && selections[category] === responseName }
              bsStyle={ response.bsStyle || 'default' }
              ref={ 'check-'+responseName }
              onClick={ this.onCheckReponseClick.bind(this, responseName) }
              className={'concept-check-response-button no-padding ' + (response.className || '')}>
              { response.icon && <FAIcon name={response.icon} /> }
            </Button>
          </OverlayTrigger>
        );
      });

      return (<span key={ category }>
        <ButtonGroup
          className="concept-check-response-buttons">
          { buttonEls }
        </ButtonGroup>
        { iCategory < responseCategories.length-1 && <span className="margin-half" /> }
      </span>);
    });

    return (<div className="max-width inline-hcentered">
      { responseEls }
    </div>);
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

    const styleOverride = !check && { backgroundColor: 'lightgray' } || EmptyObject;

    return (
      <ListGroupItem className="no-padding">
        <ListGroup className="no-margin concept-check">
          <ListGroupItem style={styleOverride} className="concept-check-description">
            { check && lookupLocalized(check, 'title') || '' }
            { !check && '<deleted check>' }
          </ListGroupItem>
          <ListGroupItem className="no-padding" style={styleOverride}>
            { this.ResponsesEl }
          </ListGroupItem>
        </ListGroup>
      </ListGroupItem>
    );
  }
}