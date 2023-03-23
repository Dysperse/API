import {
  Box,
  Chip,
  Icon,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { mutate } from "swr";
import { useRawApi } from "../../../lib/client/useApi";
import { toastStyles } from "../../../lib/client/useTheme";
import { useSession } from "../../../pages/_app";
import BoardSettings from "./Settings";

export function BoardInfo({
  setMobileOpen,
  board,
  showInfo,
  mutationUrls,
  setShowInfo,
  setDrawerOpen,
}) {
  const titleRef: any = useRef();
  const descriptionRef: any = useRef();

  useEffect(() => {
    if (!descriptionRef.current || !descriptionRef.current || !board) return;
    titleRef.current.value = board.name;
    descriptionRef.current.value = board.description;
  }, [board, titleRef, descriptionRef]);

  const handleSave = useCallback(() => {
    if (
      !(
        (titleRef.current.value == board.name &&
          descriptionRef.current.value === board.description) ||
        titleRef.current.value.trim() == ""
      )
    ) {
      toast.promise(
        useRawApi("property/boards/edit", {
          id: board.id,
          name: titleRef.current.value,
          description: descriptionRef.current.value,
        }).then(() => mutate(mutationUrls.boardData)),
        {
          loading: "Updating...",
          success: "Updated board!",
          error: "An error occurred while updating the board",
        },
        toastStyles
      );
    }
  }, [titleRef, descriptionRef]);
  const session = useSession();

  return (
    <Box
      className="snap-center"
      sx={{
        borderRadius: 5,
        mt: { xs: 0, md: "10px" },
        ml: { xs: 0, md: "10px" },
        height: { xs: "500px", md: "calc(100vh - 20px)" },
        minHeight: { xs: "100%", md: "unset" },
        background: {
          md: showInfo
            ? session.user.darkMode
              ? "hsla(240,11%,15%, 0.8)"
              : "hsla(240, 11%, 95%, 0.5)"
            : session.user.darkMode
            ? "hsla(240,11%,13%, 0.8)"
            : "rgba(200,200,200,.1)",
        },
        border: { xs: "1px solid", md: "none" },
        borderColor: session.user.darkMode
          ? "hsla(240,11%,13%, 0.8)!important"
          : "rgba(200,200,200,.4)!important",
        position: { md: "sticky" },
        left: "10px",
        zIndex: 9,
        mr: { xs: 0, md: 2 },
        flexGrow: 1,
        flexBasis: 0,
        flex: { xs: "0 0 calc(100% - 70px)", md: "unset" },
        p: 4,
        py: showInfo ? 3 : 2,
        overflowY: "scroll",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        minWidth: { md: !showInfo ? "auto" : "320px" },
        maxWidth: { md: "300px" },
        backdropFilter: "blur(20px)!important",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(200,200,200,.3)",
          height: "75px",
          width: "3px",
          right: "10px",
          display: { md: "none" },
          borderRadius: 9999,
        }}
      />
      {showInfo ? (
        <>
          <Box sx={{ mt: "auto" }}>
            <TextField
              defaultValue={board.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                e.target.value = e.target.value.replace(/\n|\r/g, "");
              }}
              inputRef={titleRef}
              placeholder="Board name"
              multiline
              onBlur={handleSave}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                className: "font-heading",
                sx: {
                  borderRadius: 2,
                  p: 1,
                  ml: -1,
                  mb: 0.5,
                  fontSize: "40px",
                  py: 0.5,
                  "&:focus-within": {
                    background: `hsl(240,11%,${
                      session.user.darkMode ? 18 : 50
                    }%)`,
                  },
                },
              }}
            />
            <TextField
              multiline
              defaultValue={board.description}
              inputRef={descriptionRef}
              onBlur={handleSave}
              placeholder="Click to add description"
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: {
                  borderRadius: 2,
                  p: 1,
                  mb: 0.5,
                  ml: -1,
                  py: 1,
                  "&:focus-within": {
                    background: session.user.darkMode
                      ? "hsl(240,11%,18%)"
                      : "rgba(200,200,200,.2)",
                  },
                },
              }}
              maxRows={3}
            />
            <Box sx={{ my: 1 }}>
              <Chip
                sx={{ mr: 1, mb: 1 }}
                label={board.public ? "Public" : "Private"}
                icon={<Icon>{board.public ? "public " : "lock"}</Icon>}
              />
              {board.pinned && (
                <Chip
                  label="Pinned"
                  sx={{ mr: 1, mb: 1 }}
                  icon={<Icon>push_pin</Icon>}
                />
              )}
              {board.archived && (
                <Chip
                  label="Archived"
                  sx={{ mr: 1, mb: 1 }}
                  icon={<Icon>inventory_2</Icon>}
                />
              )}
              {board.integrations.find(
                (integration) => integration.name == "Canvas LMS"
              ) && (
                <Chip
                  onClick={async () => {
                    setMobileOpen(false);
                    toast.promise(
                      new Promise(async (resolve, reject) => {
                        try {
                          await useRawApi("property/integrations/run/canvas", {
                            boardId: board.id,
                          });
                          await mutate(mutationUrls.tasks);
                          resolve("Success");
                        } catch (e: any) {
                          reject(e.message);
                        }
                      }),
                      {
                        loading: (
                          <div className="flex items-center gap-5">
                            <div>
                              <Typography>
                                Importing your assignments...
                              </Typography>
                              <Typography variant="body2">
                                Hang tight - this may take a while
                              </Typography>
                            </div>
                            <picture>
                              <img
                                src="https://i.ibb.co/4sNZm4T/image.png"
                                alt="Canvas logo"
                                className="h-7 w-7 rounded-full"
                              />
                            </picture>
                          </div>
                        ),
                        success: "Synced to Canvas!",
                        error:
                          "Yikes! An error occured. Please try again later",
                      },
                      toastStyles
                    );
                  }}
                  label="Resync to Canvas"
                  sx={{
                    mr: 1,
                    mb: 1,
                    background:
                      "linear-gradient(45deg, #FF0080 0%, #FF8C00 100%)",
                    color: "#000",
                  }}
                  icon={
                    <Icon
                      sx={{
                        color: "#000!important",
                      }}
                    >
                      refresh
                    </Icon>
                  }
                />
              )}
            </Box>
          </Box>

          <Box sx={{ mt: "auto", display: "flex", width: "100%" }}>
            <IconButton
              sx={{ mr: "auto", display: { md: "none" } }}
              onClick={() => {
                setDrawerOpen(true);
                navigator.vibrate(50);
              }}
            >
              <Icon className="outlined">unfold_more</Icon>
            </IconButton>
            <BoardSettings mutationUrl={mutationUrls.boardData} board={board} />
            <IconButton
              sx={{
                ml: "auto",
                display: { xs: "none", md: "flex" },
              }}
              onClick={() => setShowInfo(false)}
            >
              <Icon className="outlined">menu_open</Icon>
            </IconButton>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <IconButton
            onClick={() => setShowInfo(true)}
            sx={{ opacity: 0, pointerEvents: "none" }}
          >
            <Icon className="outlined">menu</Icon>
          </IconButton>
          <Typography
            sx={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              transform: "rotate(180deg)",
              my: "auto",
              fontWeight: "700",
            }}
          >
            Board info
          </Typography>
          <IconButton onClick={() => setShowInfo(true)}>
            <Icon className="outlined">menu</Icon>
          </IconButton>
        </Box>
      )}
    </Box>
  );
}
