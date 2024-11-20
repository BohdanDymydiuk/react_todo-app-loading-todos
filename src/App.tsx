/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [value, setValue] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [counter, setCounter] = useState<number>(0);
  const [filter, setFilter] = useState<string>('All');
  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case 'All':
          return todo;
        case 'Active':
          return todo.completed === false;
        case 'Completed':
          return todo.completed;
        default:
          return todo;
      }
    });
  }, [filter, todos]);

  const [error, setError] = useState<string>('');

  useEffect(() => {
    setTimeout(() => {
      getTodos()
        .then(_todos => setTodos(_todos))
        .catch(() => {
          setError('Unable to load todos');

          setTimeout(() => setError(''), 3000);
        });
    }, 100);
  }, []);

  useEffect(() => {
    let counter2: number = 0;

    if (todos.length > 0) {
      todos.forEach(todo => {
        if (todo.completed === false) {
          counter2++;
        }
      });
    }

    setCounter(counter2);
  }, [todos]);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (value.length === 0) {
      setError('Title should not be empty');
    }

    setTimeout(() => setError(''), 3000);
  }

  function allSelected(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const { target } = event;

    setFilter('All');

    if (target instanceof HTMLAnchorElement) {
      target.classList.add('selected');
    }
  }

  function activeSelected(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const { target } = event;

    setFilter('Active');

    if (target instanceof HTMLAnchorElement) {
      target.classList.add('selected');
    }
  }

  function completedSelected(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const { target } = event;

    setFilter('Completed');

    if (target instanceof HTMLAnchorElement) {
      target.classList.add('selected');
    }
  }

  function removeSelected(event: React.FocusEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const { target } = event;

    if (target instanceof HTMLAnchorElement) {
      target.classList.remove('selected');
    }
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={onSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={value}
              onChange={event => setValue(event.target.value)}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {/* This todo is an active todo */}
          {filteredTodos.map(todo => {
            const { id, title, completed } = todo;

            return (
              <div
                data-cy="Todo"
                key={id}
                className={classNames('todo', { completed: completed })}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    defaultChecked={completed ? true : false}
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                >
                  ×
                </button>
                {/* 'is-active' class puts this modal on top of the todo */}
                <div data-cy="TodoLoader" className="modal overlay">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            );
          })}

          {/* This form is shown instead of the title and remove button */}
          {/* <form>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value="Todo is being edited now"
              />
            </form> */}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {counter} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filter === 'All',
                })}
                data-cy="FilterLinkAll"
                onClick={allSelected}
                onBlur={removeSelected}
              >
                All
              </a>

              <a
                href="#/active"
                className="filter__link"
                data-cy="FilterLinkActive"
                onClick={activeSelected}
                onBlur={removeSelected}
              >
                Active
              </a>

              <a
                href="#/completed"
                className="filter__link"
                data-cy="FilterLinkCompleted"
                onClick={completedSelected}
                onBlur={removeSelected}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: error.length === 0 },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {/* Unable to load todos
        <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
        {error}
      </div>
    </div>
  );
};
