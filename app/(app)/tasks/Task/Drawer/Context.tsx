import { createContext, useContext } from "react";

export const TaskContext: any = createContext(null);
export const useTaskContext = () => useContext(TaskContext) as any;
