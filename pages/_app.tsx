// Toast container
import { Toaster } from "react-hot-toast";
// DayJS
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
// CSS
import "../styles/globals.scss";
import "../styles/search.scss";
// Material UI
import NoSsr from "@mui/material/NoSsr";

dayjs.extend(relativeTime);

export default function App({ Component, pageProps }) {
  return (
    <NoSsr>
      <Toaster />
      <Component {...pageProps} />
    </NoSsr>
  );
}
