import { type NextPage } from "next";

import { SignInButton, useUser } from "@clerk/nextjs";

import { CreatePostWizard } from "~/components/CreatePostWizard";
import { PageLayout } from "~/components/PageLayout";
import { PostsFeed } from "~/components/PostsFeed";

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  if (!userLoaded) {
    return <div>Invalid user</div>;
  }

  return (
    <PageLayout>
      <div className="flex border-b border-slate-400 p-4">
        {!isSignedIn && (
          <div className="flex justify-center">
            <SignInButton mode="modal">
              <button className="flex overflow-hidden rounded-lg bg-white p-3 align-middle text-black">
                Sign In
              </button>
            </SignInButton>
          </div>
        )}
        {isSignedIn && <CreatePostWizard />}
      </div>

      <PostsFeed />
    </PageLayout>
  );
};

export default Home;
