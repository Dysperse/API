import { ErrorHandler } from "@/components/Error";
import { fetchRawApi } from "@/lib/client/useApi";
import { useSession } from "@/lib/client/useSession";
import { colors } from "@/lib/colors";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Icon,
  IconButton,
  LinearProgress,
  Skeleton,
  Slider,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Label } from "./Label";

export const questions = [
  {
    id: "reason",
    question: "What is making you feel this way?",
    choices: [
      { icon: "favorite", name: "Relationships" },
      { icon: "work", name: "Work" },
      { icon: "school", name: "School" },
      { icon: "sports_basketball", name: "Hobbies" },
      { icon: "ecg_heart", name: "Health" },
      { icon: "newspaper", name: "Current events" },
      { icon: "group", name: "Family/Friends" },
      { icon: "payments", name: "Finances" },
      { icon: "pending", name: "Something else" },
    ],
  },
  {
    id: "stress",
    question: "How are your stress levels?",
    subtitle:
      "Do you feel anxious, nervous, keyed-up, paranoid, scared, or on edge?",
    slider: ["1f60e", "1f61f", "1f630", "1f62b"],
    default: 3,
  },
  {
    id: "rest",
    question: "Are you well rested?",
    subtitle:
      "Everyone is unique and has their own sleep habits, but generally, most people need 8 hours of uninterrupted sleep. If you got less than that, woke up often, or had bad dreams, taking a nap might be beneficial",
    choices: [
      { id: "0", icon: "bolt", name: "I am well-rested!" },
      { id: "1", icon: "airline_seat_flat", name: "Maybe a nap..." },
      { id: "2", icon: "sleep", name: "I need sleep" },
    ],
  },
  {
    id: "pain",
    question: "Are you in pain?",
    subtitle:
      "Are you currently experiencing any discomfort or pain in your body that you would like to discuss?",
    slider: [1, 2, 3, 4, 5],
    default: 2,
  },
  {
    id: "food",
    question: "Have you eaten in the last four hours?",
    choices: [
      { id: "0", icon: "check_circle", name: "Yes" },
      { id: "1", icon: "icecream", name: "I could use a snack..." },
      { id: "2", icon: "cancel", name: "No" },
    ],
  },
];

