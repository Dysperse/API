import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import React, { useCallback } from "react";
import toast from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import { fetchApiWithoutHook, useApi } from "../hooks/useApi";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { Puller } from "../components/Puller";
import {
  CircularProgress,
  Dialog,
  Grow,
  Link,
  Skeleton,
  useMediaQuery,
} from "@mui/material";
import useEmblaCarousel from "embla-carousel-react";
import { colors } from "../lib/colors";
import { mutate } from "swr";
import Avatar from "boring-avatars";
import dayjs from "dayjs";
import { Masonry } from "@mui/lab";

function CreatePostMenu({ url }) {
  const [value, setValue] = React.useState("");
  const ref: any = React.useRef();

  useHotkeys("ctrl+v", (e) => {
    e.preventDefault();

    navigator.clipboard.readText().then((content) => {
      setValue(content.trim());
      if (ref.current) ref.current.focus();
    });
  });

  const [visibilityModalOpen, setVisibilityModalOpen] = React.useState(false);
  const [contentVisibility, setContentVisibility] = React.useState("Only me");
  const [image, setImage] = React.useState<any>(null);
  const [imageUploading, setImageUploading] = React.useState(false);

  const [loading, setLoading] = React.useState(false);

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={visibilityModalOpen}
        onClose={() => setVisibilityModalOpen(false)}
        onOpen={() => setVisibilityModalOpen(true)}
        disableSwipeToOpen
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: "20px 20px 0 0",
            maxWidth: "500px",
            mx: "auto",
          },
        }}
      >
        <Puller />
        <Box sx={{ p: 3, pt: 0 }}>
          <Typography variant="h6" gutterBottom>
            Visibility
          </Typography>
          {[
            {
              name: "Only me",
              icon: "visibility",
              description: "Only you can see this note",
            },
            {
              name: "My group",
              icon: "group",
              description: "Members in your group can view and edit this note",
            },
          ].map((item) => (
            <Button
              onClick={() => {
                setContentVisibility(item.name);
                setVisibilityModalOpen(false);
              }}
              sx={{
                justifyContent: "flex-start",
                borderRadius: 3,
                gap: 2,
                my: 0.5,
              }}
              fullWidth
              size="large"
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <Box
                sx={{
                  textAlign: "left",
                }}
              >
                <Typography variant="body1">{item.name}</Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.5,
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
              {contentVisibility == item.name && (
                <span
                  className="material-symbols-outlined"
                  style={{ marginLeft: "auto" }}
                >
                  check
                </span>
              )}
            </Button>
          ))}
        </Box>
      </SwipeableDrawer>
      <Box
        sx={{
          background: global.user.darkMode
            ? "hsl(240,11%,17%)"
            : "rgba(200,200,200,0.3)",
          borderRadius: 4,
          p: 2,
          border: "1px solid rgba(0,0,0,0)",
          "&, & *": {
            cursor: "pointer",
          },
          "&:focus-within": {
            background: global.user.darkMode ? "hsl(240,11%,10%)" : "#fff",
            "&, & .MuiInput-root *": {
              cursor: "text",
            },
            border: global.user.darkMode
              ? "1px solid hsl(240,11%,60%)"
              : "1px solid rgba(0,0,0,.5)",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          },
        }}
        onClick={() => {
          if (ref.current) ref.current.focus();
        }}
      >
        {image && (
          <Box
            sx={{
              width: 300,
              position: "relative",
              borderRadius: 5,
              overflow: "hidden",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              mb: 2,
              height: 200,
            }}
          >
            <picture>
              <img
                draggable={false}
                src={image.url}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </picture>
            <Button
              sx={{
                position: "absolute",
                top: 0,
                m: 1,
                right: 0,
                background: "rgba(0,0,0,0.7)!important",
                color: "#fff!important",
                minWidth: "unset",
                width: 25,
                height: 25,
                borderRadius: 999,
                zIndex: 999,
              }}
              onClick={() => {
                setImage(null);
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "20px",
                }}
              >
                close
              </span>
            </Button>
          </Box>
        )}
        <TextField
          fullWidth
          placeholder="What's on your mind? Press Ctrl+V to paste from clipboard."
          autoComplete="off"
          multiline
          InputProps={{
            disableUnderline: true,
          }}
          onKeyDown={(e) => {
            if (e.ctrlKey && e.key === "Enter" && value.trim() !== "") {
              document.getElementById("submit")?.click();
            }
          }}
          variant="standard"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          inputRef={ref}
        />
        <input
          type="file"
          id="imageAttachment"
          name="imageAttachment"
          style={{
            display: "none",
          }}
          onChange={async (e) => {
            const key = "da1f275ffca5b40715ac3a44aa77cf42";
            const asBase64 = (file: File) =>
              new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
              });

            const convertImageToImgbb = async (file: File) => {
              const str = await asBase64(file);
              return str;
            };

            const str = await convertImageToImgbb(e.target.files![0]);
            const form = new FormData();
            form.append("image", e.target.files![0]);

            setImageUploading(true);
            fetch("https://api.imgbb.com/1/upload?name=image&key=" + key, {
              method: "POST",
              body: form,
            })
              .then((res) => res.json())
              .then((res) => {
                setImage(res.data);
                setImageUploading(false);
              })
              .catch((err) => {
                console.log(err);
                setImageUploading(false);
              });
          }}
          accept="image/png, image/jpeg"
        />
        <Box sx={{ display: "flex", mt: 1, alignItems: "center", gap: 0.5 }}>
          <IconButton
            disableRipple
            onClick={() => {
              document.getElementById("imageAttachment")?.click();
            }}
            disabled={image !== null}
          >
            {!imageUploading && (
              <span className="material-symbols-outlined">image</span>
            )}
            {imageUploading && <CircularProgress size={20} />}
          </IconButton>
          <IconButton disableRipple>
            <span className="material-symbols-outlined">palette</span>
          </IconButton>
          <Button
            disableRipple
            sx={{
              transition: "all 0.2s ease",
              "&:active": {
                transition: "none",
                opacity: 0.6,
              },
              mt: "-1px",
              minWidth: "auto",
              gap: 2,
              ml: "auto",
              borderRadius: 999,
              color: "#666",
            }}
            onClick={() => setVisibilityModalOpen(true)}
          >
            <span className="material-symbols-outlined">visibility</span> Only
            me
          </Button>
          <Box
            sx={{
              height: "30px",
              borderLeft: "1px solid rgba(0,0,0,.1)",
            }}
          />
          <IconButton
            disableRipple
            disabled={value.trim().length === 0}
            onClick={() => {
              const data = {
                content: value,
                ...(image !== null && { image: image.url }),
                public: contentVisibility === "My group",
              };
              setLoading(true);
              fetchApiWithoutHook("property/spaces/createItem", data)
                .then(() => {
                  setValue("");
                  setImage(null);
                  setContentVisibility("Only me");
                  ref.current?.focus();
                  setLoading(false);
                  toast.success("Post created");
                  const e: any = document?.getElementById("imageAttachment");
                  e.value = "";
                  mutate(url);
                })
                .catch((err) => {
                  toast.error("Something went wrong");
                  setLoading(false);
                });
            }}
            id="submit"
          >
            {!loading && (
              <span className="material-symbols-rounded">add_circle</span>
            )}
            {loading && <CircularProgress size={20} />}
          </IconButton>
        </Box>
      </Box>
    </>
  );
}

