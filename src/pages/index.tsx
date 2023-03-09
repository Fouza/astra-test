import { inferProcedureOutput } from "@trpc/server";
import Home from "containers/Home";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import "tailwindcss/tailwind.css";
import { AppRouter } from "~/server/api/root";
import Link from "next/link";

import { api } from "~/utils/api";

type Task = inferProcedureOutput<AppRouter["task"]["all"]>;

function TodoList({ items }: { items: Task }) {
  const utils = api.useContext();
  const deleteTask = api.task.delete.useMutation({
    async onMutate(id) {
      await utils.task.all.cancel();
      console.log("2", id);
      const allTasks = utils.task.all.getData();
      if (!allTasks) {
        return;
      }
      utils.task.all.setData(
        undefined,
        allTasks.filter((t) => t.id != id)
      );
    },
  });

  const editTask = api.task.edit.useMutation({
    async onMutate({ id, data }) {
      await utils.task.all.cancel();
      const allTasks = utils.task.all.getData();
      if (!allTasks) {
        return;
      }
      utils.task.all.setData(
        undefined,
        allTasks.map((t) =>
          t.id === id
            ? {
                ...t,
                ...data,
              }
            : t
        )
      );
    },
  });

  return (
    <ul className="mt-4 mb-20 grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-1">
      {items.map((item) => (
        <li
          key={item.id}
          className={`${
            item.complete ? "bg-teal-100" : "bg-white"
          } flex flex-col overflow-hidden rounded-lg shadow-lg`}
        >
          <div className="grid grid-cols-5 items-center justify-between gap-4 p-6 sm:grid-cols-5 md:grid-cols-5">
            <div className="col-span-3">
              <div className="mt-2 block">
                <p className="overflow-hidden text-ellipsis text-xl font-semibold text-gray-900">
                  {item.title}
                </p>
                {/* <p className="mt-3 text-base text-gray-500">
                  {item.description}
                </p> */}
              </div>
            </div>
            <div className="col-span-2">
              <div className="flex items-center justify-center">
                <Link
                  href={`/task/${item.id}`}
                  as={`/task/${item.id}`}
                  className="mr-1 whitespace-nowrap rounded bg-gray-400 py-2 px-4 text-xs text-white hover:bg-gray-600"
                >
                  Details
                </Link>
                {!item.complete && (
                  <button
                    onClick={() => {
                      editTask.mutate({
                        id: item.id,
                        data: { complete: true },
                      });
                    }}
                    className="mr-1 whitespace-nowrap rounded bg-green-800 py-2 px-4 text-xs text-white hover:bg-green-600"
                  >
                    Mark as done
                  </button>
                )}
                <button
                  onClick={() => {
                    deleteTask.mutate(item.id);
                  }}
                  className="float-right text-red-500 hover:text-red-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 20 20"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            {/* <div className="mt-6 flex items-center">
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {item.author}
                </p>
              </div>
            </div> */}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function Todo() {
  const todos = api.task.all.useQuery(undefined, {
    staleTime: 3000,
  });
  const utils = api.useContext();
  const addTask = api.task.add.useMutation({
    async onMutate({ title }) {
      await utils.task.all.cancel();
      const tasks = todos.data ?? [];
      utils.task.all.setData(undefined, [
        ...tasks,
        {
          id: `${Math.random()}`,
          //   completed: false,
          title,
          complete: false,
          createdAt: new Date(),
        },
      ]);
    },
  });

  const [newTodo, setNewTodo] = useState("");
  return (
    <div className="px-8">
      <h1 className="py-4 text-center text-4xl font-bold text-gray-800">
        Welcome to the to do list
      </h1>
      <div className="mx-auto max-w-xl">
        <h1 className="mb-4 text-center text-3xl font-bold">To-Do List</h1>
        <form onSubmit={() => addTask.mutate({ title: newTodo })}>
          <div className="flex items-center border-b border-b-2 border-teal-500 py-2">
            <input
              type="text"
              placeholder="Add a new to-do"
              className="mr-3 w-full appearance-none border-none bg-transparent py-1 px-2 leading-tight text-gray-700 focus:outline-none"
              value={newTodo}
              onChange={(event) => setNewTodo(event.target.value)}
              maxLength={40}
            />
            <button
              type="submit"
              className="focus:shadow-outline rounded bg-blue-500 py-1 px-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
            >
              Add
            </button>
          </div>
        </form>
        {todos.data?.length === 0 ? (
          <p className="mt-4 text-center">No to-dos yet!</p>
        ) : (
          <TodoList items={todos.data ? todos.data : []} />
          //   <ul className="mt-4">
          //     {todos.data?.map((todo, index) => (
          //       <li key={index} className="flex items-center py-2">
          //         <span className="mr-2 text-gray-700">{index + 1}.</span>
          //         <span className="flex-grow text-gray-700">{todo.title}</span>
          //         {/* <button
          //         className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
          //         // onClick={() => handleDelete(index)}
          //       >
          //         Delete
          //       </button> */}
          //       </li>
          //     ))}
          //   </ul>
        )}
      </div>
      {/* <button
        className="bg-black text-white"
        onClick={(e) => addTask.mutate({ title: "yay1" })}
      >
        Create Example
      </button> */}
    </div>
  );
}
const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};

// export default Home;
