/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodos, getTodos, postTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Notifications } from './components/Notifications/Notifications';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [query, setQuery] = useState('');
  const [filterName, setFilterName] = useState('all');
  const [errorMessage, setErrorMessage] = useState('');
  const [deletedTodoId, setDeletedTodoId] = useState<number | null>(null);

  const [isDisabled, setIsDisabled] = useState(false);
  const [isHover, setIsHover] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFilter = (value: string) => {
    if (value === Filter.completed) {
      setFilteredTodos(allTodos.filter(todo => todo.completed));
    }

    if (value === Filter.all) {
      setFilteredTodos(
        allTodos.filter(todo => {
          return todo;
        }),
      );
    }

    if (value === Filter.active) {
      setFilteredTodos(
        allTodos.filter(todo => {
          return todo.completed === false;
        }),
      );
    }
  };

  const countOfNotCompletedTodos = () => {
    const filteredTodos = allTodos.filter(todo => todo.completed === false);

    return filteredTodos.length;
  };

  const handleDelete = (id: number) => {
    setDeletedTodoId(id);
    deleteTodos(id)
      .then(() => {
        setAllTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
        setFilteredTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .finally(() => {
        setDeletedTodoId(null);
      });
  };

  useEffect(() => {
    handleFilter(filterName);
  }, [filterName, allTodos]);

  useEffect(() => {
    getTodos()
      .then(res => {
        setAllTodos(res);
        inputRef.current?.focus();
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
        setAllTodos(prevTodos => [...prevTodos, newTodo]);
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
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          handleSubmit={handleSubmit}
          query={query}
          inputRef={inputRef}
          isDisabled={isDisabled}
          setQuery={setQuery}
        />

        <TodoList
          deletedTodoId={deletedTodoId}
          filteredTodos={filteredTodos}
          isHover={isHover}
          tempTodo={tempTodo}
          setIsHover={setIsHover}
          handleDelete={handleDelete}
        />

        {allTodos.length !== 0 && (
          <Footer
            filterName={filterName}
            handleFilter={handleFilter}
            setFilterName={setFilterName}
            countOfNotCompletedTodos={countOfNotCompletedTodos}
          />
        )}

        <Notifications
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      </div>
    </div>
  );
};