function SearchPosts({ data, setData, originalData }) {
  const handleChange = (e) => {
    const query = e.target.value;
    setData(
      originalData.filter((item) => {
        return item.content.toLowerCase().includes(query.toLowerCase());
      })
    );
  };
  return (
    <>
      <TextField
        autoFocus
        onChange={handleChange}
        fullWidth
        placeholder="Search posts"
        autoComplete="off"
        sx={{
          mt: 2,
        }}
        InputProps={{
          disableUnderline: true,
          startAdornment: (
            <InputAdornment position="start">
              <span className="material-symbols-outlined">search</span>
            </InputAdornment>
          ),
          sx: {
            background: global.user.darkMode
              ? "hsl(240,11%,17%)"
              : "rgba(200,200,200,0.3)",
            borderRadius: 5,
            p: 2,
            py: 1,
            border: "1px solid rgba(0,0,0,0)",
            "&:focus-within": {
              background: global.user.darkMode ? "hsl(240,11%,10%)" : "#fff",
              "&, & .MuiInput-root *": {
                cursor: "text",
              },
              border: global.user.darkMode
                ? "1px solid hsl(240,11%,50%)"
                : "1px solid rgba(0,0,0,.5)",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            },
          },
        }}
        variant="standard"
      />
    </>
  );
}

