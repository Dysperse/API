"use client";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Icon,
  IconButton,
  ListItemButton,
  SwipeableDrawer,
  TextField,
  Tooltip,
  createFilterOptions,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import { cloneElement, useRef, useState } from "react";
import { CreateTask } from "../Task/Create";

const filter = createFilterOptions();

export function SearchTasks({
  children,
  inputOnly = false,
}: {
  children?: JSX.Element;
  inputOnly?: boolean;
}) {
  const ref: any = useRef();
  const router = useRouter();
  const params = useParams();
  const routerQuery = params?.query
    ? JSON.parse(decodeURIComponent(params.query as string))
    : [];

  const { session } = useSession();
  const [query, setQuery] = useState<any[]>(routerQuery);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.user.color, isDark);

  const trigger = cloneElement(
    children || (
      <IconButton sx={{ ml: "auto", color: palette[9] }}>
        <Icon>search</Icon>
      </IconButton>
    ),
    {
      onClick: (e) => {
        e.stopPropagation();
        setMobileOpen(true);
        setTimeout(() => ref?.current?.focus(), 100);
      },
    }
  );

  const options = [
    {
      icon: "push_pin",
      condition: { pinned: true },
      title: "Pinned?",
    },
    {
      icon: "done_outline",
      condition: { completed: true },
      title: "Completed?",
    },
    {
      icon: "close",
      condition: { completed: false },
      title: "Not complete?",
    },
    {
      icon: "loop",
      condition: { recurrenceRule: true },
      title: "Recurring?",
    },
    {
      icon: "attachment",
      condition: { attachment: true },
      title: "Has attachment?",
    },
    {
      icon: "sticky_note_2",
      condition: { description: true },
      title: "Has description?",
    },
    {
      icon: "location_on",
      condition: { location: true },
      title: "Has location?",
    },
    {
      icon: "palette",
      condition: { color: true },
      title: "Has color?",
    },
  ];

  const input = (
    <>
      <Autocomplete
        {...(isMobile && {
          open: showOptions,
        })}
        disabled={inputOnly}
        multiple
        id="searchTasks"
        fullWidth
        clearOnEscape
        onKeyDown={(e: any) => {
          if (e.key === "Escape" && query.length === 0) {
            e.target.blur();
          }
        }}
        freeSolo={!query.find((e) => typeof e === "string")}
        options={options.filter(
          (option) => !query.some((d) => d.title === option.title)
        )}
        clearIcon={<Icon>arrow_forward_ios</Icon>}
        getOptionLabel={(option) => option.title}
        popupIcon={null}
        slotProps={{
          clearIndicator: {
            onClick: () => {
              router.push(
                `/tasks/search/${encodeURIComponent(JSON.stringify(query))}`
              );
            },
            title: "Search...",
          },
          paper: {
            sx: {
              width: "300px",
              background: palette[3],
              "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                display: "none",
              },
              border: `2px solid ${palette[4]}`,
              borderRadius: 5,
              mt: 2,
              p: 1,
              py: 0,
            },
          },
        }}
        renderOption={(props, option) => (
          <ListItemButton
            sx={{
              gap: 0,
              display: "flex",
              px: 2,
              py: 1,
              "& .e": {
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                maxWidth: "100%",
                minWidth: 0,
                overflow: "hidden",
              },
              "&:hover": {
                background: addHslAlpha(palette[5], 0.6) + "!important",
              },
              "&:active": {
                background: addHslAlpha(palette[6], 0.6) + "!important",
              },
            }}
            {...(props as any)}
          >
            <Icon className="outlined" sx={{ mr: 2 }}>
              {option.icon || "search"}
            </Icon>
            <span className="e">{option.title || `Search for "${option}`}</span>
            {!option.title && `"`}
          </ListItemButton>
        )}
        handleHomeEndKeys
        renderTags={(value, getTagProps) => {
          return value.map((chip, index) =>
            typeof chip === "object" ? (
              <Chip
                {...getTagProps(chip)}
                key={index.toString()}
                icon={<Icon>{chip.icon}</Icon>}
                label={chip.title}
                {...(inputOnly && { onDelete: undefined })}
              />
            ) : (
              <Chip
                {...getTagProps(chip)}
                key={index.toString()}
                icon={<Icon>search</Icon>}
                label={chip}
                {...(inputOnly && { onDelete: undefined })}
              />
            )
          );
        }}
        onChange={(_, newValue) => setQuery(newValue)}
        defaultValue={query}
        sx={{
          "&, & *:not(:focus-within)": {
            cursor: "default !important",
            ...(inputOnly && {
              opacity: `1!important`,
            }),
          },
        }}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            inputRef={ref}
            {...params}
            InputProps={{
              ...params.InputProps,
              disableUnderline: true,
              sx: {
                minHeight: "100%",
                background: inputOnly ? "" : palette[4],
                px: inputOnly ? (query.length == 0 ? 2 : 0) : 2,
                pt: inputOnly ? (query.length == 0 ? 0.6 : 0) : 0.7,
                pb: inputOnly ? (query.length == 0 ? 1 : 0) : "4px!important",
                border: `2px solid ${palette[4]}`,
                "&:hover": {
                  background: { sm: palette[5] },
                  borderColor: { sm: palette[5] },
                },
                "&:focus-within": {
                  background: palette[1],
                  borderColor: palette[5],
                },
                borderRadius: 5,
              },
            }}
            variant="standard"
            size="small"
            placeholder={query.length === 0 ? "Search tasks..." : undefined}
          />
        )}
        limitTags={inputOnly ? 1 : undefined}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          const { inputValue } = params;

          const isExisting = options.find(
            (option) => inputValue === option.title
          );

          if (
            inputValue !== "" &&
            !isExisting &&
            !query.find((d) => typeof d === "string")
          ) {
            filtered.push(inputValue);
          }

          return filtered;
        }}
      />
    </>
  );

  const CreateTaskWrapper = ({ children }) => (
    <CreateTask
      closeOnCreate
      defaultDate={dayjs().startOf("day").toDate()}
      onSuccess={() => {
        document.getElementById("taskMutationTrigger")?.click();
      }}
    >
      {children}
    </CreateTask>
  );

  return inputOnly ? (
    <SearchTasks>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ pointerEvents: "none" }}>{input}</Box>
      </Box>
    </SearchTasks>
  ) : isMobile ? (
    <>
      <SwipeableDrawer
        anchor="top"
        open={mobileOpen}
        onClick={(e) => e.stopPropagation()}
        onClose={() => {
          setMobileOpen(false);
          setShowOptions(false);
        }}
        PaperProps={{ sx: { background: "transparent" } }}
      >
        <Box sx={{ p: 2, pt: 3 }}>
          <Box sx={{ display: "flex" }}>
            <Button
              onClick={() => setMobileOpen(false)}
              size="small"
              sx={{ mb: 2 }}
              variant="contained"
            >
              <Icon>close</Icon>Search
            </Button>
            <Button
              onClick={() => {
                setShowOptions((s) => !s);
                ref?.current?.focus();
              }}
              size="small"
              sx={{
                mb: 2,
                py: 0,
                ml: "auto",
                ...(!showOptions && {
                  border: "2px solid " + palette[3],
                }),
              }}
              variant={showOptions ? "outlined" : "contained"}
            >
              <Icon>tune</Icon>Filters
            </Button>
          </Box>
          {input}
        </Box>
      </SwipeableDrawer>
      {trigger}
    </>
  ) : (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        alignItems: "center",
        position: "sticky",
        top: 0,
        py: 2,
        mt: -2,
        ml: -2,
        mr: -2,
        px: 2,
        zIndex: 99,
        background: addHslAlpha(palette[2], 0.6),
        backdropFilter: "blur(10px)",
      }}
    >
      {input}

      {session.permission !== "read-only" && (
        <Tooltip
          placement="right"
          title={
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              New task
              <span
                style={{
                  background: `hsla(240,11%,${isDark ? 90 : 10}%, .1)`,
                  padding: "0 10px",
                  borderRadius: "5px",
                }}
              >
                /
              </span>
            </Box>
          }
        >
          <CreateTaskWrapper>
            <IconButton
              id="createTaskTrigger"
              onClick={(e) => e.stopPropagation()}
              sx={{
                ...(query.length > 0 && {
                  display: "none",
                }),
                cursor: "default",
                transition: "transform .2s",
                background: addHslAlpha(palette[5], 0.6),
                color: palette[12],
                "&:hover": {
                  background: addHslAlpha(palette[6], 0.6),
                },
                "&:active": {
                  background: addHslAlpha(palette[7], 0.6),
                },
              }}
            >
              <Icon>add</Icon>
            </IconButton>
          </CreateTaskWrapper>
        </Tooltip>
      )}
    </Box>
  );
}
