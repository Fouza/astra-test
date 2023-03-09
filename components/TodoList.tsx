import { useState } from "react";
import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "~/server/api/root";
import { api } from "~/utils/api";

type Task = inferProcedureOutput<AppRouter["task"]["all"]>;

export default function TodoList({ todos }: { todos: Task }) {
  const [newTodo, setNewTodo] = useState("");
  const utils = api.useContext();
  console.log(todos);
  const addTask = api.task.add.useMutation({
    async onMutate({ title }) {
      await utils.task.all.cancel();
      const tasks = todos;
      utils.task.all.setData(undefined, [
        ...tasks,
        {
          id: `${Math.random()}`,
          title: title,
          complete: false,
          //   text,
          createdAt: new Date(),
        },
      ]);
    },
  });

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-4 text-center text-3xl font-bold">To-Do List</h1>
      <form onSubmit={() => addTask.mutate({ title: newTodo })}>
        <div className="flex items-center border-b border-b-2 border-teal-500 py-2">
          <input
            type="text"
            placeholder="Add a new to-do"
            className="mr-3 w-full appearance-none border-none bg-transparent py-1 px-2 leading-tight text-gray-700 focus:outline-none"
            value={newTodo}
            onChange={(event) => setNewTodo(event.target.value)}
          />
          <button
            type="submit"
            className="focus:shadow-outline rounded bg-blue-500 py-1 px-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
          >
            Add
          </button>
        </div>
      </form>
      {todos.length === 0 ? (
        <p className="mt-4 text-center">No to-dos yet!</p>
      ) : (
        <ul className="mt-4">
          {todos.map((todo, index) => (
            <li key={index} className="flex items-center py-2">
              <span className="mr-2 text-gray-700">{index + 1}.</span>
              <span className="flex-grow text-gray-700">{todo.title}</span>
              {/* <button
                className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                // onClick={() => handleDelete(index)}
              >
                Delete
              </button> */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
