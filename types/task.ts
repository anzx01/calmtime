/** 单个任务。 */
export interface Task {
  id: string;
  title: string;
  note?: string;
  /** 预估番茄数（>=1）。 */
  estimatedPomodoros: number;
  /** 已完成番茄数。 */
  completedPomodoros: number;
  done: boolean;
  createdAt: number;
  /** 列表排序权重（越小越靠前）。 */
  order: number;
}

/** 新建任务时的可编辑字段。 */
export type TaskDraft = Pick<Task, "title" | "note" | "estimatedPomodoros">;

/** 可复用的任务模板。 */
export interface TaskTemplate {
  id: string;
  name: string;
  items: TaskDraft[];
}
