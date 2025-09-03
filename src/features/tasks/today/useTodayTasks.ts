import { useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, dayBucket, now } from "../../../data/db";
import type { Task } from "../../../domain/types";

export interface TodayFilters {
  onlyPending: boolean;
  withTime?: boolean;
  blocked?: boolean;
  withAttachments?: boolean;
}

export interface TodayQueryResult {
  tasks: Task[];
  isLoading: boolean;
  count: number;
}

function normalize(s: string) {
  return s.normalize("NFKD").toLowerCase();
}

interface AttachmentRef {
  targetType: string;
  targetId: string;
}

export function useTodayTasks(
  search: string,
  filters: TodayFilters
): TodayQueryResult {
  const searchTerm = normalize(search.trim());
  const today = dayBucket(new Date());

  const tasks = useLiveQuery(async () => {
    let list = await db.tasks.where("when").equals(today).toArray();

    if (filters.onlyPending) {
      list = list.filter((t) => t.status !== "done" && t.status !== "archived");
    }

    if (searchTerm) {
      list = list.filter((t) => {
        const title = normalize(t.title ?? "");
        const desc = normalize(t.description ?? "");
        return title.includes(searchTerm) || desc.includes(searchTerm);
      });
    }

    if (filters.withTime) {
      list = list.filter((t) => t.dueAt != null);
    }

    if (filters.blocked) {
      list = list.filter((t) => t.status === "blocked");
    }

    if (filters.withAttachments) {
      const atts =
        (await db.attachments.toArray()) as unknown as AttachmentRef[];
      const has = new Set(
        atts.filter((a) => a.targetType === "task").map((a) => a.targetId)
      );
      list = list.filter((t) => has.has(t.id));
    }

    list.sort((a, b) => {
      if (a.status === "done" && b.status !== "done") return 1;
      if (b.status === "done" && a.status !== "done") return -1;

      const ad = a.dueAt ?? Number.MAX_SAFE_INTEGER;
      const bd = b.dueAt ?? Number.MAX_SAFE_INTEGER;
      if (ad !== bd) return ad - bd;

      return (a.createdAt ?? now()) - (b.createdAt ?? now());
    });

    return list;
  }, [
    searchTerm,
    today,
    filters.onlyPending,
    filters.withTime,
    filters.blocked,
    filters.withAttachments,
  ]);

  const isLoading = useMemo(() => tasks === undefined, [tasks]);

  return {
    tasks: tasks ?? [],
    isLoading,
    count: tasks?.length ?? 0,
  };
}
