import { BasicUserInfo, useAuthContext } from "@asgardeo/auth-react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { NewTodo, Todo } from "../types/types";

const REMAINING_TODOS_QUERY = `
  {
    allTodos(done: false) {
      id
      title
      description
      done
      userId
    }
  }
`;

const ALL_TODOS_QUERY = `
  {
    allTodos {
      id
      title
      description
      done
      userId
    }
  }
`;

export const useGetTodos = (showCompleted: boolean) => {
  const { getAccessToken, refreshAccessToken } = useAuthContext();
  return useQuery(["get-todos", showCompleted], async () => {
    return fetchGraphQL(showCompleted ? ALL_TODOS_QUERY : REMAINING_TODOS_QUERY, {}, getAccessToken, refreshAccessToken);
  });
};

const CREATE_TODO_MUTATION = `
  mutation ($title: String!, $description: String!){
    createTodo(todoInput: {title: $title, description: $description}) {
      id
      title
      description
      done
      userId
    }
  }
`;

export const useCreateTodo = () => {
  const { getAccessToken, refreshAccessToken } = useAuthContext();
  const queryClient = useQueryClient();
  return useMutation(
    async (newTodo: NewTodo) => {
      return fetchGraphQL(CREATE_TODO_MUTATION, newTodo, getAccessToken, refreshAccessToken);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("get-todos");
      },
    }
  );
};

const DONE_TODO_MUTATION = `
  mutation ($id: Int!, $done: Boolean!){
    setDone(done: $done, id: $id) {
      id
      title
      description
      done
      userId
    }
  }
`;

export const useDoneTodo = () => {
  const { getAccessToken, refreshAccessToken } = useAuthContext();
  const queryClient = useQueryClient();
  return useMutation(
    async (updatedTodo: Todo) => {
      return fetchGraphQL(DONE_TODO_MUTATION, updatedTodo, getAccessToken, refreshAccessToken);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("get-todos");
      },
    }
  );
};


const fetchGraphQL = async (query: string, variables: any, getAccessToken: () => Promise<string>, refreshAccessToken: () => Promise<BasicUserInfo>) => {
  const token = await getAccessToken();
  return fetch(window.config.todoApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  }).then((response) => {
    if (response.status >= 400) {
      if (response.status === 401) {
        refreshAccessToken();
      }
      return response.json().then((data) => {
        throw new Error(`Error fetching data from graphql: ${JSON.stringify(data)}`);
      });
    } else {
      return response.json();
    }
  }).then((data) => data.data);
}
