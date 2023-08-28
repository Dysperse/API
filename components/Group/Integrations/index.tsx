import { ConfirmationModal } from "@/components/ConfirmationModal";
import { ErrorHandler } from "@/components/Error";
import { Puller } from "@/components/Puller";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { toastStyles } from "@/lib/client/useTheme";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Icon,
  IconButton,
  InputAdornment,
  ListItemButton,
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
    description: "Import Canvas assignments & tests to your boards",
    image:
      "https://www.instructure.com/sites/default/files/image/2021-12/canvas_reversed_logo.png",
    type: "board",
    params: [
      {
        type: "url",
        placeholder: "https://****/feeds/calendars/****.ics",
        name: "Canvas feed URL",
        helperText:
          'You can find your Canvas feed URL by visiting "Calendar → Calendar feed (scroll down to view button in right sidebar)" (web only)',
        required: true,
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
        type: "url",
        placeholder:
          "https://calendar.google.com/calendar/ical/****/***/basic.ics",
        name: "Connect Dysperse to Google Calendar",
        helperText:
          'Paste the "Public address in iCal format" below. You can find this in your calendar settings',
        required: true,
      },
    ],
    slides: [
      {
        type: "slide",
        name: "Connect Google Calendar to Dysperse",
        description:
          "Copy the link below to add Dysperse tasks to Google Calendar",
        url: `[DYSPERSE_ICAL]`,
      },
    ],
  },
];

export default function Integrations({
  board,
  handleClose,
  hideNew = false,
}: {
  board?: string;
  handleClose: any;
  hideNew?: boolean;
}) {
  const { data, mutate, error } = useSWR(["property/integrations"]);
  const session = useSession();
  const icalUrl = `https://${window.location.hostname}/api/property/integrations/ical?id=${session.property.propertyId}&timeZone=${session.user.timeZone}`;

  const [open, setOpen] = useState(false);

  return (
    <>
      {!board && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            mt: 4,
            alignItems: "center",
            mb: 3,
            px: 1,
          }}
        >
          <Typography variant="h6">
            Integrations
            <Chip
              size="small"
              label="ALPHA"
              sx={{
                ml: 1,
                background: "linear-gradient(45deg, #ff0f7b, #f89b29)",
                color: "#000",
              }}
            />
          </Typography>
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
      {(!board || !hideNew) && data ? (
        <>
          {data.length == 0 && (
            <Alert severity="info">
              <Typography>
                <b>You don&apos;t have any integrations set up yet.</b>
              </Typography>
              <Typography>
                Seamlessly sync tools like Canvas with your Dysperse group.
              </Typography>
            </Alert>
          )}
          {error && (
            <ErrorHandler
              error="Oh no! We couldn't get your integrations. Please try again later..."
              callback={mutate}
            />
          )}
          {session.permission !== "read-only" &&
            data.map((integration) => (
              <ListItemButton key={integration.id} disableRipple>
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
                    title="Are you sure you want to remove this integration?"
                    question="Your tasks won't be affected, but you won't be able to sync it with this integration anymore. You can always add it back later."
                    callback={async () => {
                      await fetchRawApi(
                        session,
                        "property/integrations/delete",
                        {
                          id: integration.id,
                        }
                      );
                      mutate();
                    }}
                  >
                    <IconButton>
                      <Icon className="outlined">delete</Icon>
                    </IconButton>
                  </ConfirmationModal>
                </ListItemSecondaryAction>
              </ListItemButton>
            ))}
        </>
      ) : (
        !board && (
          <Skeleton
            variant="rectangular"
            sx={{ borderRadius: 5, width: "100%", height: 30 }}
          />
        )
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
              <Typography variant="h6">
                Available integrations ({integrations.length})
              </Typography>
              <Typography gutterBottom>More coming soon!</Typography>
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

      <Divider sx={{ my: 4 }} />
      <Box sx={{ textAlign: "left" }}>
        <Typography variant="h6">Calendar subscription URL</Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Careful! Anyone with this link can see your tasks
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            size="small"
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      navigator.clipboard.writeText(icalUrl);
                      toast.success("Copied to clipboard!", toastStyles);
                    }}
                  >
                    <Icon className="outlined">content_copy</Icon>
                  </IconButton>
                </InputAdornment>
              ),
            }}
            value={icalUrl}
          />
          <Button
            sx={{ flexShrink: 0 }}
            onClick={() => {
              window.open(
                /(android)/i.test(navigator.userAgent)
                  ? `https://www.google.com/calendar/render?cid=webcal://${icalUrl.replace(
                      "https://",
                      ""
                    )}`
                  : `webcal://${icalUrl.replace("https://", "")}`
              );
            }}
            variant="contained"
          >
            Add to calendar
          </Button>
        </Box>
      </Box>
    </>
  );
}
