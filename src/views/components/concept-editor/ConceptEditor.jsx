import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { 
  Alert, Button, Jumbotron, Well,
  Grid, Row, Col,
  FormGroup, FormControl,
  ListGroup, ListGroupItem
} from 'react-bootstrap';
import { 
  Field, reduxForm, FormSection, FieldArray
} from 'redux-form';
import { FormInputField, FormInputFieldArray, FAIcon } from 'src/views/components/util';
import { ConceptCheckDeleteModal } from 'src/views/components/concept-editor/ConceptDeleteModal';

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

class ConceptSection extends FormSection {
  static defaultProps = {
    name: 'concept'
  };

  static propTypes = {
    conceptId: PropTypes.string,
    concept: PropTypes.object
  };

  render() {
    const { conceptId, concept } = this.props;
    const num = concept && concept.num || 0;
    const parentId = concept && concept.parentId || null;
    const ownerId = concept && concept.ownerId || null;

    return (<div>
      <Field name="parentId" value={parentId} component="input" type="hidden" />
      <Field name="ownerId" value={ownerId} component="input" type="hidden" />
      <FormInputField name="title_en" label="Title (English)"
        type="text" component="input"
        labelProps={{xs: 2, className: 'no-padding'}}
        inputColProps={{xs: 10, className: 'no-padding'}}
      />
      <FormInputField name="title_zh" label="Title (中文)"
        type="text" component="input"
        labelProps={{xs: 2, className: 'no-padding'}}
        inputColProps={{xs: 10, className: 'no-padding'}}
      />
      <FormInputField name="description_en" label="Description (English)"
        component="textarea"
        inputProps={{rows: '5'}}
        labelProps={{xs: 2, className: 'no-padding'}}
        inputColProps={{xs: 10, className: 'no-padding'}}
      />
      <FormInputField name="description_zh" label="Description (中文)"
        component="textarea"
        inputProps={{rows: '5'}}
        labelProps={{xs: 2, className: 'no-padding'}}
        inputColProps={{xs: 10, className: 'no-padding'}}
      />
      <FormInputField name="num" label="Order"
        type="text" component="input"
        labelProps={{xs: 2, className: 'no-padding'}}
        inputColProps={{xs: 10, className: 'no-padding'}}
      />
    </div>);
  }
}

class ConceptCheck extends Component {
  render() {
    const { check, remove } = this.props;

//console.log(`${check}.title_en`);
    //return ();
  }
}

class ConceptChecksSection extends FormSection {
  static defaultProps = {
    name: 'checks'
  };

  static propTypes = {
    checks: PropTypes.object,
    addConceptCheck: PropTypes.func.isRequired,
    deleteConceptCheck: PropTypes.func.isRequired
  };

  get AddCheckButton() {
    const { addConceptCheck } = this.props;

    return (
      <Button block active={false}
        bsStyle="success" bsSize="small" onClick={addConceptCheck}>
        <FAIcon name="plus" className="color-green" /> add new check
      </Button>
    );
  }

  DeleteCheckButton(conceptCheckId, conceptCheck) {
    const { deleteConceptCheck } = this.props;
    const modalProps = {
      conceptCheckId, conceptCheck, deleteConceptCheck
    };

    return (
      <ConceptCheckDeleteModal {...modalProps}  />
    );
  }

  render() {
    const { checks } = this.props;

    // TODO: Use FieldArray for this
    // see: http://redux-form.com/6.1.1/examples/fieldArrays/

    const checkEls = _.map(checks,
      (check, key) => (
        //<ConceptCheck key={index} removeCheck={removeCheck.bind(this, index)} check={check} />
        <ListGroupItem key={key}>
          <FormInputField name={`${key}.title_en`} label="Check description (EN)"
            type="text" component="input"
            labelProps={{xs: 2, className: 'no-padding'}}
            inputColProps={{xs: 10, className: 'no-padding'}}
          />
          <FormInputField name={`${key}.title_zh`} label="Check description (中文)"
            type="text" component="input"
            labelProps={{xs: 2, className: 'no-padding'}}
            inputColProps={{xs: 10, className: 'no-padding'}}
          />
          <FormInputField name={`${key}.num`} label="Num"
            type="text" component="input"
            labelProps={{xs: 2, className: 'no-padding'}}
            inputColProps={{xs: 10, className: 'no-padding'}}
          />
          { this.DeleteCheckButton(key, check) }
        </ListGroupItem>
      )
    );

    return (<div>
      <ListGroup className="no-margin">
        {checkEls}
      </ListGroup>
      { this.AddCheckButton }
    </div>);
  }
}

//  see: http://redux-form.com/6.4.1/examples/simple/
class _ConceptEditor extends Component {
  static propTypes = {
    //concept: PropTypes.object.isRequired,
    busy: PropTypes.bool,
    conceptId: PropTypes.string,
    concept: PropTypes.object,
    conceptChecks: PropTypes.any,
    addConceptCheck: PropTypes.func,
    deleteConceptCheck: PropTypes.func
  }

  render() {
    // data
    const {
      busy, conceptId, concept, conceptChecks,
      addConceptCheck, deleteConceptCheck
    } = this.props;
    const { 
      handleSubmit, reset, pristine, submitting, values
    } = this.props;

    // actions
    function onSubmit(...args) {
      handleSubmit(...args);
      reset();
    };

    // elements
    //const tagsEl = this.TagElements(concept);

    // render go!
    return (
      <form className="form-horizontal" onSubmit={onSubmit}>
        <Field name="conceptId" value={conceptId} component="input" type="hidden" />
        <ConceptSection {...{ conceptId, concept }} />

        {addConceptCheck &&
          <ConceptChecksSection {...{ checks: conceptChecks, addConceptCheck, deleteConceptCheck }} /> 
        }

        <div className ="margin" />

        <div>
          <Button type="submit" disabled={pristine || submitting || busy}>
            {(!concept ?
              (<span><FAIcon name="plus" className="color-green" /> add</span>):
              (<span><FAIcon name="upload" className="color-green" /> apply</span>)
            )}
          </Button>
          <div className="margin" />
          <Button disabled={pristine || submitting || busy} onClick={reset}>reset</Button>
        </div>
      </form>
    );
  }
}

_ConceptEditor = reduxForm({ enableReinitialize: true })(_ConceptEditor);

const ConceptEditor = connect(
  (state, { conceptId, concept, conceptChecks }) => {
    return ({
      form: 'concept_editor_' + conceptId,
      initialValues: {
        conceptId,
        concept: concept || {},
        checks: conceptChecks
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