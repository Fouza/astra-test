import { GetStaticPropsContext } from "next";
import { AppRouter } from "~/server/api/root";
import { prisma } from "~/server/db";

import { inferProcedureOutput } from "@trpc/server";

type Task = inferProcedureOutput<AppRouter["task"]["all"]>[number];

const Card = ({ task }: { task: Task }) => {
	console.log(task)
  return (
    <div className="items-center justify-center flex mt-20">
      <div className="mb-4 max-w-md rounded-lg border border-gray-300 p-6 text-center shadow-md">
        <h1 className="mb-2 text-2xl font-medium">{task.title}</h1>
        <p className="mb-4 text-xl text-gray-500">
          <strong>Description : </strong>
          {task.id}
        </p>
        <div
          className={`inline-block rounded-full px-2 py-1 text-white white-space-nowrap text-xl ${
            task.complete ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <span>{task.complete ? "Done" : "Not done"}</span>
        </div>
      </div>
    </div>
  );
};

export default function TodoDetail({ task }: { task: Task }) {
  return <Card task={task} />;
}

export const getStaticPaths = async () => {
  const tasks_ids = await prisma.task.findMany({
    select: {
      id: true,
    },
  });
  return {
    paths: tasks_ids.map((task) => ({
      params: { id: task.id },
    })),

    fallback: "blocking",
  };
};

export const getStaticProps = async (
  context: GetStaticPropsContext<{ id: string }>
) => {
  //This next 4 lines, I couldn't make them work :/
  //   const ssg = createProxySSGHelpers({
  //     router: appRouter,
  //     ctx: await createContext(),
  //     transformer: superjson,
  //   });
  const id = context.params?.id as string;
  //   const task = await ssg.task.byId.prefetch({ id });
  const task = await prisma.task.findFirst({
    where: { id },
    select: {
      id: true,
      title: true,
	  complete:true,
    },
  });
  // console.log('state', ssg.dehydrate());
  return {
    props: {
      //   trpcState: ssg.dehydrate(),
      task: task,
      //   id: context.params?.id ?? "all",
    },
    revalidate: 1,
  };
};
