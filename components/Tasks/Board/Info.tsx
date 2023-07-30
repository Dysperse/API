import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { toastStyles } from "@/lib/client/useTheme";
import {
  Avatar,
  AvatarGroup,
  Box,
  Chip,
  Icon,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { mutate } from "swr";
import { BoardContext } from ".";
import IntegrationChip from "./IntegrationChip";
import BoardSettings from "./Settings";
import { ShareBoard } from "./Share";

export function BoardInfo({ setMobileOpen, showInfo, setShowInfo }) {
  const { board, isShared, mutationUrls } = useContext(BoardContext);

  const titleRef: any = useRef();
  const descriptionRef: any = useRef();
  const session = useSession();

  useEffect(() => {
    if (!descriptionRef.current || !descriptionRef.current || !board) return;
    titleRef.current.value = board.name;
    descriptionRef.current.value = board.description;
  }, [board, titleRef, descriptionRef]);

  const handleSave = useCallback(() => {
    if (
      !(
        (titleRef.current.value === board.name &&
          descriptionRef.current.value === board.description) ||
        titleRef.current.value.trim() === ""
      )
    ) {
      toast.promise(
        fetchRawApi(session, "property/boards/edit", {
          id: board.id,
          name: titleRef.current.value,
          description: descriptionRef.current.value,
        }).then(async () => {
          await mutate(mutationUrls.boardData);
          await mutate(mutationUrls.tasks);
        }),
        {
          loading: "Updating...",
          success: "Updated board!",
          error: "An error occurred while updating the board",
        },
        toastStyles,
      );
    }
  }, [
    titleRef,
    descriptionRef,
    board.description,
    board.id,
    board.name,
    mutationUrls,
    session,
  ]);
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));
  const router = useRouter();

  // Unique list of collaborators based on member email
  const collaborators = (
    board.public
      ? [...board.property.members, ...board.shareTokens]
      : [
          ...board.property.members.filter(
            (m) => m.user.email == session.user.email,
          ),
          ...board.shareTokens,
        ]
  )
    .filter((member) => member.user.email)
    .filter(
      (member, index, self) =>
        self.findIndex((m) => m.user.email === member.user.email) === index,
    );

  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <Box
      sx={{
        scrollSnapType: { xs: "x mandatory", sm: "unset" },
        borderRadius: 5,
        mt: { xs: 0, md: "10px" },
        ml: { xs: 0, md: "10px" },
        height: { xs: "500px", md: "calc(100vh - 20px)" },
        minHeight: { xs: "100%", md: "unset" },
        background: {
          xs: `linear-gradient(${addHslAlpha(palette[4], 0.3)}, ${addHslAlpha(
            palette[6],
            0.3,
          )})`,
          md: addHslAlpha(palette[3], 0.3),
        },
        position: { md: "sticky" },
        left: "10px",
        zIndex: 999,
        mr: { xs: 0, md: 2 },
        flexGrow: 1,
        flexBasis: 0,
        flex: { xs: "0 0 calc(100% - 70px)", md: "unset" },
        p: 4,
        py: showInfo ? 3 : 2,
        pt: { xs: 5, md: 0 },
        overflowY: "scroll",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        minWidth: { md: !showInfo ? "auto" : "320px" },
        maxWidth: { md: "300px" },
        backdropFilter: "blur(20px)!important",
        ...(typeof showInfo !== "boolean" &&
          typeof showInfo !== "object" && {
            opacity: "0!important",
            transform: "translateX(-100px)",
          }),
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          background: palette[5],
          height: "75px",
          width: "3px",
          right: "14px",
          display: { md: "none" },
          borderRadius: 9999,
        }}
      />
      {showInfo ? (
        <>
          <Box sx={{ mt: "auto" }}>
            {collaborators.length > 1 && (
              <AvatarGroup max={6} sx={{ my: 1, justifyContent: "start" }}>
                {collaborators.slice(0, 5).map((member) => (
                  <Tooltip key={member.id} title={member.user.name}>
                    <Avatar
                      src={member?.user?.Profile?.picture}
                      sx={{ width: "30px", height: "30px", fontSize: "15px" }}
                      onClick={() => router.push(`/users/${member.user.email}`)}
                    >
                      {member?.user?.name?.substring(0, 2)?.toUpperCase()}
                    </Avatar>
                  </Tooltip>
                ))}
                {collaborators.length > 5 && (
                  <Avatar
                    sx={{ width: "30px", height: "30px", fontSize: "15px" }}
                  >
                    +{collaborators.length - 5}
                  </Avatar>
                )}
              </AvatarGroup>
            )}
            <TextField
              spellCheck={false}
              disabled={session.permission === "read-only" || board.archived}
              defaultValue={board.name}
              onChange={(e: any) => {
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
                  fontSize: "60px",
                  lineHeight: "65px",
                  py: 0.5,
                  "&:focus-within": {
                    background: addHslAlpha(palette[4], 0.8),
                    "&, & *": { textTransform: "none!important" },
                  },
                },
              }}
              onKeyDown={(e: any) => {
                if (!e.shiftKey && e.code === "Enter") e.target.blur();
              }}
            />
            <TextField
              spellCheck={false}
              multiline
              defaultValue={board.description}
              inputRef={descriptionRef}
              disabled={session.permission === "read-only" || board.archived}
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
                    background: addHslAlpha(palette[4], 0.8),
                  },
                },
              }}
              onKeyDown={(e: any) => {
                if (!e.shiftKey && e.code === "Enter") e.target.blur();
              }}
              maxRows={3}
            />
            <Box sx={{ my: 1 }}>
              {!board.public && (
                <Chip
                  sx={{ mr: 1, mb: 1 }}
                  label={"Private"}
                  icon={<Icon>lock</Icon>}
                />
              )}
              {board.pinned && !isShared && (
                <Chip
                  label="Pinned"
                  sx={{ mr: 1, mb: 1 }}
                  icon={<Icon>push_pin</Icon>}
                />
              )}
              {isShared && (
                <Chip
                  label="Shared"
                  sx={{ mr: 1, mb: 1 }}
                  icon={<Icon>link</Icon>}
                />
              )}
              {board.archived && (
                <Chip
                  label="Archived"
                  sx={{ mr: 1, mb: 1 }}
                  icon={<Icon>inventory_2</Icon>}
                />
              )}
              {board.integrations?.map((integration) => (
                <IntegrationChip
                  mutationUrls={mutationUrls}
                  key={integration.name}
                  integration={integration}
                  boardId={board.id}
                  session={session}
                  mutate={mutate}
                />
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              mt: "auto",
              display: "flex",
              width: "100%",
            }}
          >
            <BoardSettings
              isShared={isShared}
              mutationUrls={mutationUrls}
              board={board}
            />
            <ShareBoard
              board={board}
              isShared={isShared}
              mutationUrls={mutationUrls}
            >
              <IconButton
                size="large"
                sx={{ ml: { xs: "auto", sm: "0" } }}
                disabled={board.archived}
              >
                <Icon className="outlined">ios_share</Icon>
              </IconButton>
            </ShareBoard>
            <IconButton
              size="large"
              sx={{
                ml: "auto",
                ...(isMobile && {
                  position: "absolute",
                  top: 0,
                  right: 0,
                  m: 1,
                  color: palette[8],
                }),
              }}
              onClick={() => {
                if (isMobile) {
                  setMobileOpen(false);
                  return;
                }
                setShowInfo(false);
                localStorage.setItem("showInfo", "false");
              }}
            >
              <Icon className="outlined">
                {isMobile ? "close" : "menu_open"}
              </Icon>
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
            onClick={() => {
              setShowInfo(true);
              localStorage.setItem("showInfo", "true");
            }}
            sx={{ opacity: 0, pointerEvents: "none" }}
            size="large"
          >
            <Icon className="outlined">menu</Icon>
          </IconButton>
          <Typography
            sx={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              transform: "rotate(180deg)",
              my: "auto",
              fontSize: "30px",
            }}
            className="font-heading"
          >
            {board.name.substring(0, 15)}
            {board.name.length > 15 && "..."}
          </Typography>
          <IconButton
            onClick={() => {
              setShowInfo(true);

              localStorage.setItem("showInfo", "true");
            }}
          >
            <Icon className="outlined">menu</Icon>
          </IconButton>
        </Box>
      )}
    </Box>
  );
}
