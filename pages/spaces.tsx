import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import toast from "react-hot-toast";

export default function Insights() {
  return global.user.email === "manusvathgurudath@gmail.com" ? (
    <Box
      sx={{
        p: 2,
      }}
      className="mt-5 sm:mt-10"
    >
      <Typography sx={{ fontWeight: "600" }} variant="h5">
        Spaces
      </Typography>
    </Box>
  ) : (
    <div className="bg-gray-900 px-7 py-5 rounded-xl shadow-xl mt-10 max-w-lg mx-auto text-gray-50">
      <h1 className="text-xl">Gamify your productivity</h1>
      <h2 className="text-md mt-2 font-thin">
        Carbon Spaces is a place to store links, images, thoughts and more. With
        Spaces, you can organize your thoughts and ideas into a single place and
        access them from anywhere. You can also allow family/dorm members to see
        your posts!
      </h2>
      <Button
        className="text-gray-50 border-gray-50 border-2 mt-5 w-full hover:border-2 hover:border-gray-100"
        variant="outlined"
        onClick={() => {
          toast.success("You'll get an email when Spaces is released!");
        }}
      >
        Join the waitlist
      </Button>
    </div>
  );
}
