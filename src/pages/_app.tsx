import { type AppType } from "next/app";
import Head from "next/head";

import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => (
  <ClerkProvider {...pageProps}>
    <Head>
      <title>Study T3 Next</title>
      <meta name="description" content="T3 practice" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Toaster position="bottom-center" />
    <Component {...pageProps} />
  </ClerkProvider>
);

export default api.withTRPC(MyApp);
