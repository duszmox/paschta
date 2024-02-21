import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const { id } = input;
      const user = await ctx.db.user.findUnique({
        where: { id },
      });
      return user;
    }),
  updateUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        room: z.number().optional().nullable(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { id } = input;
      if (id !== ctx.session.user.id) {
        throw new Error("Unauthorized");
      }
      const user = await ctx.db.user.update({
        where: { id },
        data: input,
      });
      return user;
    }),
});
