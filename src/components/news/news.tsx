import React, { useEffect, useState } from "react";
import { News, User } from "@prisma/client";
import { api } from "~/utils/api";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PersonIcon from "@mui/icons-material/Person";

interface NewsWUser extends News {
  user: User;
}
function NewsComp() {
  const [currentPage, setCurrentPage] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  const [news, setNews] = useState<NewsWUser[]>([]);

  const newsQuery = api.news.list.useQuery({
    start: currentPage * 10,
  });

  useEffect(() => {
    if (newsQuery.data) {
      setNews(newsQuery.data.news as NewsWUser[]);
      setMaxPage(Math.ceil(newsQuery.data.count / 10));
    }
  }, [newsQuery.data, currentPage]);
  if (!newsQuery.data)
    return (
      <div role="status" className="my-8">
        <svg
          aria-hidden="true"
          className="fill-primary text-light inline h-8 w-8 animate-spin"
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
    );

  return (
    <div className="my-8">
      {news.map((news) => (
        <div
          key={news.id}
          className="border-dark flex min-w-[40rem] max-w-none flex-col rounded-lg border bg-orange-50 px-4 py-3"
        >
          <div className="text-xl font-bold">{news.title}</div>
          <hr className="bg-dark border-dark mr-4 border-[0.5px]" />
          <div className="mt-2 flex flex-row space-x-2">
            <div className="center flex flex-row items-center text-sm">
              <PersonIcon
                className="text-primary align-middle"
                fontSize="small"
              ></PersonIcon>{" "}
              {news.user.name}
            </div>
            <div className="center flex flex-row items-center text-sm">
              <ScheduleIcon
                className="text-primary align-middle"
                fontSize="small"
              ></ScheduleIcon>{" "}
              {news.createdAt.toDateString()}
            </div>
          </div>
          <div className="mt-2">{news.description}</div>
        </div>
      ))}
    </div>
  );
}

export default NewsComp;
