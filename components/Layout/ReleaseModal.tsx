import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  Link,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import Markdown from "markdown-to-jsx";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { updateSettings } from "../../lib/client/updateSettings";
import { Puller } from "../Puller";

export default function ReleaseModal() {
  const [open, setOpen] = useState(false);
  const [alreadyOpened, setAlreadyOpened] = useState(false);

  const session = useSession();
  const url =
    "https://api.github.com/repos/dysperse/dysperse/releases?per_page=1";

  const { data, error } = useSWR(
    url,
    () => fetch(url).then((res) => res.json()),
    { revalidateOnFocus: false }
  );
  const router = useRouter();

  useEffect(() => {
    if (!alreadyOpened && session?.user?.onboardingComplete && !error && router.asPath === "/") {
      if (
        data &&
        data[0] &&
        session &&
        session.user.lastReleaseVersionViewed &&
        session.user.lastReleaseVersionViewed !== data[0]?.id
      ) {
        setOpen(true);
        setAlreadyOpened(true);
      }
    }
  }, [data, session, alreadyOpened, error, router]);

  const handleClose = () => {
    setOpen(false);
    updateSettings(
      session,
      "lastReleaseVersionViewed",
      data[0]?.id,
      false,
      null,
      false,
      true
    );
  };

  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  return (
    <SwipeableDrawer
      open={open}
      onClose={handleClose}
      anchor="bottom"
      PaperProps={{
        sx: {
          maxHeight: "calc(100dvh - 40px)",
        },
      }}
    >
      {data &&
        data[0] &&
        session.user.lastReleaseVersionViewed !== data[0]?.id && (
          <>
            <Puller showOnDesktop />
            <DialogContent sx={{ pt: 0 }}>
              <Typography variant="h6">
                What&apos;s new in version {data[0].name.replace("v", "")}
              </Typography>
              <Typography>{dayjs(data[0].published_at).fromNow()}</Typography>
              <Divider sx={{ mt: 2 }} />
              <DialogContentText
                sx={{
                  "& li": {
                    mb: 1,
                  },
                  "& h4": {
                    textDecoration: "underline",
                  },
                  "& img": {
                    maxWidth: "100%",
                    borderRadius: 5,
                  },
                  "& a": {
                    color: "inherit",
                  },
                }}
              >
                <Markdown>
                  {data[0].body.includes("<!--dysperse-changelog-end-->")
                    ? data[0].body.split("<!--dysperse-changelog-end-->")[0]
                    : data[0].body}
                </Markdown>
              </DialogContentText>
              <DialogActions
                sx={{
                  borderTop: "1px solid",
                  borderColor: palette[3],
                  pt: 2,
                }}
              >
                <Typography variant="body2" sx={{ mr: "auto" }}>
                  Missed an update? Check out our{" "}
                  <Link
                    target="_blank"
                    href="https://github.com/Dysperse/Dysperse/releases"
                  >
                    archive
                  </Link>
                </Typography>
                <Button variant="contained" onClick={handleClose}>
                  Okay!
                </Button>
              </DialogActions>
            </DialogContent>
          </>
        )}
    </SwipeableDrawer>
  );
}
