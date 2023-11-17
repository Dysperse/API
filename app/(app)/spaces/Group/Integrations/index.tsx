import { ConfirmationModal } from "@/components/ConfirmationModal";
import { ErrorHandler } from "@/components/Error";
import { Puller } from "@/components/Puller";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Icon,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Skeleton,
  SwipeableDrawer,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { Integration } from "./Integration";

export const integrations = [
  {
    name: "Canvas LMS",
    description:
      "See your Canvas assignments, tests & quizzes within Dysperse.",
    image:
      "https://www.instructure.com/sites/default/files/image/2021-12/canvas_reversed_logo.png",
    type: "board",
    params: [
      {
        type: "url",
        placeholder: "e.g., instructure.com/feeds/calendars/id.ics",
        name: "Canvas feed URL",
        helperText:
          'You can find your Canvas feed URL by visiting "Calendar → Calendar feed (scroll down to view button in right sidebar)" (web only)',
        required: true,
        validation:
          /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      },
    ],
  },
  {
    name: "Google Calendar",
    description: "Import Google Calendar events to your boards",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Calendar_icon_%282020%29.svg/2048px-Google_Calendar_icon_%282020%29.svg.png",
    type: "board",
    params: [
      {
        type: "calendar",
        placeholder: "",
        name: "Connect",
        helperText: "",
        required: true,
        validation: null,
      },
    ],
    slides: [
      {
        type: "slide",
        name: "Connect Google Calendar to Dysperse",
        description:
          "Copy the iCal link below to add Dysperse tasks to Google Calendar (optional)",
        url: `[DYSPERSE_ICAL]`,
      },
    ],
  },
];

export default function Integrations({
  board,
  handleClose,
  hideNew = false,
  defaultPalette,
}: {
  board?: string;
  handleClose: any;
  hideNew?: boolean;
  defaultPalette?: string;
}) {
  const { data, mutate, error } = useSWR(["space/integrations"]);
  const { session } = useSession();
  const icalUrl = `https://${window.location.hostname}/api/space/integrations/ical?id=${session.space.info.id}&timeZone=${session.user.timeZone}`;

  const [open, setOpen] = useState(false);
  const palette = useColor(
    defaultPalette || session.themeColor,
    useDarkMode(session.darkMode)
  );

  return (
    <>
      {!board && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            mt: 4,
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="h6">Connections</Typography>
          <Button
            onClick={() => setOpen(true)}
            sx={{ ml: "auto", px: 2 }}
            variant="contained"
            disabled={data?.length >= 5 || session.permission === "read-only"}
          >
            <Icon className="outlined">add</Icon>Add
          </Button>
        </Box>
      )}
      {error && <ErrorHandler callback={mutate} />}
      {(!board || !hideNew) && data ? (
        <>
          {data.length === 0 && (
            <Alert severity="info">
              <Typography>
                <b>Connect your favorite apps</b>
              </Typography>
              <Typography>
                Connect and sync other apps into one platform, Dysperse.
              </Typography>
            </Alert>
          )}
          {error && (
            <ErrorHandler
              error="Oh no! We couldn't get your integrations. Please try again later..."
              callback={() => mutate()}
            />
          )}
          <List>
            {session.permission !== "read-only" &&
              data
                .filter(
                  (integration) => integration.board.id === board || hideNew
                )
                .map((integration) => (
                  <ListItem
                    key={integration.id}
                    sx={{ borderRadius: 5, mb: 2, background: palette[2] }}
                  >
                    <ListItemText
                      primary={integration.name}
                      secondary={
                        <Chip
                          sx={{ mt: 0.5 }}
                          icon={<Icon>sync</Icon>}
                          label={
                            <>
                              Synced with <b>{integration.board.name}</b>
                            </>
                          }
                          size="small"
                        />
                      }
                    />
                    <ListItemSecondaryAction>
                      <ConfirmationModal
                        title="Remove integration?"
                        buttonText="Remove"
                        question="Existing tasks won't be affected, but new ones won't sync anymore. Continue?"
                        callback={async () => {
                          await fetchRawApi(session, "space/integrations", {
                            method: "DELETE",
                            params: {
                              id: integration.id,
                            },
                          });
                          mutate();
                        }}
                      >
                        <IconButton>
                          <Icon className="outlined">remove_circle</Icon>
                        </IconButton>
                      </ConfirmationModal>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
          </List>
        </>
      ) : (
        !board && !error && <Skeleton variant="rectangular" height={100} />
      )}
      {hideNew && board ? (
        integrations.map((integration) => (
          <Integration
            board={board}
            integration={integration}
            key={integration.name}
            closeParent={() => {
              handleClose();
              setOpen(false);
            }}
          />
        ))
      ) : (
        <SwipeableDrawer
          open={open}
          onClose={() => setOpen(false)}
          anchor="bottom"
        >
          <Puller showOnDesktop />
          <Box sx={{ p: 2, pt: 0 }}>
            <Box sx={{ px: 1 }}>
              <Typography variant="h6">Available integrations</Typography>
              <Typography gutterBottom>{integrations.length} apps</Typography>
            </Box>
            {integrations.map((integration) => (
              <Integration
                board={data?.id}
                integration={integration}
                key={integration.name}
                closeParent={() => {
                  handleClose();
                  setOpen(false);
                }}
              />
            ))}
          </Box>
        </SwipeableDrawer>
      )}

      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" gutterBottom>
        Calendar feed link
      </Typography>
      <TextField
        size="small"
        InputProps={{
          readOnly: true,
          startAdornment: (
            <InputAdornment position="start">
              <IconButton
                onClick={() => {
                  window.open(
                    `https://www.google.com/calendar/render?cid=webcal://${icalUrl.replace(
                      "https://",
                      ""
                    )}`
                  );
                }}
              >
                <Icon>calendar_add_on</Icon>
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <ConfirmationModal
                title="Careful!"
                question="Anyone with this link can see your tasks."
                buttonText="Copy"
                callback={() => {
                  navigator.clipboard.writeText(icalUrl);
                  toast.success("Copied to clipboard!");
                }}
              >
                <IconButton>
                  <Icon className="outlined">content_copy</Icon>
                </IconButton>
              </ConfirmationModal>
            </InputAdornment>
          ),
        }}
        value={icalUrl}
      />
    </>
  );
}
