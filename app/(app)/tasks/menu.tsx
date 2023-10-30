"use client";

import { SearchTasks } from "@/app/(app)/tasks/Layout/SearchTasks";
import { Tab } from "@/app/(app)/tasks/Layout/Tab";
import { ErrorHandler } from "@/components/Error";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useAccountStorage } from "@/lib/client/useAccountStorage";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Box,
  Button,
  Collapse,
  Divider,
  Icon,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { recentlyAccessed } from "./recently-accessed";
import { buttonStyles, taskStyles } from "./styles";

export const MenuChildren = memo(function MenuChildren({
  editMode,
  setEditMode,
}: {
  editMode: boolean;
  setEditMode: (f) => void;
}) {
  const { session } = useSession();
  const storage = useAccountStorage();
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.user.color, isDark);

  const [showSync, setShowSync] = useState(true);

  const { data, isLoading, mutate, error } = useSWR(["space/boards"]);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const boards = useMemo(() => {
    if (!data) return { active: [], archived: [], shared: [] };

    const active = data.filter(
      (x) => !x.archived && x.propertyId === session?.space?.info?.id
    );

    const archived = data.filter((x) => x.archived);

    const shared = data.filter(
      (x) =>
        x.propertyId !== session?.space?.info?.id ||
        x.shareTokens?.[0]?.user?.email === session.user.email
    );

    return { active, archived, shared };
  }, [data, session]);

  const pathname = usePathname();
  const redPalette = useColor("red", isDark);
  const greenPalette = useColor("green", isDark);

  const perspectives = useMemo(
    () => [
      {
        key: "w",
        hash: "perspectives/days",
        icon: isMobile ? "calendar_view_day" : "view_week",
        label: isMobile ? "Days" : "Weeks",
        preview: "days.png",
        description: "View all your tasks by week",
      },
      {
        key: "m",
        hash: "perspectives/weeks",
        icon: isMobile ? "view_week" : "calendar_view_month",
        label: isMobile ? "Weeks" : "Months",
        preview: "weeks.png",
        description: "View all your tasks by month",
      },
      {
        key: "y",
        hash: "perspectives/months",
        icon: isMobile ? "calendar_view_month" : "view_compact",
        label: isMobile ? "Months" : "Years",
        preview: "months.png",
        description: "View all your tasks by year",
      },
      {
        key: "i",
        hash: "insights",
        icon: "insights",
        label: "Insights",
        preview: "insights.png",
        description:
          "Dive into your productivity and learn more about yourself",
      },
      {
        key: "c",
        hash: "color-coded",
        icon: "palette",
        label: "Color coded",
        preview: "color-coded.png",
        description: "See all your tasks by color",
      },
      {
        key: "b",
        hash: "stream/backlog",
        icon: "west",
        label: "Backlog",
        preview: "stream.png",
        description: "See your unfinished tasks",
      },
      {
        key: "u",
        hash: "stream/upcoming",
        icon: "east",
        label: "Upcoming",
        preview: "stream.png",
        description: "See upcoming tasks",
      },
      {
        key: "n",
        hash: "stream/unscheduled",
        icon: "history_toggle_off",
        label: "Unscheduled",
        preview: "stream.png",
        description: "See tasks which you haven't set a due date to",
      },
      {
        key: "o",
        hash: "stream/completed",
        icon: "check_circle",
        label: "Completed",
        preview: "stream.png",
        description: "See all the tasks you've completed",
      },
    ],
    [isMobile]
  );

  const [hiddenPerspectives, setHiddenPerspectives] = useState(
    session.user.settings?.hiddenPerspectives || []
  );

  const handlePerspectiveToggle = useCallback(
    async (e: any, hash: string) => {
      e.preventDefault();
      e.stopPropagation();
      const show = hiddenPerspectives.includes(hash);
      const updatedHiddenPerspectives = show
        ? hiddenPerspectives.filter((d) => d !== hash)
        : [...hiddenPerspectives, hash];

      setHiddenPerspectives(updatedHiddenPerspectives);

      await fetchRawApi(session, "user/settings/set", {
        hiddenPerspectives: JSON.stringify(updatedHiddenPerspectives),
      });
    },
    [hiddenPerspectives, session, setHiddenPerspectives]
  );

  return (
    <>
      {error && (
        <ErrorHandler
          callback={() => mutate()}
          error="An error occurred while loading your tasks"
        />
      )}
      <Box
        sx={{
          p: 3,
          px: 2,
        }}
      >
        {!isMobile && <SearchTasks />}
        {!(isMobile && hiddenPerspectives.length == 6) && (
          <Typography
            sx={{ ...taskStyles(palette).subheading, display: "flex" }}
          >
            {hiddenPerspectives.length !== 6 && "Perspectives"}
            {!isMobile && (
              <Box
                onClick={() => setEditMode((s) => !s)}
                sx={{
                  ml: "auto",
                  cursor: "pointer",
                  textTransform: "none",
                  fontWeight: 100,
                  ...(hiddenPerspectives.length === 6 &&
                    !editMode && {
                      mb: -5,
                      zIndex: 999,
                      transform: "translateY(10px)",
                    }),
                  opacity: 0.6,
                  "&:hover": {
                    opacity: 1,
                  },
                }}
              >
                {editMode ? "Done" : "Edit"}
              </Box>
            )}
          </Typography>
        )}
        <Box>
          {perspectives.map((button: any) => (
            <Collapse
              in={!hiddenPerspectives.includes(button.hash) || editMode}
              key={button.hash}
            >
              <Tooltip
                arrow={false}
                PopperProps={{
                  sx: {
                    "& .MuiTooltip-tooltip": {
                      maxWidth: "unset",
                      background: `${addHslAlpha(palette[5], 0.3)}!important`,
                      backdropFilter: "blur(10px)",
                      color: "#fff!important",
                      borderRadius: 5,
                      "& img": {
                        borderRadius: 5,
                      },
                    },
                  },
                }}
                title={
                  !isMobile && (
                    <Box sx={{ width: "300px", flex: "0 0 300px", py: 1 }}>
                      <Image
                        blurDataURL="data:image/png;base64,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"
                        placeholder="blur"
                        src={`/images/perspectives/${button.preview}`}
                        width={1920 / 3}
                        height={1080 / 3}
                        alt={"Preview of " + button.label}
                        style={{
                          width: "100%",
                          height: "auto",
                        }}
                      />
                      <Box sx={{ p: 1, pt: 0.5 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            className: "font-heading",
                            mt: 1,
                            mb: 0.5,
                            gap: 2,
                          }}
                        >
                          <Typography variant="h4">{button.label}</Typography>
                          <IconButton
                            sx={{
                              width: 90,
                              borderRadius: 5,
                              height: 26,
                              fontSize: "12px",
                              color: palette[11],
                              ml: "auto",
                              lineHeight: "26px",
                              border: `2px solid ${palette[8]}`,
                            }}
                          >
                            shift + {button.key.toUpperCase()}
                          </IconButton>
                        </Box>
                        <Typography>{button.description}</Typography>
                      </Box>
                    </Box>
                  )
                }
                placement="right"
                enterNextDelay={0}
                enterDelay={1000}
                disableTouchListener
              >
                <Link
                  href={`/tasks/${button.hash}`}
                  style={{
                    cursor: "default",
                    alignItems: "center",
                  }}
                  legacyBehavior
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Collapse orientation="horizontal" in={editMode}>
                      <IconButton
                        onClick={(e) => handlePerspectiveToggle(e, button.hash)}
                        sx={{
                          opacity: editMode ? 1 : 0,
                          transition: "opacity .4s",
                          color: hiddenPerspectives.includes(button.hash)
                            ? greenPalette[10]
                            : redPalette[10],
                        }}
                      >
                        <Icon>
                          {hiddenPerspectives.includes(button.hash)
                            ? "add_circle"
                            : "remove_circle"}
                        </Icon>
                      </IconButton>
                    </Collapse>
                    <Button
                      size="large"
                      id={`__agenda.${button.hash}`}
                      sx={buttonStyles(
                        palette,
                        Boolean(pathname?.includes(`/tasks/${button.hash}`))
                      )}
                      onClick={() =>
                        recentlyAccessed.set({
                          icon: button.icon,
                          label: button.label,
                          path: `/tasks/${button.hash}`,
                        })
                      }
                      disabled={
                        editMode && hiddenPerspectives.includes(button.hash)
                      }
                    >
                      <Icon
                        className={
                          pathname?.includes(`/tasks/${button.hash}`)
                            ? ""
                            : "outlined"
                        }
                      >
                        {button.icon}
                      </Icon>
                      {button.label}
                      {isMobile && (
                        <Icon sx={{ ml: "auto", mr: -1 }}>
                          arrow_forward_ios
                        </Icon>
                      )}
                    </Button>
                  </Box>
                </Link>
              </Tooltip>
            </Collapse>
          ))}
        </Box>
        <Box>
          {boards.shared.length > 0 && (
            <Divider sx={taskStyles(palette).divider} />
          )}
          {boards.shared.length > 0 && (
            <Typography sx={taskStyles(palette).subheading}>Shared</Typography>
          )}
          {boards.shared.map((board) => (
            <Tab
              editMode={editMode}
              key={board.id}
              styles={buttonStyles}
              board={board}
            />
          ))}
          {(editMode || hiddenPerspectives.length !== 6) && (
            <Divider sx={taskStyles(palette).divider} />
          )}
          <Typography
            sx={{ ...taskStyles(palette).subheading, pointerEvents: "none" }}
          >
            Boards
          </Typography>
          {boards.active.map((board) => (
            <Tab
              editMode={editMode}
              key={board.id}
              styles={buttonStyles}
              board={board}
            />
          ))}
          {isLoading && (
            <Box sx={{ px: 1 }}>
              {[...new Array(5)].map((_, i) => (
                <Skeleton
                  variant="rectangular"
                  key={i}
                  height={30}
                  sx={{ mb: 1.5 }}
                />
              ))}
            </Box>
          )}
          <Link
            href={
              Boolean(storage?.isReached) ||
              data?.filter((board) => !board.archived).length >= 7 ||
              session.permission === "read-only"
                ? "/tasks"
                : "/tasks/boards/create"
            }
            style={{ width: "100%" }}
            legacyBehavior
          >
            <Button
              fullWidth
              disabled={
                Boolean(storage?.isReached) ||
                data?.filter((board) => !board.archived).length >= 7 ||
                session.permission === "read-only"
              }
              size="large"
              sx={{
                ...buttonStyles(palette, pathname == "/tasks/boards/create"),
                cursor: "default",
                ...((storage?.isReached === true ||
                  (data &&
                    data.filter((board) => !board.archived).length >= 7)) && {
                  opacity: 0.5,
                }),
                justifyContent: "start",
              }}
            >
              <Icon className={pathname == "/tasks/create" ? "" : "outlined"}>
                add_circle
              </Icon>
              New board
            </Button>
          </Link>
          <Box>
            {data && data.filter((x) => x.archived).length !== 0 && (
              <>
                <Divider sx={taskStyles(palette).divider} />
                <Typography sx={taskStyles(palette).subheading}>
                  Archived
                </Typography>
              </>
            )}
            {boards.archived.map((board) => (
              <Tab key={board.id} styles={buttonStyles} board={board} />
            ))}
            {isMobile && showSync && (
              <>
                <Divider sx={taskStyles(palette).divider} />
                <Button
                  fullWidth
                  onClick={async () => {
                    toast.success("Tasks resynced - Now up to date.");
                    setShowSync(false);
                    await fetch("/api/property/integrations/resync");
                  }}
                  disabled={
                    Boolean(storage?.isReached) ||
                    session.permission === "read-only"
                  }
                  size="large"
                  sx={{
                    ...buttonStyles(palette, false),
                    cursor: "default",
                    justifyContent: "start",
                  }}
                >
                  <Icon>sync</Icon>
                  Resync tasks
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
});
