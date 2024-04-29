import { useState } from "react";
import Stack from "@mui/material/Stack";
import AddTodo from "../components/AddTodo/AddTodo";
import Loader from "../components/Loader/Loader";
import ErrorBanner from "../components/ErrorBanner/ErrorBanner";
import TodoList from "../components/TodoList/TodoList";
import TodoOptions from "../components/TodoOptions/TodoOptions";
import Typography from "@mui/material/Typography";
import { useGetTodos } from "../apis/todos";

function TodoListPage() {
  const [showCompleted, setShowCompleted] = useState(false);

  const { data, isLoading, error } = useGetTodos(showCompleted);

  const showCompletedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowCompleted(event.target.checked);
  };

  const renderTodoList = () => {
    if (isLoading) {
      return <Loader />;
    }

    if (error) {
      return <ErrorBanner message="Failed to load todo items" />;
    }

    return <TodoList todoItems={data?.allTodos} />;
  };

  return (
    <Stack spacing={2} sx={{ m: 1 }}>
      <Typography variant="h4" align="center">
        Todo List
      </Typography>
      <AddTodo />

      <TodoOptions
        showCompleted={showCompleted}
        onShowCompletedChange={showCompletedHandler}
      />
      {renderTodoList()}
    </Stack>
  );
}

export default TodoListPage;
