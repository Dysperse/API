import { ConfirmationModal } from "@/components/ConfirmationModal";
import EmojiPicker from "@/components/EmojiPicker";
import Integrations from "@/components/Group/Integrations";
import { Puller } from "@/components/Puller";
import { ShareBoard } from "@/components/Tasks/Board/Share";
import { TasksLayout } from "@/components/Tasks/Layout";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Icon,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  SwipeableDrawer,
  SxProps,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import toast from "react-hot-toast";
import useSWR from "swr";

import { DroppableProps } from "react-beautiful-dnd";
export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  if (!enabled) {
    return null;
  }
  return <Droppable {...props}>{children}</Droppable>;
};

function BoardColumnSettings({ data, styles, mutate }) {
  const { session } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("1f3af");

  const handleSubmit = async () => {
    setLoading(true);
    if (name.trim() === "") {
      toast.error("Enter a name for this column");
      setLoading(false);
      return;
    }
    fetchRawApi(session, "property/boards/column/create", {
      who: session.user.name,
      boardName: name,
      title: name,
      emoji,
      id: data.id,
    })
      .then(async () => {
        setName("");
        await mutate();
        toast.success("Created column!");
        setOpen(false);
        setLoading(false);
        setEmoji("1f3af");
        setOpen(false);
      })
      .catch(() => {
        setLoading(false);
        toast.error(
          "An error occurred while creating the column. Try again later."
        );
      });
  };

  const [items, setItems] = useState(data.columns);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const updatedItems = [...items];
    const [movedItem] = updatedItems.splice(result.source.index, 1);
    updatedItems.splice(result.destination.index, 0, movedItem);

    const orderObj = updatedItems.map((column, index) => {
      return {
        order: index,
        id: column.id,
        name: column.name,
      };
    });

    fetchRawApi(session, "property/boards/column/setOrder", {
      order: JSON.stringify(orderObj),
    });
    setItems(updatedItems);
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <StrictModeDroppable droppableId="droppable" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {items.map((column, index) => (
                <Draggable
                  key={column.id}
                  draggableId={column.id}
                  index={index}
                >
                  {(provided) => (
                    <ListItem
                      id={column.id}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <img
                        src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${column.emoji}.png`}
                        alt="Emoji"
                        width={30}
                        height={30}
                      />

                      <ListItemText
                        primary={<b>{column.name}</b>}
                        secondary={`${column.tasks.length} tasks`}
                      />
                      <Box sx={{ display: "flex" }}>
                        <ConfirmationModal
                          title="Delete column?"
                          question={`Deleting this column will also permanently delete ${column.tasks.length} tasks inside it. Continue?`}
                          callback={async () => {
                            await fetchRawApi(
                              session,
                              "property/boards/column/delete",
                              {
                                id: column.id,
                                who: session.user.name,
                                boardName: data.name,
                                boardEmoji: data.emoji,
                                columnName: column.name,
                              }
                            );
                            await mutate();
                          }}
                        >
                          <IconButton>
                            <Icon className="outlined">delete</Icon>
                          </IconButton>
                        </ConfirmationModal>
                        <IconButton disabled>
                          <Icon>drag_handle</Icon>
                        </IconButton>
                      </Box>
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>

      <ListItemButton onClick={() => setOpen(true)}>
        <Avatar sx={{ width: 30, height: 30, color: "#000" }}>
          <Icon>add</Icon>
        </Avatar>
        New column
      </ListItemButton>
      <SwipeableDrawer
        open={open}
        onClose={() => setOpen(false)}
        anchor="bottom"
      >
        <Puller showOnDesktop />
        <Box
          sx={{
            px: 2,
            gap: 2,
            pb: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <EmojiPicker emoji={emoji} setEmoji={setEmoji}>
            <IconButton
              size="large"
              sx={{
                border: "2px dashed #ccc",
                width: 120,
                height: 120,
              }}
            >
              <img
                src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${emoji}.png`}
                alt="Emoji"
                width={80}
                height={80}
              />
            </IconButton>
          </EmojiPicker>
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="Column name"
            placeholder="What's this column about?"
            autoFocus
          />
          <LoadingButton
            size="large"
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            loading={loading}
          >
            <Icon>add</Icon>Create
          </LoadingButton>
        </Box>
      </SwipeableDrawer>
    </>
  );
}
function BoardAppearanceSettings({ data, styles, mutate }) {
  const { session } = useSession();
  const router = useRouter();

  const handleEdit = (key, value, callback = () => {}) => {
    setLoading(true);
    fetchRawApi(session, "property/boards/edit", {
      id: data.id,
      [key]: value,
    })
      .then(async () => {
        callback();
        await mutate();
        setLoading(false);
      })
      .then(() => setLoading(false));
  };

  const [loading, setLoading] = useState(false);

  return (
    <Box
      sx={{
        maxWidth: "500px",
        p: 2,
        pt: 0,
        ...(loading && { opacity: 0.6, filter: "blur(2px)" }),
      }}
    >
      <Typography sx={styles.subheader}>Board name</Typography>
      <TextField
        defaultValue={data.name}
        placeholder="Enter a name..."
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: styles.input,
        }}
        onBlur={(e) => {
          handleEdit("name", e.target.value, () => {
            toast.success("Saved!");
          });
        }}
      />
      <Typography sx={styles.subheader}>Description</Typography>
      <TextField
        defaultValue={data.description}
        multiline
        minRows={4}
        variant="standard"
        placeholder="What's this board about?"
        InputProps={{
          disableUnderline: true,
          sx: styles.input,
        }}
        onBlur={(e) => {
          handleEdit("description", e.target.value, () => {
            toast.success("Saved!");
          });
        }}
      />

      <Typography sx={styles.subheader}>Categories</Typography>
      <TextField
        disabled
        placeholder="Coming soon"
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: styles.input,
        }}
      />

      <Typography sx={styles.subheader}>Other</Typography>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Button
          variant="contained"
          onClick={() =>
            handleEdit("pinned", !data.pinned ? "true" : "false", () => {
              toast.success(!data.pinned ? "Pinned board!" : "Unpinned board!");
            })
          }
        >
          <Icon className={data.pinned ? "" : "outlined"}>push_pin</Icon>Pin
          {data.pinned && "ned"}
        </Button>
        <ConfirmationModal
          title="Archive board?"
          question={
            data.archived
              ? "Are you sure you want to unarchive this board?"
              : "Are you sure you want to archive this board? You won't be able to add/edit items, or share it with anyone."
          }
          callback={() => {
            handleEdit("archived", !data.archived ? "true" : "false", () => {
              toast.success(
                !data.archived ? "Archived board!" : "Unarchived board!"
              );
            });
          }}
        >
          <Button variant="contained">
            <Icon className={data.archived ? "" : "outlined"}>inventory_2</Icon>
            Archive{data.archived && "d"}
          </Button>
        </ConfirmationModal>

        <ConfirmationModal
          title="Delete board?"
          question="Are you sure you want to delete this board? This action annot be undone."
          callback={async () => {
            await fetchRawApi(session, "property/boards/delete", {
              id: data.id,
            });
            router.push("/tasks/agenda/weeks");
          }}
        >
          <Button variant="contained">
            <Icon className="outlined">delete</Icon>Delete
          </Button>
        </ConfirmationModal>
      </Box>
    </Box>
  );
}

