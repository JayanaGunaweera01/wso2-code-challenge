import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
} from "@mui/material";
import { on } from "events";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

export function TodoAddForm({ onAdd }: { onAdd: () => void }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [serverError, setServerError] = useState(false);
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const response = await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({ title, description }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      onAdd();
      router.push("/todos");
    } else {
      setServerError(true);
    }
  };
  return (
    <Box>
      {serverError && <Alert severity="error">Something went wrong</Alert>}
      <Card variant="outlined">
        <CardContent>
          <Box p={3}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={5}>
                  <TextField
                    id="todo-add-title"
                    label="Task Name"
                    variant="outlined"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={5}>
                  <TextField
                    id="todo-add-description"
                    label="Description"
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item flexGrow={1}>
                  <Button
                    disabled={title.length == 0}
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
