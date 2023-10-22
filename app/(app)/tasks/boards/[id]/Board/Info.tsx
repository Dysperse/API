import { containerRef } from "@/app/(app)/container";
import { ProfilePicture } from "@/components/Profile/ProfilePicture";
import { FriendPopover } from "@/components/Start/Friend";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Chip,
  Grid,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { BoardContext } from ".";
import IntegrationChip from "./IntegrationChip";

function FilterSettings() {
  const { filter, setFilter } = useContext(BoardContext);

  const { session } = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const [showMore, setShowMore] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const filters = [
    { key: "", name: "Urgency + Completion", advanced: false },
    { key: "a-z", name: "A-Z", advanced: false },
    { key: "due", name: "Due date (new to old)", advanced: false },
    { key: "modification", name: "Last modified", advanced: false },
    { key: "completed-at", name: "Last completed", advanced: false },
    { key: "color", name: "Has color?", advanced: true },
    { key: "attachment", name: "Has attachment?", advanced: true },
    { key: "attachment", name: "Has reminders?", advanced: true },
    { key: "subtasks", name: "Has subtasks?", advanced: true },
  ];

  return (
    <>
      <Chip
        onClick={handleClick}
        label={
          filter !== "" ? filters.find((s) => s.key === filter)?.name : "Filter"
        }
        icon={<Icon>filter_list</Icon>}
        {...(filter !== "" && { onDelete: () => setFilter("") })}
      />

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {filters
          .filter((s) => !s.advanced)
          .map((_filter) => (
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                setFilter(_filter.key);
              }}
              key={_filter.key}
            >
              <Icon>{filter === _filter.key && "check"}</Icon>
              {_filter.name}
            </MenuItem>
          ))}
        <MenuItem
          onClick={() => setShowMore((s) => !s)}
          sx={{ background: palette[4] }}
        >
          {showMore ? "Hide" : "Show"} more
          <Icon sx={{ ml: "auto" }}>
            {!showMore ? "expand_more" : "expand_less"}
          </Icon>
        </MenuItem>
        {showMore &&
          filters
            .filter((s) => s.advanced)
            .map((_filter) => (
              <MenuItem
                onClick={() => {
                  setAnchorEl(null);
                  setFilter(_filter.key);
                }}
                key={_filter.key}
              >
                <Icon>{filter === _filter.key && "check"}</Icon>
                {_filter.name}
              </MenuItem>
            ))}
      </Menu>
    </>
  );
}

export function BoardInfo({ setCurrentColumn, showInfo, setShowInfo }) {
  const { board, filter, setFilter, permissions, isShared, mutateData } =
    useContext(BoardContext);

  const titleRef: any = useRef();
  const descriptionRef: any = useRef();
  const { session } = useSession();

  const [isHovered, setHover] = useState(true);

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
    } catch {
      console.log("Periodic Sync could not be registered!");
    }
  }

  useEffect(() => {
    registerPeriodicSync();
  }, []);

  return (
    <>
      <Box
        onClick={(e) => {
          if (e.detail === 2 && !isMobile) {
            setHover(true);
            setShowInfo((s) => !s);
            localStorage.setItem("showInfo", showInfo ? "true" : "false");
          }
        }}
        sx={{
          position: { xs: "static", sm: "sticky" },
          top: "10px",
          mx: "10px",
          left: "10px",
          zIndex: { sm: 999 },
          backdropFilter: "blur(10px)",
          background: { sm: addHslAlpha(palette[3], 0.4) },
          borderRadius: 5,
          p: 3,
          minWidth: "300px",
          display: "flex",
          flexDirection: "column",
          "& .collapse": {
            opacity: 0,
            transition: "all .2s",
          },
          "&:hover .collapse": {
            opacity: { sm: 1 },
          },
          ...(!showInfo && {
            transition: "margin .3s, transform .3s ease",
            transform: isHovered ? "translateX(0)" : "translateX(-300px)",
            mr: "-320px",
          }),
        }}
        onMouseLeave={() => setHover(false)}
      >
        <IconButton
          onClick={() => {
            setHover(true);
            localStorage.setItem("showInfo", showInfo ? "false" : "true");
            setShowInfo((s) => !s);
          }}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            background: palette[3],
            m: 2,
          }}
          className="collapse"
        >
          <Icon
            sx={{
              transition: "all .2s",
              transform: `rotate(${!showInfo ? 180 : 0}deg)`,
            }}
          >
            chevron_left
          </Icon>
        </IconButton>
        <Box sx={{ mt: "auto", p: { xs: 1, sm: 0 } }}>
          {collaborators.length > 1 && (
            <AvatarGroup max={6} sx={{ my: 1, justifyContent: "start" }}>
              {collaborators.slice(0, 5).map((member) => (
                <FriendPopover email={member.user.email} key={member.id}>
                  <Box
                    sx={{
                      width: { xs: "40px", sm: "30px" },
                      height: { xs: "40px", sm: "30px" },
                    }}
                  >
                    <ProfilePicture
                      sx={{
                        width: { xs: "40px", sm: "30px" },
                        height: { xs: "40px", sm: "30px" },
                        fontSize: "15px",
                        borderColor: { xs: palette[1] + "!important" },
                      }}
                      size={40}
                      data={member?.user}
                    />
                  </Box>
                </FriendPopover>
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
            <FilterSettings />
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
                onClick={() => {
                  setCurrentColumn(index);
                  containerRef.current.scrollTo({ top: 0 });
                }}
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
                    <Typography
                      sx={{
                        mt: -1,
                        opacity: 0.7,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {column._count.tasks} item
                      {column._count.tasks !== 1 && "s"}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
        {!isMobile && (
          <Box
            sx={{
              mt: { xs: 3, sm: "auto" },
              display: "flex",
              width: "100%",
              gap: 2,
            }}
          >
            {permissions !== "read" && (
              <Button variant="outlined">
                <Icon className="outlined">settings</Icon>
                Settings
              </Button>
            )}

            {permissions !== "read" && !board.archived && (
              <Button
                variant="contained"
                onClick={() =>
                  router.push(`/tasks/boards/${board.id}/edit#permissions`)
                }
              >
                <Icon>ios_share</Icon>
                Share
              </Button>
            )}
          </Box>
        )}
      </Box>
      {!showInfo && (
        <Box
          sx={{
            width: "100px",
            minWidth: "100px",
            height: "100%",
            overflow: "hidden",
            position: "sticky",
            top: 0,
            left: 0,
            zIndex: 99,
          }}
          onMouseOver={() => setHover(true)}
        />
      )}
    </>
  );
}
