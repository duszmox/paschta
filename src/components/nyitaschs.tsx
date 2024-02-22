import React, { useEffect, useState } from "react";
import { Food, News, Opening, User } from "@prisma/client";
import { api } from "~/utils/api";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";
import Markdown from "react-markdown";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { format, min } from "date-fns";
import { cn } from "~/lib/utils";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { Fira_Sans } from "next/font/google";
import { Badge } from "./ui/badge";

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});
interface ExtendedOpening extends Opening {
  foods: Food[];
}

function NewsComp() {
  const [currentPage, setCurrentPage] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  const [openings, setOpenings] = useState<ExtendedOpening[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<Food[]>([]);
  const { data: session } = useSession();
  const [source, setSource] = useState("");
  const [title, setTitle] = useState("");
  const [accepting, setAccepting] = useState("");
  const [selectValue, setSelectValue] = useState("");
  const [isMutating, setIsMutating] = useState(false);
  const [date, setDate] = useState<Date>();
  const [openDate, setOpenDate] = useState<Date>();
  const [closeDate, setCloseDate] = useState<Date>();

  const openingQuery = api.opening.getOpenings.useQuery({
    start: currentPage * 10,
  });
  const foodQuery = api.food.getAll.useQuery();
  const newOpeningMutation = api.opening.createOpening.useMutation({
    onMutate: () => {
      setIsMutating(true);
    },
    onSuccess: () => {
      openingQuery.refetch().catch((err) => console.log(err));
    },
    onSettled: () => {
      setIsMutating(false);
    },
  });

  const deleteOpeningMutation = api.opening.delete.useMutation({
    onMutate: () => {
      setIsMutating(true);
    },
    onSuccess: () => {
      openingQuery.refetch().catch((err) => console.log(err));
    },
    onSettled: () => {
      setIsMutating(false);
    },
  });

  useEffect(() => {
    if (openingQuery.data) {
      setOpenings(openingQuery.data.openings);
      setMaxPage(Math.ceil(openingQuery.data.count / 10));
    }
  }, [openingQuery.data, currentPage]);
  useEffect(() => {
    if (foodQuery.data) {
      setFoods(foodQuery.data);
    }
  }, [foodQuery.data, currentPage]);

  return (
    <div className="my-8">
      {!openings || openingQuery.isLoading || isMutating ? (
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
              <AlertDialogTrigger
                className={
                  "mb-4 ml-auto flex max-w-none" +
                  (openings.length < 0 ? "" : " mr-auto")
                }
              >
                <Button
                  variant="outline"
                  className={
                    "ml-auto flex items-center border-black bg-dark p-2 pl-1 align-middle text-orange-50"
                  }
                  onClick={() => {
                    setTitle("");
                    setSource("");
                    setSelectValue("");
                    setSelectedFoods([]);
                    setAccepting("");
                    setDate(undefined);
                    setOpenDate(undefined);
                    setCloseDate(undefined);
                  }}
                >
                  <AddIcon></AddIcon>
                  <span>Új nyitásch</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent
                className={firaSans.className + " border-bg bg-orange-50"}
              >
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-2xl underline">
                    Új Nyitásch
                  </AlertDialogTitle>
                  <AlertDialogDescription className=" max-h-[28rem] overflow-y-auto text-gray-800">
                    <div className="mb-2 grid w-full items-center gap-1.5">
                      <Label htmlFor="title" className="text-lg font-bold">
                        Nyitásch neve
                      </Label>
                      <Input
                        type="text"
                        id="title"
                        placeholder="Nagyon menci, hiper-szuper 69. nyitás.."
                        className="select-none"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                      />
                    </div>
                    <div className=" grid w-full items-center gap-1.5">
                      <Label
                        htmlFor="title"
                        className="text-lg font-bold"
                        autoFocus
                      >
                        Nyitásch leírása
                      </Label>
                      <textarea
                        className="placeholder:opacityp-80 min-h-32 w-full select-none p-2"
                        placeholder="Markdown leírás"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                      />
                    </div>
                    <article className="w-full pt-5 ">
                      <p className="text-lg">Markdown Preview</p>
                      <Markdown className="prose mb-4 min-w-full !text-black ">
                        {source.length > 0
                          ? source
                          : "*Enter some md in the container above to preview it here.*"}
                      </Markdown>
                    </article>
                    <div>
                      <Label
                        htmlFor="title"
                        className="text-lg font-bold"
                        autoFocus
                      >
                        Ételek
                      </Label>
                      <Select
                        onValueChange={(value) => {
                          var selFoods = selectedFoods;
                          console.log(selFoods, value);
                          if (selFoods.find((food) => food.id === value)) {
                            selFoods = selFoods.filter(
                              (food) => food.id !== value,
                            );
                          } else {
                            selFoods.push(
                              foods.find((food) => food.id === value) as Food,
                            );
                          }
                          setSelectedFoods(selFoods);
                          setSelectValue("");
                          foodQuery.refetch();
                          console.log(selFoods);
                        }}
                        value={selectValue}
                      >
                        <SelectTrigger
                          className={selectedFoods.length > 0 ? "" : "italic"}
                        >
                          <p>
                            {" "}
                            {selectedFoods.length > 0
                              ? selectedFoods
                                  .map((food) => food.name)
                                  .join(", ")
                              : "Választ ki az ételeket..."}
                          </p>
                        </SelectTrigger>
                        <SelectContent className={firaSans.className}>
                          {foods.map((food) => (
                            <>
                              <SelectItem
                                key={food.id}
                                value={food.id}
                                className={firaSans.className}
                              >
                                <p
                                  className={
                                    selectedFoods.find(
                                      (selFood) => food.id === selFood.id,
                                    )
                                      ? ""
                                      : ""
                                  }
                                >
                                  {(selectedFoods.find(
                                    (selFood) => food.id === selFood.id,
                                  )
                                    ? "✓ "
                                    : "") + food.name}
                                </p>
                              </SelectItem>
                            </>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="my-4 space-x-2 ">
                      <Label
                        htmlFor="title"
                        className="text-lg font-bold"
                        autoFocus
                      >
                        Rendelések fogadása
                      </Label>
                      <Checkbox
                        value={accepting}
                        onClick={() => {
                          setAccepting(accepting === "true" ? "false" : "true");
                        }}
                      ></Checkbox>
                    </div>
                    <div className="flex flex-col">
                      <Label
                        htmlFor="title"
                        className="text-lg font-bold"
                        autoFocus
                      >
                        Nyitásch időpontja
                      </Label>
                      <div>
                        <Label
                          htmlFor="day"
                          className="text-md mr-4 font-bold"
                          autoFocus
                        >
                          Nap:
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={
                                cn(
                                  "w-[240px] justify-start text-left font-normal",
                                  !date && "text-muted-foreground",
                                ) +
                                " " +
                                firaSans.className
                              }
                            >
                              <ScheduleIcon className="mr-2 h-4 w-4" />
                              {date ? (
                                format(date, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={(date) => {
                                if (!date) return;
                                setDate(date);
                                setOpenDate(dateAtTime(date, 19, 0));
                                setCloseDate(dateAtTime(date, 22, 0));
                              }}
                              initialFocus
                              className={firaSans.className}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="flex flex-row items-center">
                        <Label
                          htmlFor="startTime"
                          className="text-md mr-4 font-bold"
                          autoFocus
                        >
                          Kezdés:
                        </Label>
                        <Select
                          onValueChange={(value) => {
                            if (!value) return;
                            setOpenDate(
                              dateAtTime(
                                date ?? new Date(),
                                parseInt(value.split(":")[0] ?? "0"),
                                parseInt(value.split(":")[1] ?? "0"),
                              ),
                            );
                          }}
                          disabled={!date}
                          defaultValue="19:00"
                        >
                          <SelectTrigger className={"w-[180px]"}>
                            <SelectValue placeholder="Nyitás kezdete" />
                          </SelectTrigger>
                          <SelectContent className={firaSans.className}>
                            {allTimes(new Date())
                              .reverse()
                              .map((time) => (
                                <SelectItem
                                  key={format(time, "HH:mm")}
                                  value={format(time, "HH:mm")}
                                  className={firaSans.className}
                                >
                                  {format(time, "HH:mm")}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-row items-center">
                        <Label
                          htmlFor="endTime"
                          className="text-md mr-4 font-bold"
                          autoFocus
                        >
                          Vége:
                        </Label>
                        <Select
                          onValueChange={(value) => {
                            if (!value) return;
                            setCloseDate(
                              dateAtTime(
                                date ?? new Date(),
                                parseInt(value.split(":")[0] ?? "0"),
                                parseInt(value.split(":")[1] ?? "0"),
                              ),
                            );
                          }}
                          defaultValue="22:00"
                          disabled={!date}
                        >
                          <SelectTrigger className={"w-[180px]"}>
                            <SelectValue placeholder="Nyitás vége" />
                          </SelectTrigger>
                          <SelectContent className={firaSans.className}>
                            {allTimes(new Date())
                              .reverse()
                              .map((time) => (
                                <SelectItem
                                  key={format(time, "HH:mm")}
                                  value={format(time, "HH:mm")}
                                  className={firaSans.className}
                                >
                                  {format(time, "HH:mm")}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-orange-50 bg-orange-50 hover:bg-bg">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-primary hover:bg-dark"
                    disabled={
                      title.length < 1 ||
                      source.length < 1 ||
                      selectedFoods.length < 1
                    }
                    onClick={() => {
                      if (
                        title.length < 1 ||
                        source.length < 1 ||
                        selectedFoods.length < 1 ||
                        !date ||
                        !openDate ||
                        !closeDate ||
                        openDate > closeDate ||
                        openDate > date ||
                        closeDate > date ||
                        openDate < date ||
                        closeDate < date
                      ) {
                        console.log("Invalid input");
                        return;
                      }
                      newOpeningMutation.mutate({
                        title: title,
                        description: source,
                        foods: selectedFoods.map((food) => food.id),
                        acceping: accepting === "true" ? true : false,
                        open: openDate,
                        close: closeDate,
                      });
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : null}
          {openings.length > 0 ? (
            openings.map((opening) => (
              <>
                <div
                  key={opening.id}
                  className="mb-4 flex min-w-96 max-w-none flex-col rounded-lg border border-dark bg-orange-50 px-4 py-3 sm:min-w-[40rem]"
                >
                  <div className="text-xl font-bold">{opening.title}</div>
                  <hr className="mr-4 border-[0.5px] border-dark bg-dark" />
                  <div className="mt-2 flex flex-row space-x-2">
                    <div className="center flex flex-row items-center text-sm">
                      <Badge
                        className={
                          opening.acceping
                            ? "bg-green-600 hover:bg-green-600"
                            : "bg-red-500 hover:bg-red-500"
                        }
                      >
                        {opening.acceping
                          ? "Rendelés nyitva"
                          : "Rendelés zárva"}
                      </Badge>
                    </div>
                    <div className="center flex flex-row items-center text-sm">
                      <ScheduleIcon
                        className="mr-1 align-middle text-primary"
                        fontSize="small"
                      ></ScheduleIcon>{" "}
                      {opening.open.toDateString()}
                    </div>
                  </div>
                  <article className="mt-2 w-full">
                    <Markdown className="prose min-w-full !text-black ">
                      {opening.description}
                    </Markdown>
                  </article>
                  <Label htmlFor="foods" className="text-lg font-bold">
                    Ételek:
                  </Label>
                  <div>
                    {opening.foods.map((food) => {
                      return <div>{food.name}</div>;
                    })}
                  </div>
                  <div className="ml-auto">
                    <DeleteIcon
                      className="text-red-500 transition-all hover:opacity-70"
                      onClick={() => {
                        deleteOpeningMutation.mutate({ id: opening.id });
                      }}
                    ></DeleteIcon>
                  </div>
                </div>
              </>
            ))
          ) : (
            <div className="text-center">Nincsenek még nyitások</div>
          )}
        </>
      )}
    </div>
  );
}
function dateAtTime(date: Date, hour: number, minute: number) {
  date.setHours(hour);
  date.setMinutes(minute);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}
function allTimes(date: Date) {
  // 12:00 AM - 11:45 PM 15m intervals
  var start = dateAtTime(new Date(date), 0, 0);
  var end = dateAtTime(new Date(date), 23, 45);
  var times = [];
  while (start <= end) {
    times.push(new Date(start));
    start.setMinutes(start.getMinutes() + 15);
  }
  return times;
}

export default NewsComp;
