import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { 
  Alert, ListGroupItem, ListGroup, ButtonGroup, Button,
  OverlayTrigger, Tooltip
} from 'react-bootstrap';
import { Flex, Item } from 'react-flex';
import { SimpleGrid, FormInputField, FAIcon } from 'src/views/components/util';

import { ConceptCheckResponseTypes } from 'src/core/concepts';


export default class ConceptCheckItem extends Component {
  static contextTypes = {
    lookupLocalized: PropTypes.func
  };
  static propTypes = {
    checkId: PropTypes.string.isRequired,
    check: PropTypes.object.isRequired,
    selectedResponse: PropTypes.object,
    updateCheckResponse: PropTypes.func.isRequired
  };

  constructor(...args) {
    super(...args);
  }

  onCheckReponse(responseName) {
    // store result
    const { checkId, updateCheckResponse } = this.props;
    const responses = ConceptCheckResponseTypes.default;

    const response = responses[responseName];
    if (response) {
      // store response!
      updateCheckResponse(checkId, responseName, response);
    }

    ReactDOM.findDOMNode(this.refs['check-'+responseName]).blur();  // blur it
  }

  get ResponsesEl() {
    const { lookupLocalized } = this.context;
    const { selectedResponse } = this.props;

    const responses = ConceptCheckResponseTypes.default;
    const responseEls = _.map(responses, (response, name) => {
      const tooltip = (
        <Tooltip className="in" id="tooltip">
          { lookupLocalized(response, 'title') || '' }
        </Tooltip>
      );
      return (
        <OverlayTrigger key={name} placement="bottom" overlay={tooltip}>
          <Button 
            bsSize="large"
            active={ selectedResponse && selectedResponse[name] }
            bsStyle={response.bsStyle || 'default'}
            ref={'check-'+name}
            onClick={ this.onCheckReponse.bind(this, name) }
            className={'concept-check-response-button no-padding ' + (response.className || '')}>
            {response.icon && <FAIcon name={response.icon} /> }
          </Button>
        </OverlayTrigger>
      );
    });
    return (
      <ButtonGroup className="max-width concept-check-response-buttons">
        {responseEls}
      </ButtonGroup>
    );
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

    return (
      <ListGroupItem className="no-padding">
        <ListGroup className="no-margin">
          <ListGroupItem>
            { lookupLocalized(check, 'title') || '' }
          </ListGroupItem>
          <ListGroupItem className="no-padding">
            { this.ResponsesEl }
          </ListGroupItem>
        </ListGroup>
      </ListGroupItem>
    );
  }
}