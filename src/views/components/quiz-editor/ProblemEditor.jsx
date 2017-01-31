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

// class ProblemTagEditor extends Component {
//   static propTypes = {
//     problem: PropTypes.object.isRequired
//   };

//   renderTags({ fields, meta: { touched, error } }) {
    
//   }

//   render() {
//     // data
//     const { problem } = this.props;
//     let tags = problem.tags;

//     // actions
//     const renderTags = this.rendeTrags.bind(this);
//     const updateTags = (tags) => {
//       problem.tags = tags;
//       this.props.notifyChange(problem);
//     };
//     const onEnterAdd = evt => {
//       const val = evt.target.value;
//       if (evt.key === 'Enter') {
//         // add tag
//         tags = Object.assign({}, tags);
//         tags[val] = val;
//         if (!problem.tags) {
//           problem.tags = tags;
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
//       const name = 'problem.tags.' + tagId;
//       return (<Field className="form-control" 
//         key={++key} id={name} name={name}
//         type="text"
//         component="input"
//         onChange={ updateTag(tagId) } />
//       );
//     });

//     // create elements
//     return (<FormInputFieldArray name="problem.description_en" label="Description (English)"
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
class _ProblemEditor extends Component {
  static propTypes = {
    //quiz: PropTypes.object.isRequired,
    busy: PropTypes.bool,
    problemId: PropTypes.string,
    problem: PropTypes.object
  };

  render() {
    // data
    const { busy, problemId, problem } = this.props;
    const { 
      handleSubmit, pristine, reset, submitting, values
    } = this.props;
    const num = problem && problem.num || 0;

    // actions
    function onSubmit(...args) {
      reset();
      handleSubmit(...args);
    };

    // elements
    //const tagsEl = this.TagElements(problem);

    // render go!
    return (
      <form className="form-horizontal" onSubmit={onSubmit}>
        <Field name="problemId" value={problemId} component="input" type="hidden" />
        <Field name="problem.num" value={num} component="input" type="hidden" />
        <FormInputField name="problem.title_en" label="Title (English)"
          type="text" component="input"
          labelProps={{xs: 2, className: 'no-padding'}}
          inputColProps={{xs: 10, className: 'no-padding'}}
        />
        <FormInputField name="problem.title_zh" label="Title (中文)"
          type="text" component="input"
          labelProps={{xs: 2, className: 'no-padding'}}
          inputColProps={{xs: 10, className: 'no-padding'}}
        />
        <FormInputField name="problem.description_en" label="Description (English)"
          component="textarea"
          inputProps={{rows: '5'}}
          labelProps={{xs: 2, className: 'no-padding'}}
          inputColProps={{xs: 10, className: 'no-padding'}}
        />
        <FormInputField name="problem.description_zh" label="Description (中文)"
          component="textarea"
          inputProps={{rows: '5'}}
          labelProps={{xs: 2, className: 'no-padding'}}
          inputColProps={{xs: 10, className: 'no-padding'}}
        />

        <div>
          <Button type="submit" disabled={pristine || submitting || busy}>
            {(!problem ?
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

_ProblemEditor = reduxForm({ enableReinitialize: true })(_ProblemEditor);

const ProblemEditor = connect(
  (state, { problemId, problem }) => {
    return ({
      form: 'problem_editor_' + problemId,
      initialValues: {
        problemId,
        problem: problem || {}
      },
    });
  }
)(_ProblemEditor);

export default ProblemEditor;