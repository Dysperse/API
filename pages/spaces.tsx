import { Masonry } from "@mui/lab";
import Avatar from "boring-avatars";
import dayjs from "dayjs";
import Head from "next/head";
import React from "react";
import toast from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { mutate } from "swr";
import { Puller } from "../components/Puller";
import { fetchApiWithoutHook, useApi } from "../hooks/useApi";
import { colors } from "../lib/colors";

import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  Grow,
  Icon,
  IconButton,
  InputAdornment,
  Link,
  Skeleton,
  SwipeableDrawer,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";

const isValidUrl = (urlString) => {
  var urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // validate fragment locator
  return !!urlPattern.test(urlString);
};

function LinkModal({ value, setValue }) {
  const [link, setLink] = React.useState("");
  const [open, setOpen] = React.useState(false);

  return (
    <Box
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <IconButton onClick={() => setOpen(true)}>
        <Icon className="outlined">link</Icon>
      </IconButton>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            p: 3,
            borderRadius: 5,
            width: "100%",
            background: global.user.darkMode ? "hsl(240,11%,18%)" : "#fff",
          },
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: "900",
          }}
        >
          Insert link
        </Typography>
        <TextField
          variant="filled"
          label="URL"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{
            borderRadius: 999,
            mt: 2,
            background:
              (global.theme === "dark"
                ? "hsl(240,11%,30%)"
                : colors[themeColor][900]) + "!important",
          }}
          onClick={() => {
            if (isValidUrl(link)) {
              setValue(value + link);
              setLink("");
              setOpen(false);
            } else {
              toast.error("Please enter a valid URL");
            }
          }}
        >
          Insert
        </Button>
      </Dialog>
    </Box>
  );
}

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
          sx: {
            borderRadius: "20px 20px 0 0",
            maxWidth: "500px",
          },
        }}
      >
        <Puller />
        <Box sx={{ p: 3, pt: 0 }}>
          <Typography variant="h6" gutterBottom sx={{ m: "5px!important" }}>
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
              description: "People in your group can view and edit this note",
            },
          ].map((item) => (
            <Button
              key={item.name}
              onClick={() => {
                setContentVisibility(item.name);
                setVisibilityModalOpen(false);
              }}
              sx={{
                justifyContent: "flex-start",
                borderRadius: 3,
                my: 0.5,
              }}
              fullWidth
              size="large"
            >
              <Icon className="outlined">{item.icon}</Icon>
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
              {contentVisibility === item.name && (
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
                alt="Post viewer"
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
                zIndex: 99,
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
          placeholder="What's on your mind? (PRO TIP: Directly hit CTRL+V to paste text and share it)"
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
          onChange={async (e: any) => {
            const key = "da1f275ffca5b40715ac3a44aa77cf42";
            const form = new FormData();
            form.append("image", e.target.files[0]);

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
          <LinkModal setValue={setValue} value={value} />
          <IconButton
            disableRipple
            onClick={() => {
              document.getElementById("imageAttachment")?.click();
            }}
            disabled={image !== null}
          >
            {!imageUploading && <Icon className="outlined">image</Icon>}
            {imageUploading && <CircularProgress size={20} />}
          </IconButton>
          <IconButton>
            <Icon className="outlined">palette</Icon>
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
              color: global.user.darkMode ? "hsl(240,11%,95%)" : "#666",
            }}
            onClick={() => setVisibilityModalOpen(true)}
          >
            <Icon className="outlined">visibility</Icon>
            {contentVisibility}
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
                .catch(() => {
                  toast.error("Something went wrong");
                  setLoading(false);
                });
            }}
            sx={{
              color: global.user.darkMode ? "hsl(240,11%,95%)" : "#666",
              ...(value.trim().length === 0 && {
                color: global.user.darkMode
                  ? "hsl(240,11%,70%)!important"
                  : "#666!important",
              }),
            }}
            id="submit"
          >
            {!loading && <Icon className="outlined">add_circle</Icon>}
            {loading && <CircularProgress size={20} />}
          </IconButton>
        </Box>
      </Box>
    </>
  );
}

function SearchPosts({ setData, originalData }) {
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
        onChange={handleChange}
        placeholder="Search memos..."
        sx={{
          mt: 2,
        }}
        InputProps={{
          disableUnderline: true,
          startAdornment: (
            <InputAdornment position="start">
              <Icon className="outlined">search</Icon>
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
      <SearchPosts setData={setData} originalData={originalData} />
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
          {originalData.length === 0
            ? "You haven't created any memos yet."
            : "No memos match your search criteria"}
        </Box>
      )}
    </>
  );
}

