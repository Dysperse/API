import Masonry from "@mui/lab/Masonry";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import useSWR, { mutate } from "swr";
import { ErrorHandler } from "../components/ErrorHandler";
import toast from "react-hot-toast";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { useEffect, useState } from "react";
import * as colors from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import { Puller } from "../components/Puller";
import LoadingButton from "@mui/lab/LoadingButton";
import { useFormik } from "formik";
import LinearProgress from "@mui/material/LinearProgress";
import { Icon } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import hexToRgba from "hex-to-rgba";

function ColorModal({ formik }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        disableSwipeToOpen
        open={open}
        BackdropProps={{
          sx: {
            background:
              hexToRgba(
                colors[formik.values.color][global.user.darkMode ? 900 : 100],
                0.7
              ) + "!important",
          },
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            maxWidth: { sm: "470px" },
            mx: "auto",
            background:
              colors[formik.values.color][global.user.darkMode ? 900 : 50],
            borderRadius: "30px 30px 0 0",
          },
        }}
      >
        <DialogTitle>Choose a color</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            {Object.keys(colors)
              .filter((c) => c !== "common")
              .map((color) => (
                <Box
                  key={color}
                  sx={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    background: colors[color][global.user.darkMode ? 700 : 500],
                    margin: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    formik.setFieldValue("color", color);
                    setOpen(false);
                  }}
                />
              ))}
          </Box>
        </DialogContent>
      </SwipeableDrawer>
      <IconButton
        disableRipple
        onClick={() => setOpen(true)}
        sx={{
          borderRadius: 4,
          mr: 0.5,
          transition: "none",
          color:
            global.theme == "dark"
              ? "#fff"
              : colors[formik.values.color][global.user.darkMode ? 100 : "800"],
          "&:hover": {
            background:
              colors[formik.values.color][
                global.theme == "dark" ? "900" : "200"
              ] + "!important",
          },
        }}
      >
        <span
          className={
            "material-symbols-" +
            (formik.values.pinned ? "rounded" : "outlined")
          }
        >
          palette
        </span>
      </IconButton>
    </>
  );
}
function NoteModal({
  id,
  url,
  create = false,
  open,
  setOpen,
  title,
  content,
}: {
  id?: number;
  url: string;
  create?: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  content: string;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const formik = useFormik({
    initialValues: {
      color: "orange",
      pinned: false,
      title: create ? "" : title,
      content: create ? "" : content,
    },
    onSubmit:  (values) => {
      setLoading(true);
      fetch(
        create
          ? "/api/property/notes/create?" +
              new URLSearchParams({
                property: global.property.propertyId,
                accessToken: global.property.accessToken,
                title: values.title,
                content: values.content,
                pinned: values.pinned ? "true" : "false",
                color: values.color,
              })
          : "/api/property/notes/edit?" +
              new URLSearchParams({
                property: global.property.propertyId,
                accessToken: global.property.accessToken,
                title: values.title,
                content: values.content,
                pinned: values.pinned ? "true" : "false",
                color: values.color,
                id: id ? id.toString() : "",
              })
      )
        .then((res) => res.json())
        .then(() => {
          setLoading(false);
          mutate(url);
          setOpen(false);
          if (create) {
            toast.success("Created note!");
            formik.resetForm();
          }
        })
        .catch((err) => {
          setLoading(false);
          toast.error("Couldn't create note. Please try again later.");
        });
    },
  });

  useEffect(() => {
    formik.setFieldValue("title", title);
    formik.setFieldValue("content", content);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content]);
  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={() => {
        // Submit form
        formik.handleSubmit();
        setOpen(false);
      }}
      onOpen={() => setOpen(true)}
      sx={{
        display: { sm: "flex" },
        alignItems: { sm: "center" },
        justifyContent: { sm: "center" },
      }}
      BackdropProps={{
        sx: {
          background:
            hexToRgba(
              colors[formik.values.color][global.user.darkMode ? 900 : 100],
              0.7
            ) + "!important",
        },
      }}
      PaperProps={{
        elevation: 0,
        sx: {
          background:
            colors[formik.values.color][global.user.darkMode ? 900 : 50],
          position: { sm: "static" },
          mx: "auto",
          overflow: "hidden!important",
          maxWidth: "500px",
          width: "100%",
          borderRadius: { xs: "30px 30px 0 0", sm: 5 },
        },
      }}
    >
      <LinearProgress
        variant="determinate"
        value={(formik.values.content.length / 350) * 100}
        sx={{
          height: 2,
          color: colors[formik.values.color][global.user.darkMode ? 100 : 500],
        }}
        color="inherit"
      />
      <Box sx={{ p: 4, pt: 5 }}>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            sx={{ mb: 1 }}
            fullWidth
            placeholder="Add a title"
            value={formik.values.title}
            onChange={formik.handleChange}
            name="title"
            InputProps={{
              disableUnderline: true,
              sx: {
                fontWeight: "900",
                fontSize: "1.5rem",
              },
            }}
            variant="standard"
          />
          <TextField
            fullWidth
            multiline
            value={formik.values.content}
            onChange={(e) =>
              formik.setFieldValue("content", e.target.value.substring(0, 350))
            }
            name="content"
            placeholder="Write something..."
            InputProps={{
              disableUnderline: true,
              sx: {
                alignItems: "flex-start",
              },
            }}
            minRows={3}
            variant="standard"
          />
          <Box sx={{ mt: 2, textAlign: "right" }}>
            <ColorModal formik={formik} />
            <IconButton
              disableRipple
              sx={{
                borderRadius: 4,
                mr: 0.5,
                transition: "none",
                color:
                  global.theme == "dark"
                    ? "#fff"
                    : colors[formik.values.color][
                        global.user.darkMode ? 100 : "800"
                      ],
                ...(formik.values.pinned && {
                  background:
                    colors[formik.values.color][
                      global.theme == "dark" ? "900" : "200"
                    ] + "!important",
                }),
                "&:active": { background: "rgba(0,0,0,0.1)!important" },
              }}
              onClick={() =>
                formik.setFieldValue("pinned", !formik.values.pinned)
              }
            >
              <span
                style={{ transform: "rotate(-45deg)" }}
                className={
                  "material-symbols-" +
                  (formik.values.pinned ? "rounded" : "outlined")
                }
              >
                push_pin
              </span>
            </IconButton>
            {!create && (
              <IconButton
                disableRipple
                onClick={() => {
                  fetch(
                    "/api/property/notes/delete?" +
                      new URLSearchParams({
                        property: global.property.propertyId,
                        accessToken: global.property.accessToken,
                        id: id ? id.toString() : "",
                      })
                  )
                    .then((res) => res.json())
                    .then(() => {
                      mutate(url);
                      setOpen(false);
                      toast.success("Deleted note!");
                    })
                    .catch((err) => {
                      toast.error(
                        "Couldn't delete note. Please try again later."
                      );
                    });
                }}
                sx={{
                  borderRadius: 4,
                  mr: 0.5,
                  transition: "none",
                  color:
                    global.theme == "dark"
                      ? "#fff"
                      : colors[formik.values.color][
                          global.user.darkMode ? 100 : 800
                        ],
                  "&:hover": {
                    background:
                      colors[formik.values.color][
                        global.theme == "dark" ? 900 : 200
                      ] + "!important",
                  },
                }}
              >
                <span
                  className={
                    "material-symbols-" +
                    (formik.values.pinned ? "rounded" : "outlined")
                  }
                >
                  delete
                </span>
              </IconButton>
            )}
          </Box>
          {create && (
            <LoadingButton
              sx={{
                mt: 2,
                borderRadius: "20px",
                background:
                  colors[formik.values.color][
                    global.user.darkMode ? 100 : 900
                  ] + "!important",
              }}
              disableElevation
              size="large"
              type="submit"
              fullWidth
              variant="contained"
              loading={loading}
            >
              {create ? "Create" : "Save"}
            </LoadingButton>
          )}
        </form>
      </Box>
    </SwipeableDrawer>
  );
}

