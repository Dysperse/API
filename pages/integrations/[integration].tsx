import { integrations } from "@/components/Group/Integrations";
import { useSession } from "@/lib/client/session";
import { fetchRawApi } from "@/lib/client/useApi";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { toastStyles } from "@/lib/client/useTheme";
import { LoadingButton } from "@mui/lab";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Icon,
  IconButton,
  InputAdornment,
  LinearProgress,
  ListItemButton,
  ListItemText,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Virtuoso } from "react-virtuoso";
import useSWR from "swr";

function Layout() {
  const router = useRouter();
  const session = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const name = (router.query.integration as string).replace("-", " ");
  const integrationName = name.includes("?board=")
    ? name.split("?board=")[1]
    : name;

  const [boardId, setBoardId] = useState<string | null>(
    String(router.query?.board) || "-1"
  );

  const integration: any = useMemo(
    () => integrations.find((i) => i.name.toLowerCase() === integrationName),
    [integrationName]
  );

  const [step, setStep] = useState(0);

  const steps = [
    ...(integration?.params ?? []),
    ...(integration?.slides ?? []),
    ...(integration?.type === "board" && (["selectBoard"] as any)),
  ].filter((s) => s);

  const [params, setParams] = useState<any>(
    integration?.params?.reduce((acc, curr) => ((acc[curr.name] = ""), acc), {})
  );

  const handleParamUpdate = useCallback(
    (key, value) => {
      setParams({
        ...params,
        [key]: value,
      });
    },
    [params]
  );

  const { data } = useSWR(["property/boards"]);

  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const boardData = (data || []).filter((board) =>
    board.name.toLowerCase().includes(query.toLowerCase())
  );

  const icalUrl = `https://${window.location.hostname}/api/property/integrations/ical?id=${session.property.propertyId}&timeZone=${session.user.timeZone}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (integration.type === "board" && boardId === "-1") {
      toast.error("Please select a board", toastStyles);
      return;
    }
    setLoading(true);
    await fetchRawApi(session, "property/integrations/create", {
      name: integration.name,
      inputParams: JSON.stringify(params),
      outputType: integration.type,
      ...(integration.type === "board" && { boardId }),
    });

    toast.success("Added integration!", toastStyles);

    if (integration.type === "board") {
      setTimeout(() => {
        router.push(`/tasks/boards/${boardId}`);
      });
      return;
    } else {
      router.push(`/spaces/${session.property.propertyId}`);
    }

    setLoading(false);
  };

  return integration ? (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100dvh",
        overflow: "scroll",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AppBar>
        <Toolbar>
          <IconButton
            onClick={() => {
              if (step == 0) {
                router.push(`/spaces/${session.property.propertyId}`);
              } else {
                setStep(step - 1);
              }
            }}
          >
            <Icon>arrow_back_ios_new</Icon>
          </IconButton>
        </Toolbar>
        <LinearProgress
          variant="determinate"
          value={((step + 1) / (steps.length + 2)) * 100}
        />
      </AppBar>
      <Container
        sx={{ display: "flex", height: "100%", flexDirection: "column" }}
      >
        {step == 0 ? (
          <>
            <Box sx={{ my: "auto", textAlign: "center" }}>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <motion.div initial={{ x: -100 }} animate={{ x: 5 }}>
                  <Avatar
                    src={"https://assets.dysperse.com/v8-ios/57.png"}
                    sx={{ width: "75px", height: "75px" }}
                  />
                </motion.div>
                <motion.div initial={{ x: 100 }} animate={{ x: -5 }}>
                  <Avatar
                    src={integration.image}
                    sx={{ width: "75px", height: "75px" }}
                  />
                </motion.div>
              </Box>
              <Typography variant="h2" className="font-heading" sx={{ mt: 1 }}>
                {integration.name}
              </Typography>
              <Typography variant="body1" className="font-body">
                {integration.description}
              </Typography>
            </Box>
            <Button
              variant="contained"
              sx={{ mt: "auto", mb: 2 }}
              onClick={() => setStep(1)}
            >
              Connect <Icon>arrow_forward_ios</Icon>
            </Button>
          </>
        ) : steps[step - 1] ? (
          step === steps.length && integration.type === "board" ? (
            <>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <Avatar
                  sx={{
                    background: palette[3],
                    color: palette[9],
                    margin: "auto",
                    mb: 1,
                    mt: 4,
                    p: 3,
                  }}
                >
                  <Icon className="outlined">view_kanban</Icon>
                </Avatar>
              </motion.div>
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <Typography
                  variant="h3"
                  className="font-heading"
                  sx={{ mt: "auto", textAlign: "center" }}
                >
                  Select a board
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mb: 2, textAlign: "center", px: 4 }}
                >
                  Dysperse will connect {integration.name} to the board you
                  select below.
                </Typography>
              </motion.div>
              <TextField
                variant="outlined"
                placeholder="Search boards..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={{ mb: 2 }}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon>search</Icon>
                    </InputAdornment>
                  ),
                }}
              />
              <ListItemButton
                onClick={() => {
                  fetchRawApi(session, "property/boards/create", {
                    board: JSON.stringify({
                      for: [],
                      category: "",
                      name: "Integration",
                      columns: [],
                    }),
                  }).then(async (res) => {
                    setBoardId(res.id);
                    setStep(step + 1);
                    toast.success("We've created a new board for you!");
                  });
                }}
                sx={{
                  background: palette[2] + "!important",
                  mb: 2,
                }}
              >
                <Icon className="outlined">add_circle</Icon>
                <ListItemText primary="Create board" />
              </ListItemButton>
              {data && (
                <motion.div
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  style={{
                    height: "100%",
                  }}
                >
                  {boardData.length == 0 ? (
                    <div
                      style={{
                        height: "100%",
                        background: palette[2],
                        borderRadius: "25px",
                        padding: "25px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      No boards found
                    </div>
                  ) : (
                    <Virtuoso
                      style={{
                        height: "100%",
                        background: palette[2],
                        borderRadius: "25px",
                      }}
                      totalCount={boardData.length}
                      itemContent={(index) => (
                        <ListItemButton
                          selected={boardId === boardData[index].id}
                          onClick={() => setBoardId(boardData[index].id)}
                          disabled={Boolean(
                            boardData[index].integrations.find(
                              (integration) => integration.name === "Canvas LMS"
                            )
                          )}
                        >
                          <ListItemText
                            primary={boardData[index].name}
                            secondary={
                              Boolean(
                                boardData[index].integrations.find(
                                  (integration) =>
                                    integration.name === "Canvas LMS"
                                )
                              )
                                ? "Integration already added"
                                : `${boardData[index].columns.length} column${
                                    boardData[index] !== 1 ? "s" : ""
                                  }`
                            }
                          />
                          {boardId === boardData[index].id && (
                            <Icon sx={{ ml: "auto" }}>check</Icon>
                          )}
                        </ListItemButton>
                      )}
                    />
                  )}
                </motion.div>
              )}
              <Button
                variant="contained"
                sx={{ mt: "auto", my: 2 }}
                disabled={boardId == "-1"}
                onClick={() => setStep(step + 1)}
              >
                Finish <Icon>arrow_forward_ios</Icon>
              </Button>
            </>
          ) : steps[step - 1]?.type === "calendar" ? (
            <>
              <Typography
                variant="h3"
                className="font-heading"
                sx={{ mt: "auto", textAlign: "center" }}
              >
                Connect your Google Account
              </Typography>
              <Typography sx={{ mt: 2, textAlign: "center" }}>
                If you haven&apos;t already, connect your Google Account with
                Dysperse to import your calendars &amp; contacts for friend
                suggestions.
              </Typography>
              <Box
                sx={{
                  mb: "auto",
                  mx: "auto",
                  display: "inline-flex",
                  mt: 2,
                }}
              >
                <Button href="/api/user/google/redirect" variant="contained">
                  Connect <Icon>arrow_forward_ios</Icon>
                </Button>
              </Box>
              <Button
                variant="contained"
                fullWidth
                sx={{ mb: 2 }}
                disabled={
                  steps[step - 1].required &&
                  params[steps[step - 1].name].trim().length == 0
                }
                onClick={() => setStep(step + 1)}
              >
                Next <Icon>arrow_forward_ios</Icon>
              </Button>
            </>
          ) : steps[step - 1]?.type === "slide" ? (
            <motion.div
              key={"slide"}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "center",
              }}
            >
              <Typography variant="h4" sx={{ mt: "auto" }}>
                {steps[step - 1].name}
              </Typography>
              <Typography sx={{ mb: 1, color: palette[11] }} variant="body2">
                {steps[step - 1].description}
              </Typography>
              <TextField
                variant="outlined"
                size="small"
                value={steps[step - 1].url.replace("[DYSPERSE_ICAL]", icalUrl)}
                sx={{ mb: "auto" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          navigator.clipboard.writeText(icalUrl);
                          toast.success("Copied to clipboard!", toastStyles);
                        }}
                      >
                        <Icon className="outlined">content_copy</Icon>
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          window.open(
                            `webcal://${icalUrl.replace("https://", "")}`
                          );
                        }}
                      >
                        <Icon className="outlined">add_circle</Icon>
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                fullWidth
                sx={{ mb: 2 }}
                disabled={
                  steps[step - 1].required &&
                  params[steps[step - 1].name].trim().length == 0
                }
                onClick={() => setStep(step + 1)}
              >
                Next <Icon>arrow_forward_ios</Icon>
              </Button>
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                style={{ marginTop: "auto" }}
              >
                <Typography variant="h4">
                  {steps[step - 1].name !==
                    "Connect Dysperse to Google Calendar" && "What's the"}{" "}
                  {steps[step - 1].name}
                  {steps[step - 1].name !==
                    "Connect Dysperse to Google Calendar" && "?"}
                </Typography>
                <Typography sx={{ mb: 1, color: palette[11] }} variant="body2">
                  {steps[step - 1].helperText}
                </Typography>
                <TextField
                  size="small"
                  value={params[steps[step - 1].name]}
                  onChange={(e: any) =>
                    handleParamUpdate(steps[step - 1].name, e.target.value)
                  }
                  placeholder={steps[step - 1].placeholder}
                  label={steps[step - 1].name}
                  fullWidth
                  type={steps[step - 1].type}
                  required={steps[step - 1].required}
                  key={steps[step - 1].name}
                  sx={{ mt: 1 }}
                />
              </motion.div>
              <Button
                variant="contained"
                sx={{ mt: "auto", mb: 2 }}
                disabled={
                  steps[step - 1].required &&
                  params[steps[step - 1].name].trim().length == 0
                }
                onClick={() => setStep(step + 1)}
              >
                Next <Icon>arrow_forward_ios</Icon>
              </Button>{" "}
            </>
          )
        ) : (
          <>
            <motion.div
              initial={{ x: 100 }}
              animate={{ x: 0 }}
              style={{ marginTop: "auto" }}
            >
              <Typography variant="h3" className="font-heading">
                You&apos;re all set!
              </Typography>
              <Typography>
                Just tap the button below to finish setup!
              </Typography>
            </motion.div>
            <LoadingButton
              loading={loading}
              variant="contained"
              sx={{ mt: "auto", mb: 2 }}
              onClick={handleSubmit}
            >
              Finish
              <Icon>check</Icon>
            </LoadingButton>
          </>
        )}
      </Container>
    </Box>
  ) : (
    <Box>Integration not found</Box>
  );
}

export default function Page() {
  const router = useRouter();
  return router?.query?.integration ? <Layout /> : <></>;
}
