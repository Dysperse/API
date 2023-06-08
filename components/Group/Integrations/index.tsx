import { ConfirmationModal } from "@/components/ConfirmationModal";
import { ErrorHandler } from "@/components/Error";
import { Puller } from "@/components/Puller";
import { fetchRawApi, useApi } from "@/lib/client/useApi";
import {
  Alert,
  Box,
  Button,
  Chip,
  Icon,
  IconButton,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Skeleton,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { mutate } from "swr";
import { Integration } from "./Integration";

export default function Integrations({ handleClose }) {
  const integrations = [
    {
      name: "Canvas LMS",
      description: "Sync your Canvas Calendar to your boards",
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
  ];

  const { data, url, error } = useApi("property/integrations");
  const [open, setOpen] = useState(false);

  return (
    <>
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
        >
          <Icon className="outlined">add</Icon>Add integration
        </Button>
      </Box>
      {data ? (
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
              callback={() => mutate(url)}
            />
          )}
          {data.map((integration) => (
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
                    await fetchRawApi("property/integrations/delete", {
                      id: integration.id,
                    });
                    mutate(url);
                  }}
                >
                  <IconButton>
                    <Icon>delete</Icon>
                  </IconButton>
                </ConfirmationModal>
              </ListItemSecondaryAction>
            </ListItemButton>
          ))}
        </>
      ) : (
        <Skeleton
          variant="rectangular"
          sx={{ borderRadius: 5, width: "100%", height: 30 }}
        />
      )}
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
    </>
  );
}
