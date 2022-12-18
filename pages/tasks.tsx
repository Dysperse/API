import Head from "next/head";
import { TasksLayout } from "../components/Boards/TasksLayout";

/**
 * Top-level component for the dashboard page.
 */
export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Tasks &bull; Carbon</title>
      </Head>
      <div className="pt-10 px-0">
        <TasksLayout />
      </div>
    </>
  );
}
