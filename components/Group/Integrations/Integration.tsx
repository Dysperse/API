import { useSession } from "@/lib/client/session";
import { fetchRawApi, useApi } from "@/lib/client/useApi";
import { toastStyles } from "@/lib/client/useTheme";
import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { ErrorHandler } from "../../Error";

export function Integration({ closeParent, integration }) {
  const router = useRouter();
  const session = useSession();

  const [boardId, setBoardId] = useState<string | null>("-1");
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
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
    if (integration.type === "board" && boardId === "-1") {
      toast.error("Please select a board", toastStyles);
      return;
    }
    setLoading(true);
    await fetchRawApi(session, "property/integrations/create", {
      name: integration.name,
      inputParams: JSON.stringify(params),
      outputType: integration.type,

      ...(integration.type === "board" && { boardId }),
    });

    toast.success("Added integration!", toastStyles);
    setOpen(false);
    closeParent();

    if (integration.type === "board") {
      setTimeout(() => {
        router.push(`/tasks/boards/${boardId}`);
      });
      return;
    }

    setLoading(false);
  };

  const { data, url, error } = useApi("property/boards");

  return (
    <>
      {error && (
        <ErrorHandler
          callback={() => mutate(url)}
          error="Yikes! An error occured while trying to get your boards! Please try again later..."
        />
      )}
      <ListItemButton sx={{ mb: 1, gap: 2 }} onClick={() => setOpen(true)}>
        <Avatar src={integration.image} sx={{ borderRadius: 3 }} />
        <ListItemText
          primary={integration.name}
          secondary={integration.description}
        />
      </ListItemButton>
      <Dialog open={open} onClose={() => setOpen(false)} keepMounted={false}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add integration</DialogTitle>
          <DialogContent sx={{ pt: "20px!important" }}>
            {integration.params.map((param) => (
              <TextField
                size="small"
                value={params[param.name]}
                onKeyDown={(e) => {
                  e.stopPropagation();
                }}
                onChange={(e: any) =>
                  handleParamUpdate(param.name, e.target.value)
                }
                placeholder={param.placeholder}
                label={param.name}
                fullWidth
                helperText={param.helperText}
                type={param.type}
                required={param.required}
                key={param.name}
              />
            ))}
            {integration.type === "board" && (
              <Select
                value={boardId}
                size="small"
                sx={{ mt: 1 }}
                fullWidth
                required
                onChange={(e: any) => setBoardId(e.target.value)}
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
                      disabled={Boolean(
                        board.integrations.find(
                          (integration) => integration.name === "Canvas LMS"
                        )
                      )}
                    >
                      {board.name}
                    </MenuItem>
                  ))}
              </Select>
            )}
          </DialogContent>
          <DialogActions>
            <LoadingButton loading={loading} type="submit">
              Configure
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
