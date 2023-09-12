import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Avatar,
  AvatarGroup,
  Box,
  Chip,
  Grid,
  Icon,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { BoardContext } from ".";
import IntegrationChip from "./IntegrationChip";
import BoardSettings from "./Settings";

export function BoardInfo({ setCurrentColumn, showInfo, setShowInfo }) {
  const { board, permissions, isShared, mutateData } = useContext(BoardContext);

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
        }).then(mutateData),
        {
          loading: "Updating...",
          success: "Updated board!",
          error: "An error occurred while updating the board",
        }
      );
    }
  }, [
    titleRef,
    descriptionRef,
    board.description,
    board.id,
    board.name,
    mutateData,
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
            (m) => m.user.email == session.user.email
          ),
          ...board.shareTokens,
        ]
  )
    .filter((member) => member.user.email)
    .filter(
      (member, index, self) =>
        self.findIndex((m) => m.user.email === member.user.email) === index
    );

  const isMobile = useMediaQuery("(max-width: 600px)");

  async function registerPeriodicSync() {
    const registration = await navigator.serviceWorker.ready;
    try {
      await (registration as any).periodicSync.register(
        "dysperse-integration-sync",
        {
          minInterval: 1 * 60 * 60 * 1000,
        }
      );
      console.log("Periodic Sync registered!");
    } catch {
      console.log("Periodic Sync could not be registered!");
    }
  }

  useEffect(() => {
    registerPeriodicSync();
  }, []);

  return (
    <Box
      onClick={(e) => {
        if (e.detail === 2 && !isMobile) {
          setShowInfo((s) => !s);
          localStorage.setItem("showInfo", showInfo ? "true" : "false");
        }
      }}
      sx={{
        transform: "translateZ(0)",
        borderRadius: 5,
        height: { xs: "100%", md: "calc(100dvh - 20px)" },
        minHeight: { xs: "100%", md: "unset" },
        background: {
          xs: `transparent`,
          md: addHslAlpha(palette[2], 0.8),
        },
        m: { md: "10px" },
        position: { md: "sticky" },
        left: { md: "10px" },
        zIndex: { md: 999 },
        flexGrow: 1,
        flexBasis: 0,
        flex: { xs: "100%", md: "unset" },
        p: { xs: 3, sm: 4 },
        py: showInfo ? 3 : 2,
        pt: { xs: 5, md: 0 },
        overflowY: "scroll",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        minWidth: { md: !showInfo ? "auto" : "320px" },
        maxWidth: { md: "300px" },
        width: { xs: "100%", sm: "20px" },
        backdropFilter: { md: "blur(20px)!important" },
        ...(!showInfo && {
          opacity: "0!important",
          transform: "translateX(-100px)",
        }),
      }}
    >
      {showInfo ? (
        <>
          <Box sx={{ mt: "auto", p: { xs: 1, sm: 0 } }}>
            {collaborators.length > 1 && (
              <AvatarGroup max={6} sx={{ my: 1, justifyContent: "start" }}>
                {collaborators.slice(0, 5).map((member) => (
                  <Tooltip key={member.id} title={member.user.name}>
                    <Avatar
                      src={member?.user?.Profile?.picture}
                      sx={{
                        width: "30px",
                        height: "30px",
                        fontSize: "15px",
                        borderColor: { xs: palette[1] + "!important" },
                      }}
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
              disabled={
                session.permission === "read-only" ||
                board.archived ||
                permissions == "read"
              }
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
                  fontSize: { xs: "50px", sm: "60px" },
                  lineHeight: { xs: "55px", sm: "65px" },
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
              disabled={
                session.permission === "read-only" ||
                board.archived ||
                permissions == "read"
              }
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
                  mt: -1,
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
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {!board.public && (
                <Chip label={"Private"} icon={<Icon>lock</Icon>} />
              )}
              {permissions === "read" && (
                <Chip label={"View only"} icon={<Icon>visibility</Icon>} />
              )}
              {board.pinned && !isShared && (
                <Chip label="Pinned" icon={<Icon>push_pin</Icon>} />
              )}
              {isShared && <Chip label="Shared" icon={<Icon>link</Icon>} />}
              {board.archived && (
                <Chip label="Archived" icon={<Icon>inventory_2</Icon>} />
              )}
              {permissions !== "read" &&
                board.integrations?.map((integration) => (
                  <IntegrationChip
                    key={integration.name}
                    integration={integration}
                    boardId={board.id}
                    session={session}
                  />
                ))}
            </Box>
          </Box>

          {isMobile && (
            <Grid container>
              {board.columns.map((column, index) => (
                <Grid
                  item
                  xs={6}
                  sx={{ p: 1 }}
                  key={column.id}
                  onClick={() => setCurrentColumn(index)}
                >
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1, bounce: 0 }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        background: palette[2],
                        border: `2px solid ${palette[3]}`,
                        "&:active": {
                          borderColor: palette[9],
                        },
                        borderRadius: 4,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <img
                        src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${column.emoji}.png`}
                        alt="Column icon"
                        width={30}
                        height={30}
                      />
                      <Typography
                        variant="h6"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {column.name}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}
          <Box
            sx={{
              mt: { xs: 3, sm: "auto" },
              display: "flex",
              width: "100%",
            }}
          >
            {permissions !== "read" && <BoardSettings id={board.id} />}
            {permissions !== "read" && (
              <IconButton
                size="large"
                sx={{
                  ml: { xs: "auto", sm: "0" },
                }}
                disabled={board.archived}
                onClick={() =>
                  router.push(`/tasks/boards/edit/${board.id}#permissions`)
                }
              >
                <Icon className="outlined">ios_share</Icon>
              </IconButton>
            )}
            <IconButton
              size="large"
              sx={{
                ml: "auto",
                ...(isMobile && {
                  display: "none",
                }),
              }}
              onClick={() => {
                setShowInfo(false);
                localStorage.setItem("showInfo", "false");
              }}
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
              transition: "all .2s",
              my: "auto",
              fontSize: "30px",
            }}
            className="font-heading"
          >
            {board.name.substring(0, 25)}
            {board.name.length > 25 && "..."}
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
