import { TRPCError } from "@trpc/server";
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
      let openingFoods = await ctx.db.openingFoods.findMany({
        where: {
          openingId: {
            in: openings.map((opening) => opening.id),
          },
        },
      });
      let foods = await ctx.db.food.findMany({
        where: {
          id: {
            in: openingFoods.map((openingFood) => openingFood.foodId),
          },
        },
      });
      return {
        openings: openings.map((opening) => {
          return {
            ...opening,
            foods: foods.filter((food) =>
              openingFoods.find(
                (openingFood) =>
                  openingFood.openingId === opening.id &&
                  openingFood.foodId === food.id,
              ),
            ),
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
        })),
      });
      return opening;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      let opening = await ctx.db.opening.findUnique({
        where: { id: input.id },
      });
      if (!opening) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      await ctx.db.openingFoods.deleteMany({
        where: {
          openingId: opening.id,
        },
      });
      await ctx.db.opening.delete({
        where: { id: input.id },
      });
    }),
});
