// layout.tsx

import React from "react";

interface TasksContextProps {
  setRightContent: any;
  setTitle: any;
}

export const TasksContext = React.createContext<TasksContextProps | null>(null);
