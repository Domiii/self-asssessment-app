import React, { PropTypes } from 'react';
import { List } from 'immutable';
import TaskItem from '../task-item';
import { Jumbotron } from 'react-bootstrap';


function TaskList({deleteTask, tasks, updateTask}) {
  let taskItems = tasks.map((task, index) => {
    return (
      <TaskItem
        deleteTask={deleteTask}
        key={index}
        task={task}
        updateTask={updateTask}
      />
    );
  });

  return (
    <Jumbotron>
      {taskItems}
    </Jumbotron>
  );
}

TaskList.propTypes = {
  deleteTask: PropTypes.func.isRequired,
  tasks: PropTypes.instanceOf(List).isRequired,
  updateTask: PropTypes.func.isRequired
};

export default TaskList;
