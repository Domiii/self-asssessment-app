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

//  see: http://redux-form.com/6.4.1/examples/simple/
class _ProblemEditor extends Component {
  static propTypes = {
    //quiz: PropTypes.object.isRequired,
    busy: PropTypes.bool,
    problemId: PropTypes.string,
    problem: PropTypes.object
  };

  constructor(...args) {
    super(...args);
    this.state = {};
  }

  TagElements(tags) {
    // data

    // actions
    const onEnterAdd = evt => {
      const val = evt.target.value;
      if (evt.key === 'Enter') {
        // add tag
        tags[val] = val;

        // reset new tag input field
        evt.preventDefault();
        evt.target.value = "";

        this.setState({dirty: (this.state.dirty || 0) + 1});
      }
    };
    const deleteEmpty = (tagId) => (evt) => {
      const val = evt.target.value;
      if (!_.isString(val) || val.length === 0) {
        // delete tag
        delete tags[tagId];
      }
    };

    const tagEls = _.map(tags, (tag, tagId) => {
      const name = 'problem.tags.' + tagId;
      return (<Field className="form-control" 
        key={name} id={name} name={name}
        onChange={ deleteEmpty(tagId) } />
      );
    });

    // create elements
    return (<FormGroup controlId="newTag">
      <Col componentClass={ControlLabel} xs={2}>
        Tags
      </Col>
      <Col xs={10}>
        <input className="form-control" 
          placeholder="enter new tag"
          type="text"
          name="newTag" onKeyPress={onEnterAdd} />
        { tagEls }
      </Col>
    </FormGroup>);
  }

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
    //problem.tags = problem && problem.tags || [];
    const tagsEl = this.TagElements(problem.tags);

    // render go!
    return (
      <form className="form-horizontal" onSubmit={onSubmit}>
        <Field name="problemId" value={problemId} component="input" type="hidden" />
        <Field name="problem.num" value={num} component="input" type="hidden" />
        <FormInputField name="problem.description_en" label="Description (English)"
          inputProps={{type: 'text', component:'input'}}
          labelProps={{xs: 2}} inputColProps={{xs: 10}}
        />
        <FormInputField name="problem.description_zh" label="Description (中文)"
          inputProps={{type: 'text', component:'input'}}
          labelProps={{xs: 2}} inputColProps={{xs: 10}}
        />

        { tagsEl }

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
export default connect(
  (state, { problemId, problem }) => {
    return ({
      form: 'problem_editor_' + problemId,
      initialValues: {
        problemId,
        problem
      }
    });
  }
)(_ProblemEditor);