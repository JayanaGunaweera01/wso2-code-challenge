import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { useCreateTodo } from "../../apis/todos";

function AddTodo() {
  const [inputTitle, setInputTitle] = useState("");
  const [inputDescription, setInputDescription] = useState("");
  const createTodoMutation = useCreateTodo();
  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputTitle === "") {
      return;
    }
    const newTodo = {
      title: inputTitle,
      description: inputDescription,
    };
    createTodoMutation.mutate(newTodo, {
      onSuccess: () => {
        setInputTitle("");
        setInputDescription("");
      },
    });
  };

  const titleChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputTitle(event.target.value);
  };

  const descriptionChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputDescription(event.target.value);
  };

  return (
    <Paper>
      <form onSubmit={submitHandler}>
        <Box sx={{ m: 1 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-evenly"
            spacing={2}
          >
            <TextField
              type="text"
              value={inputTitle}
              onChange={titleChangeHandler}
              label="Title"
              size="small"
              sx={{ flex: 2 }}
            />
            <TextField
              type="text"
              value={inputDescription}
              onChange={descriptionChangeHandler}
              label="Description"
              size="small"
              sx={{ flex: 2 }}
            />
            <Button variant="contained" type="submit" sx={{ flex: 1 }}>
              Add Todo
            </Button>
          </Stack>
        </Box>
      </form>
    </Paper>
  );
}

export default AddTodo;