function ExperimentalAiReflection({ emoji, answers }) {
  const session = useSession();

  const [data, setData] = useState<null | any>(null);
  const [error, setError] = useState<null | any>(false);

  const handleThink = useCallback(async () => {
    try {
      const temp = {
        reason_for_emoji: answers[0],
        "stress_levels_from_1_to_5 (1 lowest, 5 highest)": answers[1],
        sleep_reflection: answers[2],
        is_in_physical_pain_from_1_to_5: answers[3],
        eaten_in_last_four_hours: answers[4],
      };
      setError(false);
      setData(null);
      const d = await fetchRawApi("ai/reflection", {
        data: JSON.stringify(temp),
        emoji,
      });
      setData(d);
    } catch (e) {
      setError(true);
    }
  }, [emoji, answers]);

  useEffect(() => {
    handleThink();
  }, [handleThink]);

  return (
    <Box>
      {error && (
        <ErrorHandler
          callback={handleThink}
          error="Oh no! Dysperse AI couldn't give you suggestions this time. Try again later!"
        />
      )}
      <br />
      {data ? (
        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            background: `hsl(240,11%,${session.user.darkMode ? 20 : 95}%)`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              sx={{
                display: "inline-flex",
                gap: 2,
                mb: 2,
                fontWeight: 900,
                alignItems: "center",
                background: "linear-gradient(45deg, #ff0f7b, #f89b29)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              variant="h6"
            >
              <Icon>south_east</Icon>Dysperse AI
            </Typography>
            <IconButton size="small" sx={{ ml: "auto" }} onClick={handleThink}>
              <Icon>refresh</Icon>
            </IconButton>
          </Box>
          <Typography sx={{ fontWeight: 700 }}>
            {data?.response?.general}
          </Typography>
          {data.response &&
            data.response.suggestions &&
            data.response.suggestions.map((suggestion, index) => (
              <Box
                key={suggestion.name}
                sx={{ display: "flex", alignItems: "center", mt: 3, gap: 2 }}
              >
                <Typography variant="h4" className="font-heading">
                  #{index + 1}
                </Typography>
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>
                    {suggestion.name}
                  </Typography>
                  <Typography>{suggestion.suggestion}</Typography>
                </Box>
              </Box>
            ))}
        </Box>
      ) : (
        <Skeleton
          variant="rectangular"
          height={300}
          sx={{ borderRadius: 5 }}
          animation="wave"
        />
      )}
      <Alert severity="warning" sx={{ mt: 2 }}>
        Dysperse AI is still in an experimental phase, and might display
        incorrect data. Use with caution.
      </Alert>
    </Box>
  );
}

export function Emoji({ emoji, defaultData, handleMoodChange }) {
  const session = useSession();

  const [open, setOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const template = useMemo(
    () =>
      defaultData
        ? {
            0: { name: defaultData?.reason },
            1: defaultData?.stress,
            2: (questions as any)[2].choices.find(
              ({ id }) => id == defaultData?.rest
            ),
            3: defaultData?.pain,
            4: (questions as any)[4].choices.find(
              ({ id }) => id == defaultData?.food
            ),
          }
        : {},
    [defaultData]
  );

  const [answers, setAnswers] = useState({
    ...(defaultData ? template : questions.map(() => null)),
  });

  useEffect(() => {
    if (defaultData) setAnswers(template);
  }, [template, defaultData]);

  const question = questions[currentQuestion];
  const answer = answers[currentQuestion];

  const handleSave = async (key, value) => {
    let q = questions[key].id;

    await fetchRawApi("user/checkIns/setMood", {
      date: dayjs().startOf("day"),
      mood: emoji,
      [q]: value,
    });
  };

  const handleOpen = () => {
    setCurrentQuestion(0);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          ...(defaultData?.mood === emoji && {
            transform: "scale(1.1)",
          }),
          ...(defaultData &&
            defaultData?.mood !== emoji && {
              opacity: 0.5,
              transform: "scale(0.95)",
            }),
          p: 0,
          width: 35,
          height: 35,
          cursor: "pointer!important",
          "&:active": {
            transform: "scale(0.95)",
          },
          transition: "transform .1s",
          background: "transparent!important",
        }}
      >
        <picture>
          <img
            alt="emoji"
            src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${emoji}.png`}
            width="100%"
            height="100%"
          />
        </picture>
      </IconButton>

      <SwipeableDrawer
        open={open}
        anchor="bottom"
        onOpen={handleOpen}
        onClose={handleClose}
        PaperProps={{
          sx: {
            height: "100vh",
            borderRadius: 0,
          },
        }}
      >
        <AppBar>
          <Toolbar>
            <Box>
              <Typography sx={{ fontWeight: 700 }}>
                Check-in{defaultData && " (completed)"}
              </Typography>
              {currentQuestion + 1 >= questions.length ? (
                <Typography variant="body2">
                  Overview &amp; suggestions
                </Typography>
              ) : (
                <Typography variant="body2">
                  Question {currentQuestion + 1} of {questions.length}
                </Typography>
              )}
            </Box>
            <IconButton sx={{ ml: "auto" }} onClick={handleClose}>
              <Icon>close</Icon>
            </IconButton>
          </Toolbar>
          <LinearProgress
            value={((currentQuestion + 1) / (questions.length + 1)) * 100}
            variant="determinate"
          />
        </AppBar>
        {currentQuestion === questions.length ? (
          <Box sx={{ p: 3, pt: 0 }}>
            <ExperimentalAiReflection answers={answers} emoji={emoji} />
            <Button
              variant="contained"
              fullWidth
              onClick={handleClose}
              sx={{ mt: 2 }}
            >
              Done
            </Button>
          </Box>
        ) : (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: question.subtitle ? 1 : 2 }}>
              {question.question}
            </Typography>
            {question.subtitle && (
              <Typography sx={{ mb: 2 }}>{question.subtitle}</Typography>
            )}
            {question.choices ? (
              question.choices.map((choice) => (
                <Button
                  onClick={() => {
                    setAnswers((a) => ({
                      ...a,
                      [currentQuestion]: choice.name as any,
                    }));
                    handleSave(currentQuestion, choice.id || choice.name);
                    setCurrentQuestion(currentQuestion + 1);
                  }}
                  key={choice.name}
                  fullWidth
                  sx={{
                    justifyContent: "start",
                    mb: 1,
                    px: 2,
                    py: 1.5,
                    borderWidth: "2px!important",
                    ...((answer as any)?.name === choice.name && {
                      "&, &:focus, &:hover, &:active": {
                        background:
                          colors[session.themeColor]["A100"] + "!important",
                        borderColor:
                          colors[session.themeColor]["A100"] + "!important",
                        color: "#000!important",
                      },
                    }),
                  }}
                  size="large"
                  variant="outlined"
                >
                  {choice.icon && (
                    <Icon className="outlined">{choice.icon}</Icon>
                  )}
                  {choice.name}
                </Button>
              ))
            ) : (
              <Box
                sx={{
                  flexGrow: 1,
                  flex: "0 0 100%",
                  overflow: "hidden",
                  "& .MuiSlider-mark": {
                    display: "none",
                  },
                  "& .MuiSlider-rail": {
                    background: `hsl(240,11%,${
                      session.user.darkMode ? 10 : 80
                    }%)`,
                  },
                  "& .MuiSlider-rail, & .MuiSlider-track": {
                    height: 20,
                    overflow: "hidden",
                  },
                  "& .MuiSlider-track": {
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  },
                  "& .MuiSlider-thumb": {
                    boxShadow: 0,
                    background: `hsl(240,11%,${
                      session.user.darkMode ? 10 : 90
                    }%)`,
                    border: "4px solid currentColor",
                  },
                }}
              >
                <Box sx={{ px: 3 }}>
                  <Box
                    sx={{
                      display: "block",
                      height: "100px",
                    }}
                  >
                    <Slider
                      step={1}
                      defaultValue={defaultData ? answer : question.default}
                      max={question.slider.length - 1}
                      onChange={(_, newValue) => {
                        setAnswers((a) => ({
                          ...a,
                          [currentQuestion]: newValue as any,
                        }));
                        handleSave(currentQuestion, newValue);
                      }}
                      marks={[
                        ...question.slider.map((mark, index) => ({
                          value: index,
                          label: (
                            <Label
                              code={mark}
                              sx={{
                                ...(typeof mark == "string" && {
                                  ...(index == 0 && { ml: 3 }),
                                  ...(index == question.slider.length - 1 && {
                                    mr: 3,
                                  }),
                                }),
                              }}
                            />
                          ),
                        })),
                      ]}
                    />
                  </Box>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "end" }}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      if (typeof answer !== "number") {
                        setAnswers((a) => ({
                          ...a,
                          [currentQuestion]: 1 as any,
                        }));
                        handleSave(currentQuestion, 1 as any);
                      }
                      setCurrentQuestion(currentQuestion + 1);
                      handleSave(currentQuestion, answer);
                    }}
                  >
                    Done
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        )}
      </SwipeableDrawer>
    </>
  );
}
