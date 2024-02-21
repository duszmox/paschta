import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import NavBar from "~/components/navigation-bar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/utils/api";

function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [room, setRoom] = useState<number | null>(null);
  const [user, setUser] = useState<User>();
  if (status === "unauthenticated") {
    router.push("/api/auth/signin");
  }
  let userQuery = api.user.getUser.useQuery({
    id: session?.user.id ?? "",
  });
  let userMutation = api.user.updateUser.useMutation({
    onSuccess: () => {
      userQuery.refetch().catch((err) => console.log(err));
    },
    onError: (data) => {
      console.log(data.message);
    },
  });
  useEffect(() => {
    if (session) {
      setName(session.user.name ?? "");
      userQuery.refetch().catch(() => {
        router.push("/api/auth/signin");
      });
    }
  }, [session]);
  useEffect(() => {
    if (userQuery.data) {
      setUser(userQuery.data);
      setRoom(userQuery.data.room);
    }
  }, [userQuery.data]);
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
          {!session || !user ? (
            <div role="status" className="">
              <svg
                aria-hidden="true"
                className="inline h-8 w-8 animate-spin fill-primary text-light"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            <div className="w-[45rem] rounded-md border border-dark bg-orange-50 p-4">
              <div className="flex justify-between">
                <div className="grid w-full max-w-xs items-center gap-1.5">
                  <Label htmlFor="email">Név</Label>
                  <Input
                    type="name"
                    id="name"
                    placeholder={"Név..."}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid w-full max-w-xs items-center gap-1.5">
                  <Label htmlFor="email">E-mail cím</Label>
                  <Input
                    type="email"
                    id="email"
                    placeholder={session.user.email ?? "Not available"}
                    disabled
                  />
                </div>
              </div>
              <div className="mt-5 flex justify-between">
                <div className="grid w-full max-w-xs items-center gap-1.5">
                  <Label htmlFor="email">SCH Szoba</Label>
                  <Input
                    type="text"
                    id="room"
                    inputMode="numeric"
                    placeholder={"1919"}
                    value={room ?? undefined}
                    pattern="[0-9\s]"
                    maxLength={4}
                    onChange={(e) => {
                      if (e.target.value === "") {
                        setRoom(null);
                        return;
                      }
                      setRoom(parseInt(e.target.value));
                    }}
                    onKeyDown={(event) => {
                      if (
                        !/[0-9]/.test(event.key) &&
                        event.key !== "Backspace" &&
                        event.key !== "Delete" &&
                        event.key !== "ArrowLeft" &&
                        event.key !== "ArrowRight" &&
                        event.key !== "ArrowUp" &&
                        event.key !== "ArrowDown" &&
                        event.key !== "Escape" &&
                        event.key !== "Enter" &&
                        event.key !== "Tab"
                      ) {
                        event.preventDefault();
                      }
                    }}
                  />
                </div>
              </div>
              <div className="flex">
                {" "}
                <Button
                  className="ml-auto bg-primary transition-all duration-150 hover:bg-dark"
                  disabled={name === user.name && room === user?.room}
                  onClick={() => {
                    userMutation.mutate({
                      id: session.user.id,
                      name: name,
                      room: room,
                    });
                  }}
                >
                  Mentés
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default Profile;
