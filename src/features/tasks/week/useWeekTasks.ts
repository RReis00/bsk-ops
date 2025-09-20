import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../../data/db";
import type { Task } from "../../../domain/types";
import {
  startOfWeek,
  endOfWeek,
  dayBucket,
  todayBucket,
} from "../../../domain/dateUtils";

export interface WeekFilters {
  search?: string;
  day?: number | "all";
  status?: Task["status"][] | "all";
  carriedOver?: boolean | "all";
}

export interface WeekTask extends Task {
  _derived: {
    dayBucket: number;
    carriedOver: boolean;
  };
}

export function useWeekTasks(
  weekStartTs: number = startOfWeek(),
  filters: WeekFilters = {}
): { tasks: WeekTask[]; isLoading: boolean; count: number } {
  const weekEndTs = endOfWeek(weekStartTs);
  const today = todayBucket();

  const tasks = useLiveQuery(async () => {
    const base: Task[] = await db.tasks
      .where("when")
      .between(weekStartTs, weekEndTs, true, true)
      .toArray();

    const decorated: WeekTask[] = base
      .filter((t: Task) => t.status !== "archived")
      .map((t: Task): WeekTask => {
        const bucket = t.when ? dayBucket(t.when) : today;
        return {
          ...t,
          _derived: {
            dayBucket: bucket,
            carriedOver: Boolean(
              t.when && t.when < today && t.status !== "done"
            ),
          },
        };
      });

    const filtered = decorated.filter((t: WeekTask) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const title = t.title.toLowerCase();
        const desc = (t.description ?? "").toLowerCase();
        if (!title.includes(q) && !desc.includes(q)) return false;
      }

      if (filters.day && filters.day !== "all") {
        if (t._derived.dayBucket !== filters.day) return false;
      }

      if (filters.status && filters.status !== "all") {
        if (!filters.status.includes(t.status)) return false;
      }

      if (filters.carriedOver === true && !t._derived.carriedOver) {
        return false;
      }

      return true;
    });

    return filtered;
  }, [
    weekStartTs,
    filters.search,
    filters.day,
    filters.status,
    filters.carriedOver,
  ]);

  return {
    tasks: tasks ?? [],
    isLoading: tasks === undefined,
    count: tasks?.length ?? 0,
  };
}
