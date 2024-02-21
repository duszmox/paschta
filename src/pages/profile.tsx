import Head from "next/head";
import React from "react";
import NavBar from "~/components/navigation-bar";

function Profile() {
  return (
    <>
      <Head>
        <title>Profil | Paschta;</title>
        <meta name="description" content="Paschta; kör profil oldal" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-bg">
        <NavBar></NavBar>
        <div className="flex w-full max-w-none flex-col items-center justify-center p-8">
          <span id="title" className="mb-8 text-3xl font-semibold">
            {" "}
            Paschta; - Profil{" "}
          </span>
          <div className="w-[40rem] rounded-md border border-dark p-4">asd</div>
        </div>
      </main>
    </>
  );
}

export default Profile;
