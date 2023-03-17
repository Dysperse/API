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
import React from "react";
import { Virtuoso } from "react-virtuoso";
import { mutate } from "swr";
import { fetchApiWithoutHook, useApi } from "../../lib/client/useApi";
import { useSession } from "../../pages/_app";
import { ConfirmationModal } from "../ConfirmationModal";
import { ErrorHandler } from "../Error";

const Session: any = React.memo(function Session({
  mutationUrl,
  index,
  data,
}: any) {
  const session = useSession();

  return (
    <ListItem
      sx={{
        ...(data[index].id === session?.user?.token && {
          background: session?.user?.darkMode
            ? "hsl(240,11%,30%)"
            : "rgba(200,200,200,.3)",
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
          <span className="flex items-center">
            IP address: {data[index].ip}
            {data[index].id === session?.user?.token && (
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
          data[index].id === session?.user?.token
            ? "You're currently signed in on this device"
            : "Sign out"
        }
      >
        <span>
          <ConfirmationModal
            title="Sign out of this device?"
            question="You'll be logged out of this device - perfect if you forgot to sign out on a public device"
            callback={async () => {
              await fetchApiWithoutHook("user/sessions/delete", {
                id: data[index].id,
              });
              await mutate(mutationUrl);
            }}
          >
            <IconButton disabled={data[index].id === session?.user?.token}>
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
  const { data, url, error } = useApi("user/sessions");
  return (
    <Box>
      <ConfirmationModal
        title="Log out of all other devices?"
        question="You won't be logged out of the one you're on right now"
        callback={async () => {
          await fetchApiWithoutHook("user/sessions/delete");
          await mutate(url);
        }}
      >
        <Button
          color="error"
          variant="contained"
          sx={{
            float: "right",
            mb: 2,
            background: red["A400"] + "!important",
            "&:hover": {
              background: red["A700"] + "!important",
            },
          }}
        >
          Log out of all devices
        </Button>
      </ConfirmationModal>
      {error && (
        <ErrorHandler error="An error occured while trying to fetch your logged-in devices" />
      )}
      {data && (
        <Virtuoso
          style={{ height: "400px", width: "100%" }}
          totalCount={data.length}
          itemContent={(index) => (
            <Session mutationUrl={url} index={index} data={data} />
          )}
        />
      )}
    </Box>
  );
}