function Posts({ url, data: originalData }) {
  const [data, setData] = React.useState(originalData);

  React.useEffect(() => {
    setData(originalData);
  }, [originalData]);

  return (
    <>
      <CreatePostMenu url={url} />
      <SearchPosts data={data} setData={setData} originalData={originalData} />
      {data.length > 0 ? (
        <Box
          sx={{
            mr: -2,
          }}
        >
          <Masonry
            columns={{
              xs: 1,
              sm: 2,
            }}
            sx={{ mt: 2 }}
            spacing={2}
          >
            {data.map((item) => (
              <Post url={url} key={item.id} data={item} />
            ))}
          </Masonry>
        </Box>
      ) : (
        <Box
          sx={{
            p: 2,
            mt: 3,
            background: global.user.darkMode
              ? "hsl(240,11%,17%)"
              : "rgba(200,200,200,0.3)",
            borderRadius: 5,
          }}
        >
          {originalData.length == 0
            ? "No posts yet"
            : "No posts match your search criteria"}
        </Box>
      )}
    </>
  );
}

function ImageBox({ image }) {
  const trigger = useMediaQuery("(max-width: 600px)");

  const [open, setOpen] = React.useState(false);
  return (
    <Box
      sx={{
        position: "relative",
      }}
    >
      <Button
        variant="contained"
        disableElevation
        sx={{
          position: "absolute",
          top: 5,
          right: 5,
          backdropFilter: "blur(10px)",
          zIndex: 999,
          color: "#fff",
          background: "rgba(0,0,0,.5)!important",
          minWidth: "auto",
          p: 1,
          borderRadius: 999,
        }}
        onClick={async () => {
          toast.promise(
            new Promise((resolve, reject) => {
              const img: any = new Image();
              img.crossOrigin = "anonymous";
              const c: any = document.createElement("canvas");
              const ctx: any = c.getContext("2d");

              function setCanvasImage(path, func): any {
                img.onload = function () {
                  const e: any = this;
                  c.width = e.naturalWidth;
                  c.height = e.naturalHeight;
                  ctx.drawImage(this, 0, 0);
                  c.toBlob((blob) => {
                    func(blob);
                  }, "image/png");
                };
                img.src = path;
              }

              setCanvasImage(image, (imgBlob) => {
                navigator.clipboard
                  .write([new ClipboardItem({ "image/png": imgBlob })])
                  .then((e) => {
                    resolve("Image copied to clipboard");
                  })
                  .catch((e) => {
                    reject(e);
                  });
              });
            }),
            {
              loading: "Copying image...",
              success: "Image copied to clipboard",
              error: "Something went wrong",
            }
          );
        }}
      >
        <span className="material-symbols-outlined">content_copy</span>
      </Button>
      <img
        draggable={false}
        src={image}
        alt="Post image"
        style={{
          width: "100%",
          cursor: "pointer",
        }}
        onClick={() => setOpen(true)}
      />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        TransitionComponent={Grow}
        PaperProps={{
          sx: {
            maxHeight: "100vh",
            width: trigger ? "100vw" : "auto",
            background: "black",
            transform: "scale(.9)",
            maxWidth: "100vw",
          },
        }}
      >
        <img
          draggable={false}
          src={image}
          alt="Post image"
          style={{
            height: trigger ? "auto" : "100vh",
            width: trigger ? "100vw" : "auto",
          }}
        />
      </Dialog>
    </Box>
  );
}

const URL_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

const renderText = (txt) =>
  txt.split(" ").map((part) =>
    URL_REGEX.test(part) ? (
      <Link href={part} target="_blank">
        {part.replace("http://").replace("https://", "").replace(/\/$/, "")}{" "}
      </Link>
    ) : (
      part + " "
    )
  );

