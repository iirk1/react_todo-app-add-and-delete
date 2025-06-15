/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodos, getTodos, postTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { title } from 'process';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterName, setFilterName] = useState('all');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [isHover, setIsHover] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  enum FilterBy {
    clearCompleted = 'clear completed',
    all = 'all',
    active = 'active',
    completed = 'completed',
  }

  const handleFilter = (todos?: Todo[], value: string) => {
    if (value === FilterBy.completed) {
      setTodos(allTodos.filter(todo => todo.completed));
    }

    if (value === FilterBy.all) {
      setTodos(
        allTodos.filter(todo => {
          return todo;
        }),
      );
    }

    if (value === FilterBy.active) {
      setTodos(
        allTodos.filter(todo => {
          return todo.completed === false;
        }),
      );
    }

    if (value === FilterBy.clearCompleted) {
      const activeTodos = allTodos.filter(todo => !todo.completed);

      setAllTodos(activeTodos);
      setTodos(activeTodos);
    }
  };

  const countOfNotCompletedTodos = () => {
    const filteredTodos = allTodos.filter(todo => todo.completed === false);

    return filteredTodos.length;
  };

  const handleDelete = (id: number) => {
    deleteTodos(id).then(() => {
      setAllTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    });
  };

  useEffect(() => {
    getTodos()
      .then(res => {
        setTodos(res);
        setAllTodos(res);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
    if (query.length === 0) {
      inputRef.current?.focus();
    }
  }, [query]);

  useEffect(() => {
    if (errorMessage) {
      const timeOutId = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timeOutId);
    }
  }, [errorMessage]);

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
          <form
            onSubmit={event => {
              event.preventDefault();

              if (query.trim().length === 0) {
                setErrorMessage('Title should not be empty');

                return;
              }

              setIsDisabled(true);

              const newTempTodo = {
                id: 0,
                title: query.trim(),
                userId: 2984,
                completed: false,
              };

              setTempTodo(newTempTodo);
              setIsDisabled(true);
              postTodos(query.trim())
                .then((newTodo: Todo) => {
                  setQuery('');
                  inputRef.current?.focus();
                  setAllTodos(prevTodos => {
                    const updatedTodos = [...prevTodos, newTodo];
                    // Оновлюємо фільтрований список одразу після оновлення allTodos

                    setTodos(handleFilter(updatedTodos, filterName));

                    return updatedTodos;
                  });
                })
                .catch(() => {
                  setErrorMessage('Unable to add a todo');
                  setIsDisabled(true);
                })
                .finally(() => {
                  setTempTodo(null);
                  setIsDisabled(false);
                  setTimeout(() => {
                    inputRef.current?.focus();
                  }, 0);
                });
            }}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              value={query}
              ref={inputRef}
              disabled={isDisabled}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={event => setQuery(event.target.value)}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {todos.map((todo: Todo) => {
            return (
              <div
                onMouseEnter={() => setIsHover(true)}
                data-cy="Todo"
                key={todo.id}
                className={classNames('todo', { completed: todo.completed })}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={todo.completed}
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {todo.title}
                </span>

                {/* Remove button appears only on hover */}
                <button
                  type="button"
                  className={classNames('todo__remove', {
                    'is-hidden': !isHover,
                  })}
                  data-cy="TodoDelete"
                  onClick={() => {
                    handleDelete(todo.id);
                  }}
                >
                  ×
                </button>

                {/* overlay will cover the todo while it is being deleted or updated */}
                <div data-cy="TodoLoader" className="modal overlay">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            );
          })}
          {tempTodo && (
            <div
              data-cy="Todo"
              className={classNames('todo', { completed: tempTodo.completed })}
              key={tempTodo.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  // checked={completed}
                  // onChange={onToggle}
                />
              </label>
              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                // onClick={() => handleDelete(id)}
              >
                ×
              </button>
              <div
                data-cy="TodoLoader"
                className={classNames('modal overlay', {
                  'is-active': true,
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}

          {/* This is a completed todo */}

          {/* <div data-cy="Todo" className="todo completed">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              Completed Todo
            </span> */}

          {/* Remove button appears only on hover */}
          {/* <button type="button" className="todo__remove" data-cy="TodoDelete">
              ×
            </button> */}

          {/* overlay will cover the todo while it is being deleted or updated */}
          {/* <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div> */}

          {/* This todo is an active todo */}
          {/* <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              Not Completed Todo
            </span>
            <button type="button" className="todo__remove" data-cy="TodoDelete">
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div> */}

          {/* This todo is being edited */}
          {/* <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label> */}

          {/* This form is shown instead of the title and remove button */}
          {/* <form>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value="Todo is being edited now"
              />
            </form>

            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div> */}

          {/* This todo is in loadind state */}
          {/* <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              Todo is being saved now
            </span>

            <button type="button" className="todo__remove" data-cy="TodoDelete">
              ×
            </button> */}

          {/* 'is-active' class puts this modal on top of the todo */}
          {/* <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div> */}
        </section>

        {/* Hide the footer if there are no todos */}
        {allTodos.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {countOfNotCompletedTodos()} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filterName === FilterBy.all,
                })}
                data-cy="FilterLinkAll"
                onClick={() => {
                  setFilterName(FilterBy.all);
                  handleFilter(FilterBy.all);
                }}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filterName === FilterBy.active,
                })}
                data-cy="FilterLinkActive"
                onClick={() => {
                  setFilterName(FilterBy.active);
                  handleFilter(FilterBy.active);
                }}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: filterName === FilterBy.completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => {
                  setFilterName(FilterBy.completed);
                  handleFilter(FilterBy.completed);
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
              onClick={() => {
                handleFilter(FilterBy.clearCompleted);
              }}
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
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
        {/* show only one message at a time */}

        {/* Unable to delete a todo
        <br />
        Unable to update a todo */}
      </div>
    </div>
  );
};
