import React, { useEffect, useState } from "react";
import { News, User } from "@prisma/client";
import { api } from "~/utils/api";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import { useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";
import Markdown from "react-markdown";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Fira_Sans } from "next/font/google";

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});
interface NewsWUser extends News {
  user: User;
}
function NewsComp() {
  const [currentPage, setCurrentPage] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  const [news, setNews] = useState<NewsWUser[]>([]);
  const { data: session } = useSession();
  const [source, setSource] = useState("");
  const [title, setTitle] = useState("");
  const [isMutating, setIsMutating] = useState(false);
  const newsQuery = api.news.list.useQuery({
    start: currentPage * 10,
  });

  const newsAddMutation = api.news.create.useMutation({
    onMutate: () => {
      setIsMutating(true);
    },
    onSuccess: () => {
      setTitle("");
      setSource("");
      newsQuery.refetch().catch((err) => console.log(err));
    },
    onError: (data) => {
      // setError(data.message);
      console.log(data.message);
    },
    onSettled: () => {
      setIsMutating(false);
    },
  });

  useEffect(() => {
    if (newsQuery.data) {
      setNews(newsQuery.data.news as NewsWUser[]);
      setMaxPage(Math.ceil(newsQuery.data.count / 10));
    }
  }, [newsQuery.data, currentPage]);

  return (
    <div className="my-8">
      {!newsQuery.data || isMutating ? (
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
        <>
          {session?.user.id != null ? (
            <AlertDialog>
              <AlertDialogTrigger className="mb-4 ml-auto flex max-w-none">
                <Button
                  variant="outline"
                  className="ml-auto flex items-center border-black bg-dark p-2 pl-1 align-middle text-orange-50"
                >
                  <AddIcon></AddIcon>
                  <span>Új hír</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent
                className={firaSans.className + " border-bg bg-orange-50"}
              >
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-2xl underline">
                    Új Hír
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-800">
                    <div className="mb-2 grid w-full items-center gap-1.5">
                      <Label htmlFor="title" className="text-lg font-bold">
                        Hír Címe
                      </Label>
                      <Input
                        type="text"
                        id="title"
                        placeholder="Hír címe..."
                        className="select-none"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                      />
                    </div>
                    <div className=" grid w-full items-center gap-1.5">
                      <Label htmlFor="title" className="text-lg font-bold">
                        Hír tartalma
                      </Label>
                      <textarea
                        className="... placeholder:opacityp-80 min-h-32 w-full select-none p-2"
                        placeholder="Markdown leírás"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        autoFocus
                      />
                    </div>

                    <article className="w-full pt-5 ">
                      <p className="text-lg">Markdown Preview</p>
                      <Markdown className="prose min-w-full !text-black ">
                        {source.length > 0
                          ? source
                          : "*Enter some md in the container above to preview it here.*"}
                      </Markdown>
                    </article>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-orange-50 bg-orange-50 hover:bg-bg">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-primary hover:bg-dark"
                    disabled={title.length < 1 || source.length < 1}
                    onClick={() => {
                      if (title.length > 0 && source.length > 0) {
                        newsAddMutation.mutateAsync({
                          title: title,
                          content: source,
                        });
                      }
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : null}
          {news.map((news) => (
            <>
              <div
                key={news.id}
                className="mb-4 flex min-w-[40rem] max-w-none flex-col rounded-lg border border-dark bg-orange-50 px-4 py-3"
              >
                <div className="text-xl font-bold">{news.title}</div>
                <hr className="mr-4 border-[0.5px] border-dark bg-dark" />
                <div className="mt-2 flex flex-row space-x-2">
                  <div className="center flex flex-row items-center text-sm">
                    <PersonIcon
                      className="align-middle text-primary"
                      fontSize="small"
                    ></PersonIcon>{" "}
                    {news.user.name}
                  </div>
                  <div className="center flex flex-row items-center text-sm">
                    <ScheduleIcon
                      className="align-middle text-primary"
                      fontSize="small"
                    ></ScheduleIcon>{" "}
                    {news.createdAt.toDateString()}
                  </div>
                </div>
                <article className="mt-2 w-full">
                  <Markdown className="prose min-w-full !text-black ">
                    {news.description}
                  </Markdown>
                </article>
              </div>
            </>
          ))}
        </>
      )}
    </div>
  );
}

export default NewsComp;
