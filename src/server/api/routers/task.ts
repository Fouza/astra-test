import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const taskRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.task.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
  }),
  add: publicProcedure
    .input(
      z.object({
        id: z.string().optional(),
        title: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.prisma.task.create({
        data: input,
      });
      return todo;
    }),
  delete: publicProcedure
    .input(z.string().cuid())
    .mutation(async ({ ctx, input: id }) => {
      console.log("3", id);
      await ctx.prisma.task.delete({ where: { id } });
      return id;
    }),
});
