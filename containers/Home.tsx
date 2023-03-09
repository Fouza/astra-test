import Head from "next/head";
import Link from "next/link";
import { type NextPage } from "next";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Fouzi X Astrastellar</title>
        <meta
          name="description"
          content="Hello Fouzi, good luck with this test !"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 text-white ">
          <h1 className="max-w-2xl text-center text-4xl font-bold">
            To do list
          </h1>
          <div className="mt-10 text-center">
            <h2 className="text-3xl font-bold">Your mission</h2>
            <p>Fouzi, you will have to create a basic CRUD app for a todo.</p>
            <p>
              So, on this page, we want all the task already created, you can
              edit them or delete it
            </p>
            {/* <p>
              When you click on a task, you can go to a page under /task/[id]
              for instance in which you have the details of the todo (just to
              see if you master routing system)
            </p> */}
            <p>
              You have to use Prisma to manage the database which is an SQLite
              database (by default it is) and to store the todos
            </p>
            <p>
              You have to use ReactQuery to query the database route defined on
              tRPC backend under the dir /server
            </p>
            {/* <h2 className="text-2xl">
              <strong>
                That&apos;all, you can delete this whole div instructions once
                understood
              </strong>
            </h2> */}
          </div>
          {/* <div className="my-20 flex w-full max-w-3xl flex-col gap-5 text-left">
            <h3 className="text-2xl font-semibold">Todo:</h3>
            The Next of the todo here, good luck Fouzi :)
          </div> */}
        </div>
		<div className="container flex flex-col items-center justify-center gap-6 px-4 py-16">
		
		</div>
      </main>
    </>
  );
};

export default Home;