function EditLayout({ id, data, mutate }) {
  const { session } = useSession();
  const router = useRouter();
  const [view, setView] = useState<any>(null);

  const palette = useColor(
    session.themeColor,
    useDarkMode(session.user.darkMode)
  );

  useEffect(() => {
    if (view) window.location.hash = view.toLowerCase();
  }, [view]);

  useEffect(() => {
    if (window.location.hash) {
      setView(capitalizeFirstLetter(window.location.hash.replace("#", "")));
    } else {
      setView("Appearance");
    }
  }, []);

  const styles: {
    [key: string]: SxProps;
  } = {
    subheader: {
      textTransform: "uppercase",
      color: palette[11],
      fontWeight: 900,
      fontSize: 14,
      mt: 4,
      mb: 1,
    },
    input: {
      px: 2,
      py: 1,
      background: palette[2],
      "&:focus-within": {
        background: palette[3],
        color: palette[11],
      },
      borderRadius: 3,
    },
  };

  return (
    <Box>
      <AppBar sx={{ border: 0 }}>
        <Toolbar>
          <IconButton
            sx={{ background: palette[3] }}
            onClick={() =>
              router.push("/" + window.location.pathname.replace("/edit", ""))
            }
          >
            <Icon>close</Icon>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2, maxWidth: "100vw" }}>
        <Box
          sx={{
            p: 2,
            background: palette[2],
            borderRadius: 5,
            maxWidth: "100%",
            whiteSpace: "nowrap",
            overflowX: "scroll",
          }}
        >
          {["Appearance", "Columns", "Permissions", "Integrations"].map(
            (button) => (
              <Button
                sx={{ px: 2 }}
                onClick={() => setView(button)}
                variant={view === button ? "contained" : "text"}
                key={button}
              >
                {button}
              </Button>
            )
          )}
        </Box>
        {view === "Appearance" && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <BoardAppearanceSettings
              data={data}
              styles={styles}
              mutate={mutate}
            />
          </motion.div>
        )}
        {view === "Columns" && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{ paddingTop: "20px" }}
          >
            <BoardColumnSettings data={data} styles={styles} mutate={mutate} />
          </motion.div>
        )}
        {view === "Permissions" && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <ShareBoard board={data} mutate={mutate} />
          </motion.div>
        )}
        {view === "Integrations" && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <Box
              sx={{
                background: palette[2],
                mt: 2,
                p: 2,
                py: 10,
                borderRadius: 4,
                textAlign: "center",
              }}
            >
              <Typography variant="h3" sx={{ mb: 1 }} className="font-heading">
                {data.integrations.length == 0
                  ? "Seamlessly integrate your favorite platforms"
                  : "Integrations"}
              </Typography>
              {data.integrations.length == 0 && (
                <Typography sx={{ mb: 2 }}>
                  Easily import your data from other applications you love
                </Typography>
              )}
              <Box sx={{ maxWidth: "500px", mx: "auto" }}>
                <Integrations
                  handleClose={() => {}}
                  board={data.id}
                  hideNew={data.integrations.length == 0}
                />
              </Box>
            </Box>
          </motion.div>
        )}
      </Box>
    </Box>
  );
}

const Dashboard = () => {
  const router = useRouter();
  const { session } = useSession();
  const id = router?.query?.id;
  const [open, setOpen] = useState(false);

  const { data, mutate, error } = useSWR([
    "property/boards",
    {
      id,
      shareToken: "",
    },
  ]);

  if (
    data?.[0]?.shareTokens?.find((s) => s.user.email === session.user.email)
      ?.readOnly ||
    session.permission === "read-only"
  ) {
    return (
      <TasksLayout open={open} setOpen={setOpen}>
        <Box sx={{ p: 4 }}>
          <Alert severity="error">
            You don&apos;t have permission to edit this board. Contact the owner
            if you think this is a mistake
          </Alert>
        </Box>
      </TasksLayout>
    );
  }
  return (
    <TasksLayout open={open} setOpen={setOpen}>
      {data && data[0] && id ? (
        <EditLayout mutate={mutate} id={id} data={data[0]} />
      ) : (
        <Box
          sx={{
            textAlign: "center",
            py: 10,
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </TasksLayout>
  );
};

export default Dashboard;