function CreateNoteModal({ url }: { url: string }) {
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  return (
    <>
      <NoteModal
        url={url}
        create
        open={open}
        setOpen={setOpen}
        title={title}
        content=""
      />
      <Card
        sx={{ borderRadius: 5, background: "rgba(200,200,200,.3)" }}
        onClick={() => {
          setOpen(true);
          setTitle("");
        }}
      >
        <CardActionArea>
          <CardContent>
            <Typography
              component="div"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                fontWeight: "600",
              }}
            >
              <span className="material-symbols-outlined">add_circle</span>
              New note
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
}

function Note({ url, note }) {
  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>(note.name);
  return (
    <>
      <NoteModal
        url={url}
        open={open}
        setOpen={setOpen}
        title={name}
        content={note.content}
        id={note.id}
      />
      <Card
        onClick={() => {
          setOpen(true);
          setName(note.name);
        }}
        sx={{
          borderRadius: 5,
          background:
            colors[note.color ?? "orange"][global.user.darkMode ? 900 : 50],
        }}
      >
        <CardActionArea>
          <CardContent sx={{ p: 3 }}>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{ fontWeight: "500" }}
            >
              {note.name}
            </Typography>
            <Typography variant="body2">{note.content}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
}

export default function Notes() {
  const url =
    "/api/property/notes?" +
    new URLSearchParams({
      property: global.property.propertyId,
      accessToken: global.property.accessToken,
    });
  const { data, error } = useSWR(url, () =>
    fetch(url).then((res) => res.json())
  );

  return (
    <Container>
      <Typography
        variant="h3"
        sx={{
          my: 12,
          fontWeight: "400",
          textAlign: "center",
        }}
      >
        Notes
      </Typography>
      {error && (
        <ErrorHandler
          error={"An error occured while trying to fetch your notes"}
        />
      )}
      {data ? (
        <Masonry sx={{ mt: 2 }} columns={{ xs: 1, sm: 2, xl: 3 }}>
          <CreateNoteModal url={url} />
          {data.map((note, key) => (
            <Note key={key} note={note} url={url} />
          ))}
          {data.length === 0 && (
            <>
              {[...Array(10)].map((_, key) => (
                <Skeleton
                  key={key}
                  animation={false}
                  variant="rectangular"
                  sx={{
                    borderRadius: 5,
                    background: "rgba(200,200,200,.15)",
                    height: 200,
                  }}
                />
              ))}
            </>
          )}
        </Masonry>
      ) : (
        <Masonry sx={{ mt: 2 }} columns={{ xs: 1, sm: 2, xl: 3 }}>
          {[...Array(10)].map((_, key) => (
            <Skeleton
              key={key}
              animation={false}
              variant="rectangular"
              sx={{
                borderRadius: 5,
                background: "rgba(200,200,200,.3)",
                height: 200,
              }}
            />
          ))}
        </Masonry>
      )}
    </Container>
  );
}
