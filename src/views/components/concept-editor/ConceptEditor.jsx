import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { 
  Alert, Button, Jumbotron, Well,
  Grid, Row, Col,
  Popover, Tooltip, Modal,
  FormGroup, FormControl, ControlLabel
} from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form';
import { FormInputField, FormInputFieldArray, FAIcon } from 'src/views/components/util';

import _ from 'lodash';

// class ConceptTagEditor extends Component {
//   static propTypes = {
//     concept: PropTypes.object.isRequired
//   };

//   renderTags({ fields, meta: { touched, error } }) {
    
//   }

//   render() {
//     // data
//     const { concept } = this.props;
//     let tags = concept.tags;

//     // actions
//     const renderTags = this.rendeTrags.bind(this);
//     const updateTags = (tags) => {
//       concept.tags = tags;
//       this.props.notifyChange(concept);
//     };
//     const onEnterAdd = evt => {
//       const val = evt.target.value;
//       if (evt.key === 'Enter') {
//         // add tag
//         tags = Object.assign({}, tags);
//         tags[val] = val;
//         if (!concept.tags) {
//           concept.tags = tags;
//         }

//         // reset "new tag" input field
//         evt.preventDefault();
//         evt.target.value = "";

//         updateTags(tags);
//       }
//     };
//     const updateTag = (tagId) => (evt) => {
//       const val = evt.target.value;
//       tags = Object.assign({}, tags);
//       if (!_.isString(val) || val.length === 0) {
//         // delete empty tag
//         delete tags[tagId];
//       }
//       else {
//         // update!
//         delete tags[tagId];
//         tags[val] = val;
//       }
//       updateTags(tags);
//     };

//     let key = 0;
//     const tagEls = _.map(tags, (tag, tagId) => {
//       const name = 'concept.tags.' + tagId;
//       return (<Field className="form-control" 
//         key={++key} id={name} name={name}
//         type="text"
//         component="input"
//         onChange={ updateTag(tagId) } />
//       );
//     });

//     // create elements
//     return (<FormInputFieldArray name="concept.description_en" label="Description (English)"
//       component={renderTags}
//       inputProps={{type: 'text'}}
//       labelProps={{xs: 2}} inputColProps={{xs: 10}}
//     />);

//       <FormGroup controlId="newTag">
//       <Col componentClass={ControlLabel} xs={2}>
//         Tags
//       </Col>
//       <Col xs={10}>
//         <input className="form-control" 
//           placeholder="enter new tag"
//           type="text"
//           name="newTag" onKeyPress={onEnterAdd} />
//         { tagEls }
//       </Col>
//     </FormGroup>);
//   }
// }

//  see: http://redux-form.com/6.4.1/examples/simple/
class _ConceptEditor extends Component {
  static propTypes = {
    //concept: PropTypes.object.isRequired,
    busy: PropTypes.bool,
    conceptId: PropTypes.string,
    concept: PropTypes.object
  };

  render() {
    // data
    const { busy, conceptId, concept } = this.props;
    const { 
      handleSubmit, pristine, reset, submitting, values
    } = this.props;
    const num = concept && concept.num || 0;

    // actions
    function onSubmit(...args) {
      reset();
      handleSubmit(...args);
    };

    // elements
    //const tagsEl = this.TagElements(concept);

    // render go!
    return (
      <form className="form-horizontal" onSubmit={onSubmit}>
        <Field name="conceptId" value={conceptId} component="input" type="hidden" />
        <Field name="concept.parentId" value={concept.parentId} component="input" type="hidden" />
        <Field name="concept.ownerId" value={concept.ownerId} component="input" type="hidden" />
        <Field name="concept.num" value={num} component="input" type="hidden" />
        <FormInputField name="concept.title_en" label="Title (English)"
          type="text" component="input"
          labelProps={{xs: 2, className: 'no-padding'}}
          inputColProps={{xs: 10, className: 'no-padding'}}
        />
        <FormInputField name="concept.title_zh" label="Title (中文)"
          type="text" component="input"
          labelProps={{xs: 2, className: 'no-padding'}}
          inputColProps={{xs: 10, className: 'no-padding'}}
        />
        <FormInputField name="concept.description_en" label="Description (English)"
          component="textarea"
          inputProps={{rows: '5'}}
          labelProps={{xs: 2, className: 'no-padding'}}
          inputColProps={{xs: 10, className: 'no-padding'}}
        />
        <FormInputField name="concept.description_zh" label="Description (中文)"
          component="textarea"
          inputProps={{rows: '5'}}
          labelProps={{xs: 2, className: 'no-padding'}}
          inputColProps={{xs: 10, className: 'no-padding'}}
        />

        <div>
          <Button type="submit" disabled={pristine || submitting || busy}>
            {(!concept ?
              (<span><FAIcon name="plus" className="color-green" /> add</span>):
              (<span><FAIcon name="upload" className="color-green" /> save</span>)
            )}
          </Button>
          <Button disabled={pristine || submitting || busy} onClick={reset}>reset</Button>
        </div>
      </form>
    );
  }
}

_ConceptEditor = reduxForm({ enableReinitialize: true })(_ConceptEditor);

const ConceptEditor = connect(
  (state, { conceptId, concept }) => {
    return ({
      form: 'concept_editor_' + conceptId,
      initialValues: {
        conceptId,
        concept: concept || {}
      },
    });
  }
)(_ConceptEditor);

export default ConceptEditor;



export class AddConceptEditor extends Component {
  static propTypes = {
    busy: PropTypes.bool.isRequired,
    addConcept: PropTypes.func.isRequired
  }

  render() {
    const { busy, addConcept } = this.props;

    return (<div>
      <hr />
      <ConceptEditor busy={busy} onSubmit={addConcept}></ConceptEditor>
      <hr />
    </div>);
  }
}