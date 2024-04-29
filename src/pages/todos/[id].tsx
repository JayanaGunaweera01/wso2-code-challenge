import AppLayout from "@/layout/Layout";
import OutletContainer from "@/layout/OutletContainer";
import { TodoResponse, getTodoByIdForUser } from "@/svc/backend.client";
import { redirectToLogin } from "@/utils/redirect";
import { getNextAuthServerSession } from "@/utils/session";
import { Alert, Box, Button, Grid, TextField } from "@mui/material";
import axios from "axios";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

type TodosItemPageProps =
  | {
      itemIdParam: string;
      todo: TodoResponse;
      error: null;
    }
  | {
      itemIdParam: string;
      todo: null;
      error: "not-found" | "internal-error";
    };

export const getServerSideProps = (async (
  context: GetServerSidePropsContext<any, any>
) => {
  let session;
  try {
    session = await getNextAuthServerSession(context);
  } catch (error) {
    return redirectToLogin();
  }
  if (!session) {
    return redirectToLogin();
  }
  const itemId = `${context.params?.id || ""}`;
  const parsedItemId = parseInt(itemId);
  if (isNaN(parsedItemId)) {
    return {
      props: {
        itemIdParam: itemId,
        error: "not-found",
        todo: null,
      },
    };
  }
  try {
    const todo = await getTodoByIdForUser(
      (session as any)?.user?.id!,
      parsedItemId
    );
    return {
      props: { todo, itemIdParam: itemId, error: null },
    };
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return {
        props: {
          itemIdParam: itemId,
          error: "not-found",
          todo: null,
        },
      };
    }
    return {
      props: {
        itemIdParam: itemId,
        error: "internal-error",
        todo: null,
      },
    };
  }
}) satisfies GetServerSideProps<TodosItemPageProps>;

function TodoDetailPage(props: TodosItemPageProps) {
  if (props.error === "not-found") {
    return (
      <AppLayout>
        <Alert>No todo item available with id {props.itemIdParam}</Alert>
      </AppLayout>
    );
  }
  if (props.error === "internal-error") {
    return (
      <AppLayout>
        <Alert>Something went wrong</Alert>
      </AppLayout>
    );
  }
  const todo = props.todo!;
  return (
    <AppLayout>
      <OutletContainer
        title={`Todo Detail for ID: ${todo.id}`}
        isLoading={false}
        breadcrumbs={[
          { label: "Home", link: "/" },
          { label: "To Do List", link: "/todos" },
          { label: todo.title, link: "#" },
        ]}
      >
        <TodoEditForm item={todo} />
      </OutletContainer>
    </AppLayout>
  );
}

export default TodoDetailPage;

function TodoEditForm({ item }: { item: TodoResponse }) {
  const router = useRouter();
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  const [serverError, setServerError] = useState(false);
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const response = await fetch(`/api/todos/${item.id}`, {
      method: "PUT",
      body: JSON.stringify({ title, description, completed: item.completed }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      router.push("/todos");
    } else {
      setServerError(true);
    }
  };
  return (
    <Box>
      <Box>
        {serverError && <Alert severity="error">Something went wrong</Alert>}
      </Box>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              id="todo-add-title"
              label="Title"
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
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
