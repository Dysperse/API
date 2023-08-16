import { ConfirmationModal } from "@/components/ConfirmationModal";
import { ErrorHandler } from "@/components/Error";
import { useSession } from "@/lib/client/session";
import { fetchRawApi, useApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Button,
  Chip,
  Icon,
  IconButton,
  ListItem,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { red } from "@mui/material/colors";
import dayjs from "dayjs";
import React, { useRef } from "react";
import { Virtuoso } from "react-virtuoso";
import { mutate } from "swr";
import Layout from ".";

const Session: any = React.memo(function Session({
  mutationUrl,
  index,
  data,
}: any) {
  const session = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  return (
    <ListItem
      sx={{
        ...(data[index].id === session.current.token && {
          background: palette[2],
        }),
        borderRadius: 3,
      }}
    >
      <ListItemText
        sx={{
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
        primary={dayjs(data[index].timestamp).format(
          "dddd, MMMM D, YYYY h:mm A"
        )}
        secondary={
          <span
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            IP address: {data[index].ip}
            {data[index].id === session.current.token && (
              <Chip
                size="small"
                label="Current device"
                sx={{
                  ml: 1,
                  background:
                    "linear-gradient(45deg, #8338e3, #e0a9bb)!important",
                  color: "#000!important",
                }}
              />
            )}
          </span>
        }
      />
      <Tooltip
        title={
          data[index].id === session.current.token
            ? "You're currently signed in on this device"
            : "Sign out"
        }
      >
        <span>
          <ConfirmationModal
            title="Sign out of this device?"
            question="You'll be logged out of this device - perfect if you forgot to sign out on a public device"
            callback={async () => {
              await fetchRawApi(session, "user/settings/sessions/delete", {
                id: data[index].id,
              });
              await mutate(mutationUrl);
            }}
          >
            <IconButton disabled={data[index].id === session.current.token}>
              <Icon>logout</Icon>
            </IconButton>
          </ConfirmationModal>
        </span>
      </Tooltip>
    </ListItem>
  );
});

/**
 * Top-level component for the account settings page.
 */
export default function LoginActivity() {
  const { data, url, error } = useApi("user/settings/sessions");
  const session = useSession();
  const ref = useRef();

  return (
    <Layout>
      <Box ref={ref}>
        <ConfirmationModal
          title="Log out of all other devices?"
          question="You won't be logged out of the one you're on right now"
          callback={async () => {
            await fetchRawApi(session, "user/settings/sessions/delete");
            await mutate(url);
          }}
        >
          <Button
            color="error"
            variant="contained"
            sx={{
              mb: 2,
              "&, &:hover": {
                color: "#fff!important",
                background: red["A700"] + "!important",
              },
            }}
          >
            Sign out from everywhere
          </Button>
        </ConfirmationModal>
        {error && (
          <ErrorHandler
            callback={() => mutate(url)}
            error="An error occured while trying to fetch your logged-in devices"
          />
        )}
        {data && (
          <Virtuoso
            style={{ width: "100%" }}
            totalCount={data.length}
            useWindowScroll
            customScrollParent={ref.current}
            itemContent={(index) => (
              <Session mutationUrl={url} index={index} data={data} />
            )}
          />
        )}
      </Box>
    </Layout>
  );
}