function Post({ data, url }) {
  const [emblaRef, emblaApi] = useEmblaCarousel();
  // When the embla carousel is scrolled to the second page, alert some text
  //  Current slide index
  const [deleteSlide, setDeleteSlide] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    if (emblaApi) {
      // Embla API is ready
      emblaApi.on("scroll", () => {
        setDeleteSlide(emblaApi.scrollProgress() >= 1 ? true : false);
      });
    }
  }, [emblaApi]);

  React.useEffect(() => {
    if (deleteSlide) {
      setLoading(true);
      fetchApiWithoutHook("property/spaces/deleteItem", {
        id: data.id,
      })
        .then(() => {
          mutate(url);
        })
        .catch(() => {
          toast.error("Something went wrong");
          setLoading(false);
        });
    }
  }, [deleteSlide]);

  return (
    <Box
      sx={{
        mt: 2,
        maxWidth: "calc(100vw - 32.5px)",
        border: {
          sm: global.user.darkMode
            ? "5px solid hsl(240,11%,17%)"
            : "5px solid #fff",
        },
        mb: { xs: 2, sm: 0 },
        background: global.user.darkMode
          ? "hsl(240,11%,17%)"
          : "rgba(200,200,200,0.3)",
        borderRadius: 5,
        overflow: "hidden",
        ...(loading && {
          opacity: 0.5,
        }),
      }}
      ref={emblaRef}
    >
      <div className="embla__container">
        <Box
          sx={{
            flex: "0 0 100%",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: data.user.name == global.user.name ? "none" : "flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              borderBottom: "1px solid rgba(0,0,0,.1)",
            }}
          >
            <Box
              sx={{
                width: "32px",
                height: "32px",
                border: "1px solid rgba(0,0,0,.4)",
                borderRadius: 999,
              }}
            >
              <Avatar
                name={data.user.name}
                variant="beam"
                size={30}
                colors={["#801245", "#F4F4DD", "#DCDBAF", "#5D5C49", "#3D3D34"]}
              />
            </Box>
            <Typography variant="body1">
              {data.user.name == global.user.name ? "You" : data.user.name}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                ml: "auto",
                color: "#666",
              }}
            >
              {dayjs(data.timestamp).fromNow()}
            </Typography>
          </Box>
          {data.image && <ImageBox image={data.image} />}
          <Typography
            variant="h6"
            sx={{
              p: 2,
              maxWidth: "100%",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {renderText(data.content)}
          </Typography>
        </Box>
        <Box
          sx={{
            width: "100%",
            flex: "0 0 100%",
            px: 2,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            background: colors.red[900],
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "30px",
            }}
          >
            delete
          </span>
        </Box>
      </div>
    </Box>
  );
}

export default function Spaces() {
  const { data, url, error } = useApi("property/spaces");

  return global.user.email === "manusvathgurudath@gmail.com" ? (
    <Box
      sx={{
        p: 2,
      }}
      className="mt-5 sm:mt-10 max-w-4xl mx-auto"
    >
      {data ? (
        <>
          <Typography
            sx={{ fontWeight: "600", mb: 2 }}
            variant="h5"
            gutterBottom
          >
            Spaces
          </Typography>
          <Posts url={url} data={data} />
        </>
      ) : (
        <Box>
          <Skeleton
            variant="rectangular"
            animation="wave"
            height={40}
            width={100}
            sx={{ borderRadius: 5, mb: 2 }}
          />
          <Skeleton
            variant="rectangular"
            animation="wave"
            height={120}
            sx={{ borderRadius: 5, mb: 2 }}
          />
          <Skeleton
            variant="rectangular"
            animation="wave"
            height={60}
            sx={{ borderRadius: 5, mb: 2 }}
          />
          <Box
            sx={{
              mr: -2,
              mt: 2,
            }}
          >
            <Masonry columns={2} spacing={2}>
              {[...Array(10)].map((_, i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  animation="wave"
                  height={200}
                  sx={{
                    borderRadius: 5,
                    mb: 2,
                  }}
                />
              ))}
            </Masonry>
          </Box>
        </Box>
      )}
    </Box>
  ) : (
    <div className="bg-gray-900 px-7 py-5 rounded-xl shadow-xl mt-10 max-w-lg mx-auto text-gray-50">
      <h1 className="text-xl">Gamify your productivity</h1>
      <h2 className="text-md mt-2 font-thin">
        Carbon Spaces is a place to store links, images, thoughts and more. With
        Spaces, you can organize your thoughts and ideas into a single place and
        access them from anywhere. You can also allow family/dorm members to see
        your posts!
      </h2>
      <Button
        className="text-gray-50 border-gray-50 border-2 mt-5 w-full hover:border-2 hover:border-gray-100"
        variant="outlined"
        onClick={() => {
          toast.success("You'll get an email when Spaces is released!");
        }}
      >
        Join the waitlist
      </Button>
    </div>
  );
}
