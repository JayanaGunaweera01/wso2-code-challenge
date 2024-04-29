


export interface Todo {
    id: number;
    title: string;
    description: string;
    done: boolean;
}

export interface NewTodo {
    title: string;
    description?: string;
}
