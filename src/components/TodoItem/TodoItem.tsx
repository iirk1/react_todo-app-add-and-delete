import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { SetStateAction } from 'react';

type Props = {
  isHover: boolean;
  deletedTodoId: number | null;
  setIsHover: React.Dispatch<SetStateAction<boolean>>;
  handleDelete: (id: number) => void;
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({
  isHover,
  deletedTodoId,
  setIsHover,
  handleDelete,
  todo,
}) => {
  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      data-cy="Todo"
      key={todo.id}
      className={classNames('todo', { completed: todo.completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
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

      <button
        type="button"
        className={classNames('todo__remove', {
          'is-active': !isHover,
        })}
        data-cy="TodoDelete"
        onClick={() => {
          handleDelete(todo.id);
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': deletedTodoId === todo.id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
