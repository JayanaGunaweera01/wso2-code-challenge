import { useState } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { useDoneTodo } from "../../apis/todos";
import { Todo } from "../../types/types";

interface TodoListItemProps extends Todo {
  divider: boolean;
}

function TodoListItem(props: TodoListItemProps) {
  const [done, setDone] = useState(props.done);
  const doneTodoMutation = useDoneTodo();
  const handleDone = (event: React.ChangeEvent<HTMLInputElement>) => {
    const doneState = event.target.checked;
    const updatedTodo = {
      id: props.id,
      title: props.title,
      description: props.description,
      done: doneState,
    };
    doneTodoMutation.mutate(updatedTodo, {
      onSuccess: () => {
        setDone(doneState);
      },
    });
  };

  return (
    <Box>
      <ListItem>
        <Checkbox checked={done} onChange={handleDone} />
        <ListItemText
          primary={props.title}
          secondary={props.description}
          sx={{ textDecoration: done ? "line-through" : "none" }}
        />
      </ListItem>
      {props.divider ? <Divider /> : null}
    </Box>
  );
}

export default TodoListItem;
