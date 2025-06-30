import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { SetStateAction } from 'react';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  filteredTodos: Todo[];
  isHover: boolean;
  tempTodo: Todo | null;
  deletedTodoId: number | null;
  setIsHover: React.Dispatch<SetStateAction<boolean>>;
  handleDelete: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  isHover,
  tempTodo,
  deletedTodoId,
  setIsHover,
  handleDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map((todo: Todo) => (
        <TodoItem
          key={todo.id}
          isHover={isHover}
          todo={todo}
          deletedTodoId={deletedTodoId}
          setIsHover={setIsHover}
          handleDelete={handleDelete}
        />
      ))}
      {tempTodo && (
        <div
          data-cy="Todo"
          className={classNames('todo', { completed: tempTodo.completed })}
          key={tempTodo.id}
        >
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
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
    </section>
  );
};
