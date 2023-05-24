import React, { useRef } from "react";

import { LoadingPage } from "~/components/Loading";
import { PostView } from "~/components/PostView";
import { usePosts } from "~/hooks/usePosts";

export const PostsFeed = (props: { userId?: string }) => {
  const listRef = useRef<HTMLDivElement>(null);

  const { posts, hasNextPage, fetchNextPage, isFetching, isError } = usePosts(
    props.userId
  );

  const handleScroll = ({ currentTarget }: React.UIEvent<HTMLDivElement>) => {
    const containerHeight = currentTarget.clientHeight;
    const scrollHeight = currentTarget.scrollHeight;

    const scrollTop = currentTarget.scrollTop;

    const scrollPosition = ((scrollTop + containerHeight) / scrollHeight) * 100;

    if (scrollPosition > 90 && hasNextPage && !isFetching) {
      void fetchNextPage().then(() => {
        const lastEl = listRef.current?.lastElementChild;

        lastEl?.scrollIntoView({
          block: "end",
          inline: "nearest",
          behavior: "smooth",
        });
      });
    }
  };

  if (isError) {
    return <div>Something went wrong</div>;
  }

  return (
    <div
      ref={listRef}
      className="flex grow flex-col overflow-y-scroll"
      onScroll={handleScroll}
    >
      {posts.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}

      {isFetching && (
        <div className="flex grow">
          <LoadingPage />
        </div>
      )}
    </div>
  );
};
