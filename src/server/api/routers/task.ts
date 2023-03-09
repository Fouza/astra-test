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
      await ctx.prisma.task.delete({ where: { id } });
      return id;
    }),
  edit: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        data: z.object({
          complete: z.boolean().optional(),
          text: z.string().min(1).optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;
      const todo = await ctx.prisma.task.update({
        where: { id },
        data,
      });
      return todo;
    }),
  //   byId: publicProcedure
  //     .input(z.string().cuid())
  //     .mutation(async ({ ctx, input: id }) => {
  //       const task = await ctx.prisma.task.findFirst({ where: { id } });
  //       return task;
  //     }),
});
