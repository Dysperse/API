import dynamic from "next/dynamic";

const Dashboard = dynamic(() => import("./dashboard"));

function Index(): any {
  return <Dashboard />;
}

export default Index;
