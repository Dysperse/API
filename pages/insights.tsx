import Button from "@mui/material/Button";
export default function Insights() {
  return (
    <div className="bg-gray-900 px-7 py-5 rounded-xl shadow-xl mt-10 max-w-lg mx-auto text-gray-50">
      <h1 className="text-xl">Gamify your productivity</h1>
      <h2 className="text-md mt-2 font-thin">
        With Carbon Insights, measure your productivity and compare with other
        members
      </h2>
      <Button
        className="text-gray-50 border-gray-50 border-2 mt-5 w-full hover:border-2 hover:border-gray-100"
        variant="outlined"
      >
        Join the waitlist
      </Button>
    </div>
  );
}
