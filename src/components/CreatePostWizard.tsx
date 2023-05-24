import React, { useState } from "react";
import { toast } from "react-hot-toast";

import { UserButton, useUser } from "@clerk/nextjs";
import { z } from "zod";

import { LoadingSpinner } from "~/components/Loading";
import { postSchema } from "~/validation";
import { api } from "~/utils/api";
import { PROFILE_IMG_SIZE } from "~/constants";

export const CreatePostWizard = () => {
  const { user } = useUser();

  const ctx = api.useContext();

  const [input, setInput] = useState("");
  const [error, setError] = useState<string>("");

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getPosts.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post! Please try again later.");
      }
    },
  });

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setInput(ev.target.value);
  };
  const handleKeyDown = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === "Enter") {
      ev.preventDefault();
      if (input !== "") {
        handleSubmit();
      }
    }
  };
  const handleSubmit = () => {
    try {
      postSchema.parse({ input });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0]?.message || "Validation issue");
      } else {
        setError("Validation issue");
      }
      return;
    }

    mutate({ input });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex w-full gap-3 align-middle">
      <UserButton
        afterSignOutUrl="/"
        appearance={{
          elements: {
            userButtonAvatarBox: {
              width: PROFILE_IMG_SIZE,
              height: PROFILE_IMG_SIZE,
            },
          },
        }}
      />

      <div className="flex items-center">
        <input
          placeholder="Type some text"
          className={`grow bg-transparent p-2 outline-none ${
            error && "border border-red-400"
          }`}
          type="text"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={isPosting}
        />
        {error && <p className="m-2 text-red-700">{error}</p>}
      </div>
      {input !== "" && !isPosting && (
        <button onClick={handleSubmit}>Post</button>
      )}
      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={20} />
        </div>
      )}
    </div>
  );
};
