import classNames from 'classnames';
import { SetStateAction } from 'react';
import { Filter } from '../../types/Filter';

type Props = {
  filterName: string;
  countOfCompletedTodos: () => number;
  handleFilter: (value: string) => void;
  setFilterName: React.Dispatch<SetStateAction<string>>;
  countOfNotCompletedTodos: () => number;
  handleClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  filterName,
  countOfCompletedTodos,
  setFilterName,
  handleFilter,
  countOfNotCompletedTodos,
  handleClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {countOfNotCompletedTodos()} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterName === Filter.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => {
            setFilterName(Filter.all);
            handleFilter(Filter.all);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterName === Filter.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => {
            setFilterName(Filter.active);
            handleFilter(Filter.active);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterName === Filter.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => {
            setFilterName(Filter.completed);
            handleFilter(Filter.completed);
          }}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        disabled={countOfCompletedTodos() <= 0}
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => handleClearCompleted()}
      >
        Clear completed
      </button>
    </footer>
  );
};
