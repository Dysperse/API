import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { fetchApiWithoutHook } from "../../hooks/useApi";

function Integration({ integration }) {
  const [open, setOpen] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetchApiWithoutHook("property/integrations/create", {
      name: integration.name,
      inputParams: JSON.stringify(params),
      outputType: integration.type,
    });
    toast.success("Added integration!");
  };

  return (
    <>
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
      </Typography>
      {integrations.map((integration) => (
        <Integration integration={integration} key={integration.name} />
      ))}
    </>
  );
}
