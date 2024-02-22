import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const foodRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string(), description: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.food.create({
        data: {
          name: input.name,
          description: input.description,
        },
      });
    }),
  getSome: publicProcedure
    .input(z.object({ start: z.number() }))
    .query(async ({ input, ctx }) => {
      let foods = await ctx.db.food.findMany({
        skip: input.start,
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
      });
      let count = await ctx.db.food.count();
      return {
        foods: foods.map((food) => {
          return {
            ...food,
          };
        }),
        count: count as number,
      };
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const foods = await ctx.db.food.findMany();
    return foods;
  }),
});
