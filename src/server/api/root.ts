import { newsRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { openingRouter } from "./routers/opening";
import { foodRouter } from "./routers/food";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  news: newsRouter,
  user: userRouter,
  opening: openingRouter,
  food: foodRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
