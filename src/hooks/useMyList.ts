import { useState } from "react";

const STORAGE_KEY = "netflix_my_list";

function loadList(): any[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function useMyList() {
  const [myList, setMyList] = useState<any[]>(loadList);

  const toggle = (movie: any) => {
    setMyList((prev) => {
      const exists = prev.some((m) => m.id === movie.id);
      const next = exists
        ? prev.filter((m) => m.id !== movie.id)
        : [movie, ...prev]; // prepend so newest is first
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const isInList = (id: number) => myList.some((m) => m.id === id);

  return { myList, toggle, isInList };
}
