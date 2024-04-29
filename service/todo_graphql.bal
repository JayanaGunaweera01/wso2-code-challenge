import ballerina/graphql;
import ballerina/log;

# A service representing a network-accessible GraphQL API
@graphql:ServiceConfig {
    contextInit: contextInit
}
service graphql:Service /graphql on new graphql:Listener(8090) {

    # Returns all Todo items with optionally filtered from the done status.
    # + context - GraphQL context for the request
    # + done - Optional filter to list the Todo items by done status.
    # + return - The list of Todo's.
    resource function get allTodos(graphql:Context context, boolean? done) returns Todo[] {
        string userId = getUserId(context);
        log:printInfo(string `Rquest 'query allTodos' received from user id ${userId}`);
        lock {
            Todo[] todos;
            if done is boolean {
                todos = from var todo in todoTable
                    where todo.done == done && (todo.userId == userId || todo.userId == DEFAULT_USER_ID)
                    select todo;
            } else {
                todos = from var todo in todoTable
                    where todo.userId == userId || todo.userId == DEFAULT_USER_ID
                    select todo;
            }
            return todos.cloneReadOnly();
        }
    }

    # Returns a Todo item from a given Id.
    # + context - GraphQL context for the request
    # + id - Id of the required Todo item.
    # + return - Todo item for the given Id if it exists or else returns null.
    resource function get todo(graphql:Context context, int id) returns Todo? {
        string userId = getUserId(context);
        log:printInfo(string `Rquest 'query todo' received from user id ${userId}`);
        lock {
            if todoTable[id] is Todo {
                Todo? todoItem = todoTable[id].cloneReadOnly();
                if todoItem is Todo {
                    if (todoItem.userId == userId || todoItem.userId == DEFAULT_USER_ID) {
                        return todoItem.cloneReadOnly();
                    }
                }
            }
            return;
        }
    }

    # Add a Todo item.
    # + context - GraphQL context for the request
    # + todoInput - User input for the new Todo item.
    # + return - Newly created Todo item.
    remote function createTodo(graphql:Context context, CreateTodoInput todoInput) returns Todo {
        string userId = getUserId(context);
        log:printInfo(string `Rquest 'mutate createTodo' received from user id ${userId}`);
        lock {
            int id = todoTable.length() + 1;
            Todo newTodo = {
                id: id,
                userId: userId,
                title: todoInput.title,
                done: false
            };
            if (todoInput.description is string) {
                newTodo.description = <string>todoInput.description;
            }
            todoTable.add(newTodo);
            return newTodo.cloneReadOnly();
        }
    }

    # Update the done state of a Todo item.
    # + context - GraphQL context for the request
    # + id - Id of the updating Todo item.
    # + done - Flag indicating the done status.
    # + return - updated Todo item.
    remote function setDone(graphql:Context context, int id, boolean done) returns Todo? {
        string userId = getUserId(context);
        log:printInfo(string `Rquest 'mutate setDone' received from user id ${userId}`);
        lock {
            Todo? todo = todoTable[id];
            if (todo is ()) {
                return;
            }
            if (todo.userId == userId || todo.userId == DEFAULT_USER_ID) {
                todo.done = done;
                return todo.cloneReadOnly();
            }
            return;
        }
    }
}

# Table for storing todo's in memory
isolated table<Todo> key(id) todoTable = table [
    {id: 1, userId: DEFAULT_USER_ID, title: "Meet Alice", description: "Need to discuss new requirements for the Product", done: false},
    {id: 2, userId: DEFAULT_USER_ID, title: "Buy Drinks", description: "Buy some soft drinks for the team party", done: true}
];
