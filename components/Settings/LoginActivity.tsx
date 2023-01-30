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
import { FixedSizeList as List } from "react-window";
import { mutate } from "swr";
import { fetchApiWithoutHook, useApi } from "../../hooks/useApi";
import { ConfirmationModal } from "../ConfirmationModal";

const Session: any = React.memo(function Session({
  mutationUrl,
  index,
  data,
  style,
}: any) {
  return (
    <ListItem
      sx={{
        ...style,
        ...(data[index].id === global.user.token && {
          background: global.user.darkMode
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
            {data[index].id === global.user.token && (
              <Chip
                size="small"
                label="Current device"
                sx={{
                  ml: 1,
                  background: "linear-gradient(45deg, #8338e3, #e0a9bb)!important",
                  color:"#000!important"
                }}
              />
            )}
          </span>
        }
      />
      <Tooltip
        title={
          data[index].id === global.user.token
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
            <IconButton disabled={data[index].id === global.user.token}>
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
      {data && (
        <List height={400} itemCount={data.length} itemSize={70} width={"100%"}>
          {({ index, style }) => (
            <Session
              mutationUrl={url}
              index={index}
              style={style}
              data={data}
            />
          )}
        </List>
      )}
    </Box>
  );
}
