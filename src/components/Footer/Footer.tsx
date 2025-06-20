import classNames from 'classnames';
import { SetStateAction } from 'react';
import { Filter } from '../../types/Filter';

type Props = {
  filterName: string;
  handleFilter: (value: string) => void;
  setFilterName: React.Dispatch<SetStateAction<string>>;
  countOfNotCompletedTodos: () => number;
};

export const Footer: React.FC<Props> = ({
  filterName,
  setFilterName,
  handleFilter,
  countOfNotCompletedTodos,
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
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => {}}
      >
        Clear completed
      </button>
    </footer>
  );
};
