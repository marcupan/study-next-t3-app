import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { addUserDataToPosts, rateLimit } from "~/utils/posts";
import { DEFAULT_POSTS_LIMIT } from "~/constants";
import { postSchema } from "~/validation";

export const postsRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: { id: input.id },
      });

      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return (await addUserDataToPosts([post]))[0];
    }),

  getPosts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        userId: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? DEFAULT_POSTS_LIMIT;
      const { cursor, userId } = input;

      const items = await ctx.prisma.post.findMany({
        take: limit + 1,
        where: userId ? { authorId: userId } : undefined,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: [{ createdAt: "desc" }],
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items: await addUserDataToPosts(items),
        nextCursor,
      };
    }),

  create: privateProcedure
    .input(postSchema)
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const { success } = await rateLimit.limit(authorId);
      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }

      return await ctx.prisma.post.create({
        data: {
          authorId,
          content: input.input,
        },
      });
    }),
});
