import Link from "next/link";
import { GetServerSideProps } from "next";
import { redirectToLogin } from "@/utils/redirect";
import {
  getNextAuthServerSession,
  getUserIdFromSeesion,
} from "@/utils/session";
import AppLayout from "@/layout/Layout";
import OutletContainer from "@/layout/OutletContainer";
import { listTodosForUser } from "@/svc/backend.client";
import NotificationCard from "@/components/NotificationCard/NotificationCard";
import { Alert, Box, Button, Typography } from "@mui/material";
import ToDoListImage from "../assets/to-do-list.svg";

type HomePageProps = {
  environment: string;
  pendingCount: number;
  error: boolean;
};

export const getServerSideProps = (async (context: any) => {
  const session = await getNextAuthServerSession(context);
  if (!session) {
    return redirectToLogin();
  }
  try {
    const todos = await listTodosForUser(getUserIdFromSeesion(session)!);
    const pendingCount = todos.filter((todo) => !todo.completed).length;
    return {
      props: {
        pendingCount,
        error: false,
        environment: process.env.ENV_NAME || "",
      },
    };
  } catch (error) {
    console.log("getServerSideProps", error);
    return {
      props: {
        pendingCount: 0,
        error: true,
        environment: process.env.ENV_NAME || "",
      },
    };
  }
}) satisfies GetServerSideProps<HomePageProps>;

export default function HomePage(props: HomePageProps) {
  if (props.error) {
    return (
      <AppLayout>
        <OutletContainer>
          <Alert severity="error">Something went wrong</Alert>
        </OutletContainer>
      </AppLayout>
    );
  }
  return (
    <AppLayout>
      <OutletContainer>
        <Box textAlign="center">
          <Typography variant="h4">Welcome to Todo App</Typography>
          <Typography variant="h6">Deployed on: {props.environment}</Typography>
        </Box>
        {props.pendingCount > 0 && (
          <NotificationCard
            imgUrl={ToDoListImage}
            title={`You have a total of 
                            ${props.pendingCount} 
                            pending todo 
                            ${props.pendingCount === 1 ? "item" : "items"}.
                         `}
            description={
              <Link href="/todos">
                <Button variant="outlined">View all</Button>
              </Link>
            }
          />
        )}
        {props.pendingCount === 0 && (
          <NotificationCard
            title="You have no pending todo items."
            description={
              <Link href="/todos">
                <Button variant="outlined">Create new one</Button>
              </Link>
            }
            imgUrl={ToDoListImage}
          />
        )}
      </OutletContainer>
    </AppLayout>
  );
}
