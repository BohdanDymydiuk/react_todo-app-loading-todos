import classNames from 'classnames';
import React from 'react';

interface Props {
  counter: number;
  filter: string;
  allSelected: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  activeSelected: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  completedSelected: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  removeSelected: (event: React.FocusEvent<HTMLAnchorElement>) => void;
}

export const Footer: React.FC<Props> = React.memo(
  ({
    counter,
    filter,
    allSelected,
    activeSelected,
    completedSelected,
    removeSelected,
  }) => {
    return (
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
    );
  },
);

Footer.displayName = 'Footer';
