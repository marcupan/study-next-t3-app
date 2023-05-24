import type { GetStaticProps, NextPage } from "next";
import Image from "next/image";
import Head from "next/head";

import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { PageLayout } from "~/components/PageLayout";
import { PostsFeed } from "~/components/PostsFeed";
import { PROFILE_IMG_SIZE_LG } from "~/constants";
import { api } from "~/utils/api";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (!data) {
    return <div>404</div>;
  }

  return (
    <>
      <Head>
        <title>{data.username ?? data.externalUsername}</title>
      </Head>
      <PageLayout>
        <div className="flex-1">
          <div className="relative h-24 bg-slate-600">
            <Image
              src={data.profileImageUrl}
              alt={`${
                data.username ?? data.externalUsername ?? "unknown"
              }'s profile pic`}
              width={PROFILE_IMG_SIZE_LG}
              height={PROFILE_IMG_SIZE_LG}
              className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-black bg-black"
            />
          </div>
          <div className="h-[64px]"></div>
          <div className="p-4 text-2xl font-bold">{`@${
            data.username ?? data.externalUsername ?? "unknown"
          }`}</div>
          <div className="w-full border-b border-slate-400" />
        </div>

        <PostsFeed userId={data.id} />
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const slug = context.params?.slug;

  if (typeof slug !== "string") {
    throw new Error("no slug");
  }

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
