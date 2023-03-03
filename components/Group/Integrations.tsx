import {
  Avatar,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { fetchApiWithoutHook, useApi } from "../../hooks/useApi";
import { toastStyles } from "../../lib/useCustomTheme";
import { ErrorHandler } from "../Error";

function Integration({ integration }) {
  const [open, setOpen] = useState<boolean>(false);
  const [params, setParams] = useState(
    integration.params.reduce((acc, curr) => ((acc[curr.name] = ""), acc), {})
  );

  const handleParamUpdate = useCallback(
    (key, value) => {
      setParams({
        ...params,
        [key]: value,
      });
    },
    [params]
  );
  const [boardId, setBoardId] = useState<string | null>("-1");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (integration.type === "board" && boardId === "-1") {
      toast.error("Please select a board", toastStyles);
      return;
    }
    await fetchApiWithoutHook("property/integrations/create", {
      name: integration.name,
      inputParams: JSON.stringify(params),
      outputType: integration.type,

      ...(integration.type === "board" && { boardId }),
    });
    toast.success("Added integration!", toastStyles);
  };
  const { data, error } = useApi("property/boards");

  return (
    <>
      {error && (
        <ErrorHandler error="An error occured while trying to get your boards" />
      )}
      <ListItemButton sx={{ mb: 1, gap: 2 }} onClick={() => setOpen(true)}>
        <Avatar src={integration.image} />
        <ListItemText
          primary={integration.name}
          secondary={integration.description}
        />
      </ListItemButton>
      <Dialog open={open} onClose={() => setOpen(false)} keepMounted={false}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Configure integration</DialogTitle>
          <DialogContent sx={{ pt: "20px!important" }}>
            {integration.params.map((param) => (
              <TextField
                size="small"
                value={params[param.name]}
                onChange={(e) => handleParamUpdate(param.name, e.target.value)}
                placeholder={param.placeholder}
                label={param.name}
                fullWidth
                helperText={param.helperText}
                type={param.type}
                required={param.required}
                key={param.name}
              />
            ))}
            {integration.type == "board" && (
              <Select
                value={boardId}
                size="small"
                sx={{ mt: 1 }}
                fullWidth
                required
                onChange={(e) => setBoardId(e.target.value)}
                defaultValue="-1"
              >
                <MenuItem value={-1} disabled>
                  Select a board
                </MenuItem>
                {data &&
                  data.map((board) => (
                    <MenuItem
                      value={board.id}
                      key={board.id}
                      disabled={board.integrations.find(
                        (integration) => integration.name === "Canvas LMS"
                      )}
                    >
                      {board.name}
                    </MenuItem>
                  ))}
              </Select>
            )}
          </DialogContent>
          <DialogActions>
            <Button type="submit">Configure</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

export default function Integrations() {
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
            'You can find your Canvas feed URL by visiting "Calendar → Calendar feed" (web only)',
          required: true,
        },
      ],
    },
  ];
  return (
    <>
      <Typography variant="h6" sx={{ mt: 5, px: 1 }}>
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
      {integrations.map((integration) => (
        <Integration integration={integration} key={integration.name} />
      ))}
    </>
  );
}
