import { DEFAULT_POSTS_LIMIT } from "~/constants";
import { api } from "~/utils/api";

export const usePosts = (userId = "") => {
  const { data, ...rest } = api.posts.getPosts.useInfiniteQuery(
    {
      limit: DEFAULT_POSTS_LIMIT,
      userId,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return {
    posts: data?.pages.flatMap((item) => item.items) || [],
    ...rest,
  };
};
