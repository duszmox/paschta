import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Fira_Sans } from "next/font/google";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Footer from "~/components/footer";

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <main className={firaSans.className + " h-full bg-bg"}>
        <Component {...pageProps} />
        <Footer></Footer>
      </main>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
