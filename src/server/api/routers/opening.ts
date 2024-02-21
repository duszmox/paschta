import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const openingRouter = createTRPCRouter({
  getOpenings: publicProcedure
    .input(z.object({ start: z.number() }))
    .query(async ({ input, ctx }) => {
      let openings = await ctx.db.opening.findMany({
        skip: input.start,
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
      });
      let count = await ctx.db.opening.count();
      let foods = await ctx.db.food.findMany({
        where: {
          OpeningFoods: {
            some: {
              openingId: {
                in: openings.map((opening) => opening.id),
              },
            },
          },
        },
      });
      return {
        openings: openings.map((opening) => {
          return {
            ...opening,
            foods: foods,
          };
        }),
        count: count as number,
      };
    }),
  createOpening: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        acceping: z.boolean(),
        foods: z.array(z.string()),
        close: z.date(),
        open: z.date(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      let opening = await ctx.db.opening.create({
        data: {
          title: input.title,
          description: input.description,
          acceping: input.acceping,
          close: input.close,
          open: input.open,
        },
      });
      let foods = await ctx.db.food.findMany({
        where: {
          id: {
            in: input.foods,
          },
        },
      });
      await ctx.db.openingFoods.createMany({
        data: foods.map((food) => ({
          openingId: opening.id,
          foodId: food.id,
          opening: {
            connect: {
              id: opening.id,
            },
          },
          food: {
            connect: {
              id: food.id,
            },
          },
        })),
      });
      return opening;
    }),
});
