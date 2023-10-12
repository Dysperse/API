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
import { useRouter } from "next/router";
import { cloneElement, useRef, useState } from "react";
import { Puller } from "../../Puller";
import { CreateTask } from "../Task/Create";

const filter = createFilterOptions();

export function SearchTasks({ children }: { children?: JSX.Element }) {
  const ref: any = useRef();
  const router = useRouter();
  const routerQuery = router?.query?.query
    ? JSON.parse(router.query.query.toString())
    : [];

  const { session } = useSession();
  const [query, setQuery] = useState<any[]>(routerQuery);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isDark = useDarkMode(session.darkMode);
  const palette = useColor(session.user.color, isDark);

  const trigger = cloneElement(
    children || (
      <IconButton sx={{ ml: "auto", color: addHslAlpha(palette[9], 0.7) }}>
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
        options={options}
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
              gap: 2,
              display: "flex",
              px: 2,
              py: 1,
              "&:hover": { background: palette[4] + "!important" },
              "&:active": { background: palette[5] + "!important" },
            }}
            {...(props as any)}
          >
            <Icon className="outlined">{option.icon || "search"}</Icon>
            {option.title || `Search for "${option}"`}
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
              />
            ) : (
              <Chip
                {...getTagProps(chip)}
                key={index.toString()}
                icon={<Icon>search</Icon>}
                label={chip}
              />
            )
          );
        }}
        onChange={(_, newValue) => {
          setQuery(newValue);
        }}
        defaultValue={query}
        sx={{
          "&, & *:not(:focus-within)": {
            cursor: "default !important",
          },
        }}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            InputProps={{
              ...params.InputProps,
              disableUnderline: true,
              sx: {
                background: palette[4],
                px: 2,
                pt: 0.7,
                pb: "4px!important",
                border: `2px solid ${palette[4]}`,
                "&:hover": {
                  background: palette[5],
                  borderColor: palette[5],
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
      {/* <TextField
        inputRef={ref}
        size="small"
        autoFocus={isMobile}
        variant="outlined"
        placeholder="Search tasks..."
        onKeyDown={(e: any) => e.code === "Enter" && e.target.blur()}
        onBlur={() => {
          if (query.trim() !== "") {
            router.push(`/tasks/search/${encodeURIComponent(query)}`);
            setLoading(true);
          }
        }}
        value={query}
        id="searchTasks"
        sx={{
          transition: "all .2s",
          zIndex: 999,
          cursor: "default",
          ...(Boolean(query.trim()) && {
            mr: -6,
          }),
        }}
        onChange={(e) => setQuery(e.target.value)}
        InputProps={{
          autoFocus: isMobile,
          sx: {
            cursor: "default",
            borderRadius: 4,
          },
          endAdornment: (
            <InputAdornment position="end">
              {query.trim() && (
                <IconButton size="small">
                  {loading ? <CircularProgress /> : <Icon>east</Icon>}
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
      /> */}
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

  return isMobile ? (
    <>
      <SwipeableDrawer
        anchor="top"
        open={mobileOpen}
        onClick={(e) => e.stopPropagation()}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { borderRadius: "0 0 20px 20px" } }}
      >
        <Box sx={{ p: 2, pt: 3 }}>
          <Button
            onClick={() => setMobileOpen(false)}
            size="small"
            sx={{ mb: 2 }}
            variant="contained"
          >
            <Icon>close</Icon>Search
          </Button>
          {input}
        </Box>
        <Puller sx={{ mb: 0 }} />
      </SwipeableDrawer>
      {trigger}
    </>
  ) : (
    <Box
      sx={{
        display: "flex",
        mb: 2,
        gap: 1,
        alignItems: "center",
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
                background: palette[4],
                color: palette[12],
                "&:hover": {
                  background: palette[5],
                },
                "&:active": {
                  background: palette[6],
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
