import TodoListItem from "./TodoListItem";
import List from "@mui/material/List";
import Paper from "@mui/material/Paper";
import { Todo } from "../../types/types";

interface TodoListProps {
  todoItems: Todo[];
}

function TodoList(props: TodoListProps) {
  return (
    <Paper>
      <List sx={{ bgcolor: "background.paper" }}>
        {props.todoItems.map((todoItem, index) => {
          return (
            <TodoListItem
              key={todoItem.id}
              id={todoItem.id}
              title={todoItem.title}
              description={todoItem.description}
              done={todoItem.done}
              divider={index < props.todoItems.length - 1}
            />
          );
        })}
      </List>
    </Paper>
  );
}

export default TodoList;