function ImageBox({ isTrigger, image }) {
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
        sx={{
          position: "absolute",
          display: isTrigger ? "none" : "flex",
          top: 5,
          right: 5,
          backdropFilter: "blur(10px)",
          zIndex: 99,
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
                  .then(() => resolve("Image copied to clipboard"))
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
        <Icon className="outlined">content_copy</Icon>
      </Button>
      <picture>
        <img
          draggable={false}
          src={image}
          alt="Post viewer"
          style={{
            width: "100%",
            cursor: "pointer",
          }}
          onClick={() => setOpen(true)}
          role="button"
        />
      </picture>
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
        <picture>
          <img
            role="button"
            draggable={false}
            src={image}
            alt="Post viewer"
            style={{
              height: trigger ? "auto" : "100vh",
              width: trigger ? "100vw" : "auto",
            }}
          />
        </picture>
      </Dialog>
    </Box>
  );
}

function Post({ data, url }) {
  const [expanded, setExpanded] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const PostCard = ({ trigger = false }: { trigger?: boolean }) => (
    <Box
      onClick={() => {
        trigger && setExpanded(!expanded);
      }}
      sx={{
        maxWidth: "calc(100vw - 32.5px)",
        background: !trigger
          ? "transparent"
          : global.user.darkMode
          ? "hsl(240,11%,17%)"
          : "rgba(200,200,200,0.3)",
        borderRadius: 5,
        overflow: "hidden",
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        ...(trigger && {
          cursor: "pointer",
          transition: "transform .2s",
          "&:active": {
            transform: "scale(.97)",
            transition: "none",
          },
        }),
      }}
    >
      <Box
        sx={{
          display: data.user.name === global.user.name ? "none" : "flex",
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
          {data.user.name === global.user.name ? "You" : data.user.name}
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
      <div style={{ ...(trigger && { pointerEvents: "none" }) }}>
        {data.image && <ImageBox image={data.image} isTrigger={trigger} />}
      </div>

      <Box
        sx={{
          p: 2,
          "& .contains-task-list li": {
            height: "40px",
            display: "flex",
            alignItems: "center",
          },
        }}
      >
        <div className="prose dark:prose-invert">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            linkTarget="_blank"
            skipHtml={true}
            disallowedElements={[
              "h4",
              "h5",
              "h6",
              "table",
              "thead",
              "tbody",
              "tfoot",
              "tr",
            ]}
            components={{
              h1: ({ children }) => (
                <Typography
                  variant="h3"
                  gutterBottom
                  sx={{
                    mb: "5px!important",
                    fontSize: "35px!important",
                    fontWeight: "500!important",
                  }}
                >
                  {children}
                </Typography>
              ),
              h2: ({ children }) => (
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{
                    mb: "5px!important",
                    fontSize: "30px!important",
                    fontWeight: "300!important",
                  }}
                >
                  {children}
                </Typography>
              ),
              h3: ({ children }) => (
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ mb: "10px!important", fontSize: "25px!important" }}
                >
                  {children}
                </Typography>
              ),
              p: ({ children }) => (
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: "600",
                  }}
                >
                  {children}
                </Typography>
              ),
              li: ({ children }) => (
                <Typography
                  variant="h6"
                  sx={{
                    m: "0!important",
                    mb: "7px!important",
                    fontWeight: "300!important",
                  }}
                  component="li"
                >
                  {children}
                </Typography>
              ),
              img: ({ src }) => <ImageBox isTrigger={false} image={src} />,
              input: ({ checked }) => (
                <Checkbox
                  checked={checked}
                  disableRipple
                  disabled
                  sx={{
                    ml: -5,
                    zIndex: 1,
                    backdropFilter: "blur(999px)",
                  }}
                />
              ),
              a: ({ href, children }) => (
                <Link
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: colors.blue["600"] + "!important",
                  }}
                >
                  {children}
                </Link>
              ),
            }}
          >
            {data.content}
          </ReactMarkdown>
        </div>
        {data.user.name === global.user.name && (
          <Typography
            variant="body1"
            sx={{
              ml: "auto",
              color: "#666",
            }}
          >
            {dayjs(data.timestamp).fromNow()}
          </Typography>
        )}
      </Box>
    </Box>
  );
  return (
    <Box>
      <Dialog
        TransitionComponent={Grow}
        open={expanded}
        onClose={() => setExpanded(false)}
        PaperProps={{
          sx: {
            borderRadius: 5,
            width: "100%",
          },
        }}
      >
        <Box
          sx={{
            p: 1,
            px: 2,
            width: "100%",
            background: global.user.darkMode ? "hsl(240,11%,16%)" : "#eee",
            display: "flex",
            alignItems: "center",
          }}
        >
          Post
          <IconButton
            sx={{ ml: "auto" }}
            disableRipple
            disabled={loading}
            onClick={() => {
              setLoading(true);
              fetchApiWithoutHook("property/spaces/deleteItem", {
                id: data.id,
              })
                .then(() => {
                  setExpanded(false);
                  mutate(url);
                })
                .catch(() => {
                  toast.error("Something went wrong");
                  setExpanded(false);
                  setLoading(false);
                });
            }}
          >
            <Icon className="outlined">delete</Icon>
          </IconButton>
        </Box>
        <PostCard />
      </Dialog>
      <PostCard trigger />
    </Box>
  );
}

export default function Spaces() {
  const { data, url } = useApi("property/spaces");

  return (
    <Box
      sx={{
        p: 2,
      }}
      className="mt-5 sm:mt-10 max-w-4xl mx-auto"
    >
      <Head>
        <title>Spaces &bull; Carbon</title>
      </Head>
      {data ? (
        <>
          <Typography
            sx={{
              fontWeight: "600",
              mb: 2,
              display: "flex",
              alignItems: "center",
            }}
            variant="h5"
            gutterBottom
          >
            Spaces
            <Tooltip
              title="Spaces is a places where you can store memos to yourself, or share it with members in your group. Maximize your productivity by keeping links, images, and text, and files at hand!"
              sx={{ ml: "auto" }}
            >
              <IconButton>
                <Icon className="outlined">help</Icon>
              </IconButton>
            </Tooltip>
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
  );
}
