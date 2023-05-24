import Image from "next/image";
import Link from "next/link";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import type { RouterOutputs } from "~/utils/api";
import { PROFILE_IMG_SIZE } from "~/constants";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getPosts"]["items"][number];

export const PostView = ({ post, author }: PostWithUser) => {
  const createdAtText = ` · ${dayjs(post.createdAt).fromNow()}`;

  return (
    <div className="flex gap-3 border-b border-slate-400 p-4">
      <Image
        src={author.profileImageUrl}
        className="h-14 w-14 rounded-full"
        alt={`@${author.username}'s profile picture`}
        width={PROFILE_IMG_SIZE}
        height={PROFILE_IMG_SIZE}
        priority={true}
      />
      <div className="flex flex-col">
        <div className="flex gap-1 text-slate-300">
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username} `}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">{createdAtText}</span>
          </Link>
        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
    </div>
  );
};
