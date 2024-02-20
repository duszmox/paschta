import { News } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const newsRouter = createTRPCRouter({
  list: publicProcedure
    .input(z.object({ start: z.number() }))
    .query(async ({ input, ctx }) => {
      let news = await ctx.db.news.findMany({
        skip: input.start,
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
      });
      let userIds = news.map((news) => news.userId);
      let users = await ctx.db.user.findMany({
        where: {
          id: {
            in: userIds,
          },
        },
      });
      let count = await ctx.db.news.count();
      return {
        news: news.map((news) => {
          return {
            ...news,
            user: users.find((user) => user.id === news.userId),
          };
        }),
        count: count as number,
      };
    }),
  create: protectedProcedure
    .input(z.object({ title: z.string(), content: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.news.create({
        data: {
          title: input.title,
          description: input.content,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
});
