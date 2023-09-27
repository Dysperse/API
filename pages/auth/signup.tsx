import { Logo } from "@/components/Logo";
import { Intro } from "@/components/Onboarding/Intro";
import { ProfilePicture } from "@/components/Profile/ProfilePicture";
import { templates } from "@/components/Tasks/Board/Create";
import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { capitalizeFirstLetter } from "@/lib/client/capitalizeFirstLetter";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { useCustomTheme } from "@/lib/client/useTheme";
import useWindowDimensions from "@/lib/client/useWindowDimensions";
import themes from "@/pages/settings/themes.json";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  Icon,
  IconButton,
  InputAdornment,
  NoSsr,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import Avatar from "boring-avatars";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Virtuoso } from "react-virtuoso";
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone"); // dependent on utc plugin

dayjs.extend(utc);
dayjs.extend(timezone);

function Emoji({
  style = {},
  emoji,
  size,
}: {
  emoji: string;
  size: string | number;
  style?: any;
}) {
  return (
    <img
      src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${emoji}.png`}
      width={size}
      height={size}
      style={style}
    />
  );
}
function OnboardingTemplate({ template, formData, setFormData }) {
  const palette = useColor(formData.color, useDarkMode(formData.darkMode));
  const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <Typography variant="h4" className="font-heading">
            {template.name}
          </Typography>
          <Typography>{template.columns.length} columns</Typography>
        </DialogContent>
        <Button
          onClick={() => {
            setOpen(false);
            setTimeout(() => {
              if (formData.templates.includes(template)) {
                setFormData((d) => ({
                  ...d,
                  templates: d.templates.filter((t) => t !== template),
                }));
              } else {
                setFormData((d) => ({
                  ...d,
                  templates: [...d.templates, template],
                }));
              }
            }, 1000);
          }}
        >
          Create{formData.templates.includes(template) && "d"}
        </Button>
      </Dialog>
      <Box sx={{ pb: 2 }}>
        <Card
          onClick={() => setOpen(true)}
          sx={{
            background: palette[3],
            borderRadius: 5,
            maxWidth: "100%",
            ...(template.name === "Blank board" && {
              display: "none",
            }),
          }}
        >
          <CardActionArea sx={{ height: "100%" }}>
            <Box
              sx={{
                maxHeight: "70px",
                overflow: "hidden",
                position: "relative",
                ...(template.name === "Blank board" && {
                  display: "none",
                }),
              }}
            >
              <Avatar
                size="100%"
                square
                name={template.name}
                variant="marble"
                colors={["#0A0310", "#49007E", "#FF005B", "#FF7D10", "#FFB238"]}
              />
              {template.category && (
                <Chip
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    m: 1,
                    background: addHslAlpha(palette[2], 0.4),
                    backdropFilter: "blur(10px)",
                  }}
                  label={template.category}
                  size="small"
                />
              )}
            </Box>
            <Box sx={{ p: 3 }}>
              <Typography variant="h5">
                {template.name}{" "}
                {formData.templates.includes(template) && (
                  <Icon className="outlined" sx={{ verticalAlign: "middle" }}>
                    check_circle
                  </Icon>
                )}
              </Typography>
              {template.columns.length > 0 && (
                <Typography variant="body2" gutterBottom className="font-body">
                  {template.columns.length} columns
                </Typography>
              )}
            </Box>
          </CardActionArea>
        </Card>
      </Box>
    </>
  );
}

function StepOne({ styles, formData, setFormData, setStep }) {
  const palette = useColor(formData.color, useDarkMode(formData.darkMode));
  const ref: any = useRef();

  return (
    <Box sx={styles.container}>
      <Typography className="font-heading" variant="h3" sx={styles.heading}>
        Welcome
        <Emoji emoji="1f44b" size="40" />
      </Typography>
      <Typography variant="h6" sx={styles.subheading}>
        It&apos;s time to set the new standard for productivity
      </Typography>
      <TextField
        autoComplete="off"
        placeholder="What's your name?"
        value={formData.name}
        onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
        onKeyDown={(e) => e.key === "Enter" && ref?.current?.click()}
        variant="standard"
        InputProps={{
          autoComplete: "off",
          sx: styles.input,
          disableUnderline: true,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                ref={ref}
                disabled={!formData.name.trim()}
                onClick={() => setStep(1)}
              >
                <Icon>east</Icon>
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mt: 2 }}
      />
    </Box>
  );
}

function StepTwo({ styles, formData, setFormData, setStep }) {
  const palette = useColor(formData.color, useDarkMode(formData.darkMode));
  const ref: any = useRef();

  return (
    <Box sx={styles.container}>
      <Typography className="font-heading" variant="h3" sx={styles.heading}>
        Hey, {formData.name.split(" ")?.[0]}!
        <Emoji emoji="1f389" size="40" />
      </Typography>
      <Typography variant="h6" sx={styles.subheading}>
        Welcome to the party!
      </Typography>
      <Typography sx={styles.subheading}>
        Who best describes you from the options below?
      </Typography>
      <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
        {[
          "High school student",
          "College student",
          "Educator",
          "Freelancer",
          "Entrepreneur",
          "Researcher",
          "Remote worker",
          "Someone else!",
        ].map((role) => (
          <Chip
            onClick={() => {
              setFormData((d) => ({ ...d, category: role }));
              setStep(2);
            }}
            label={role}
          />
        ))}
      </Box>
    </Box>
  );
}

function StepThree({ styles, formData, setFormData, setStep }) {
  const palette = useColor(formData.color, useDarkMode(formData.darkMode));
  const ref: any = useRef();

  const [rerender, setrerender] = useState(false);
  useEffect(() => setrerender(true), []);

  return (
    <Box sx={styles.container} ref={ref}>
      <Typography className="font-heading" variant="h3" sx={styles.heading}>
        Let&apos;s create some boards!
      </Typography>
      <Typography variant="h6" sx={styles.subheading} gutterBottom>
        Boards are sweet places where you can organize anything from your
        assignments, to project planning.
      </Typography>
      <Virtuoso
        useWindowScroll
        customScrollParent={ref.current}
        data={templates}
        itemContent={(index) => {
          const template = templates[index];
          return (
            <OnboardingTemplate
              key={index}
              template={template}
              formData={formData}
              setFormData={setFormData}
            />
          );
        }}
      />
      <Box
        sx={{
          position: "sticky",
          bottom: -40,
          left: 0,
          background: addHslAlpha(palette[1], 0.9),
          display: "flex",
          p: 3,
          pt: 2,
          justifyContent: "end",
          backdropFilter: "blur(10px)",
        }}
      >
        <Button variant="contained" onClick={() => setStep(3)}>
          Continue <Icon>east</Icon>
        </Button>
      </Box>
    </Box>
  );
}

function StepFour({ styles, formData, setFormData, setStep }) {
  const palette = useColor(formData.color, useDarkMode(formData.darkMode));
  const plumTheme = useColor("plum", useDarkMode(formData.darkMode));
  const rubyTheme = useColor("ruby", useDarkMode(formData.darkMode));
  const grassTheme = useColor("grass", useDarkMode(formData.darkMode));
  const ref: any = useRef();

  return (
    <Box sx={{ ...styles.container }}>
      <Typography
        className="font-heading"
        variant="h3"
        sx={{
          ...styles.heading,
          display: "flex",
          transition: "all .2s!important",
        }}
      >
        You unlocked new themes!
      </Typography>
      <Typography
        variant="h6"
        sx={{ ...styles.subheading, transition: "all .2s!important" }}
      >
        You&apos;ll be rewarded with 30+ more throughout your journey.
      </Typography>

      <Box sx={{ display: "flex", gap: 2 }}>
        {[
          { name: "grass", theme: grassTheme },
          { name: "ruby", theme: rubyTheme },
          { name: "plum", theme: plumTheme },
        ].map((theme, index) => (
          <Box
            key={index}
            onClick={() => {
              setFormData((d) => ({ ...d, color: theme.name }));
              setStep(3);
            }}
            sx={{
              width: "100%",
              "& .animate": {
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                py: 2.5,
                px: 2,
                fontSize: "14px",
                fontWeight: 900,
                my: 2,
                borderRadius: 5,
                color: theme.theme[9],
                border: `2px solid ${theme.theme[4]}`,
                transition: "border-color .2s, background .2s",
                "&:hover": {
                  background: theme.theme[3],
                  border: `2px solid ${theme.theme[6]}`,
                },
                ...(formData.color === theme.name && {
                  background: theme.theme[3],
                  border: `2px solid ${theme.theme[6]}`,
                }),
              },
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="animate"
              transition={{ delay: 0.3 * index }}
            >
              <Icon
                className={theme.name !== formData.color ? "outlined" : ""}
                sx={{
                  transition: "all .2s",
                  fontSize: "100px",
                  background: `linear-gradient(${
                    index !== 1 ? "45deg" : "-45deg"
                  }, ${theme.theme[7]}, ${theme.theme[index == 1 ? 9 : 10]})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                hexagon
              </Icon>
              {themes[theme.name].name}
            </motion.div>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          onClick={() => {
            let l = "";
            if (formData.darkMode === "light") l = "dark";
            else if (formData.darkMode === "dark") l = "system";
            else if (formData.darkMode === "system") l = "light";
            setFormData((d) => ({ ...d, darkMode: l }));
          }}
          sx={{
            mr: "auto",
            borderWidth: "2px!important",
            transition: "all .2s!important",
          }}
          variant="outlined"
        >
          <Icon>dark_mode</Icon>
          {formData.darkMode === "system"
            ? "System theme"
            : `${capitalizeFirstLetter(formData.darkMode)} mode`}
        </Button>
        <Button
          sx={{
            display: "flex",
            color: palette[12] + "!important",
            opacity: 1,
            transition: "all .2s!important",
          }}
          onClick={() => setStep(4)}
          disabled={formData.color === "lime"}
          variant="contained"
        >
          {formData.color === "lime" ? "Pick one above!" : "Continue"}
          <Emoji
            emoji={formData.color === "lime" ? "261d" : "1f449"}
            size={20}
          />
        </Button>
      </Box>
    </Box>
  );
}

function StepFive({ styles, formData, setFormData, setStep }) {
  const palette = useColor(formData.color, useDarkMode(formData.darkMode));
  const ref: any = useRef();
  const fileRef: any = useRef();

  const [exists, setExists] = useState(false);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  useEffect(() => {
    setLoadingAvailability(true);
    const delayDebounceFn = setTimeout(async () => {
      const user = await fetch(
        `/api/user/profile?` +
          new URLSearchParams({
            email: formData.username,
            username: formData.username,
          })
      ).then((res) => res.json());
      setLoadingAvailability(false);
      if (user?.name) {
        setExists(true);
      } else {
        setExists(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [formData.username]);

  return (
    <Box sx={styles.container}>
      <Typography className="font-heading" variant="h3" sx={styles.heading}>
        Create your profile
      </Typography>
      <Typography variant="h6" sx={styles.subheading}>
        Build your productivity profile. You can choose who can see it later.
      </Typography>
      <TextField
        autoComplete="off"
        placeholder="What's your email?"
        value={formData.email}
        onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
        onKeyDown={(e) => e.key === "Enter" && ref?.current?.click()}
        variant="standard"
        InputProps={{
          autoComplete: "off",
          sx: styles.input,
          disableUnderline: true,
        }}
        sx={{ my: 2 }}
      />
      <DatePicker
        maxDate={dayjs()}
        slotProps={{
          textField: {
            variant: "standard",
            placeholder: "What's your birthday?",
            InputProps: {
              disableUnderline: true,
              sx: styles.input,
            },
          },
        }}
      />
      <Box sx={{ display: "flex", mt: 2 }}>
        <Button
          variant="contained"
          sx={{ ml: "auto" }}
          disabled={(formData.username && exists) || loadingAvailability}
        >
          Continue <Icon>east</Icon>
        </Button>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: "flex", gap: 2 }}>
        <Box
          sx={{
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box sx={{ width: "90" }}>
            <ProfilePicture
              data={{
                name: formData.name,
                Profile: formData.picture
                  ? {
                      picture: formData.picture,
                    }
                  : undefined,
                theme: formData.color,
              }}
              size={90}
              darkMode={formData.darkMode}
            />
          </Box>
          <input
            type="file"
            ref={fileRef}
            hidden
            onChange={(e) => {
              toast.promise(
                new Promise(async (resolve, reject) => {
                  if (!e.target.files) {
                    reject("No files uploaded");
                    return;
                  }
                  try {
                    const form = new FormData();
                    form.append("image", e.target.files[0]);
                    const res = await fetch(`/api/upload`, {
                      method: "POST",
                      body: form,
                    }).then((res) => res.json());
                    if (!res.image.url) {
                      reject("Duplicate");
                      return;
                    }
                    setFormData((d) => ({ ...d, picture: res.image.url }));
                    resolve(res);
                  } catch (e) {
                    console.log(e);
                    reject("");
                  }
                }),
                {
                  loading: "Uploading...",
                  success: "Changed!",
                  error:
                    "Couldn't change profile picture. Please try again later",
                }
              );
            }}
            accept="image/png, image/jpeg"
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              width: "130px",
            }}
          >
            <Button
              size="small"
              variant="contained"
              fullWidth
              onClick={() => fileRef.current?.click()}
            >
              <Icon>upload</Icon>
              {!formData.picture && "Upload"}
            </Button>
            {formData.picture && (
              <Button
                size="small"
                variant="outlined"
                onClick={() => setFormData((d) => ({ ...d, picture: null }))}
              >
                <Icon>close</Icon>
              </Button>
            )}
          </Box>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <TextField
            autoComplete="off"
            placeholder="Pick a username"
            value={formData.username}
            onChange={(e) =>
              setFormData((d) => ({
                ...d,
                username: e.target.value.replaceAll(" ", "-").toLowerCase(),
              }))
            }
            variant="standard"
            InputProps={{
              autoComplete: "off",
              sx: styles.input,
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <Icon>alternate_email</Icon>
                </InputAdornment>
              ),
              endAdornment: formData.username && (
                <InputAdornment position="end">
                  <Icon className="outlined">
                    {exists ? "cancel" : "check_circle"}
                  </Icon>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            autoComplete="off"
            placeholder="Add a bio..."
            multiline
            rows={3}
            value={formData.bio}
            onChange={(e) =>
              setFormData((d) => ({ ...d, bio: e.target.value }))
            }
            variant="standard"
            InputProps={{
              autoComplete: "off",
              sx: { ...styles.input, p: 2 },
              disableUnderline: true,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
function StepSix({ styles, formData, setFormData, setStep }) {
  const palette = useColor(formData.color, useDarkMode(formData.darkMode));
  const ref: any = useRef();

  return (
    <Box sx={styles.container}>
      <Typography className="font-heading" variant="h3" sx={styles.heading}>
        Create a password
      </Typography>
      <Typography variant="h6" sx={styles.subheading}>
        Create a stong password
      </Typography>
      <TextField
        autoComplete="off"
        placeholder="Password"
        value={formData.password}
        onChange={(e) =>
          setFormData((d) => ({ ...d, password: e.target.value }))
        }
        variant="standard"
        InputProps={{
          autoComplete: "off",
          sx: styles.input,
          disableUnderline: true,
        }}
        sx={{ mt: 2 }}
      />
      <TextField
        autoComplete="off"
        placeholder="Confirm password"
        value={formData.confirmPassword}
        onChange={(e) =>
          setFormData((d) => ({ ...d, confirmPassword: e.target.value }))
        }
        onKeyDown={(e) => e.key === "Enter" && ref?.current?.click()}
        variant="standard"
        InputProps={{
          autoComplete: "off",
          sx: styles.input,
          disableUnderline: true,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                ref={ref}
                disabled={!formData.confirmPassword.trim()}
                onClick={() => setStep(1)}
              >
                <Icon>east</Icon>
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mt: 2 }}
      />
    </Box>
  );
}

function Signup({ formData, setFormData }) {
  const palette = useColor(formData.color, useDarkMode(formData.darkMode));

  const [step, setStep] = useState(0);

  const styles = useMemo(
    () => ({
      container: {
        transition: "all .2s",
        mx: "auto",
        maxWidth: "570px",
        zIndex: 999,
        maxHeight: "calc(100% - 20px)",
        overflowY: "scroll",
        width: "100%",
        border: `2px solid ${addHslAlpha(palette[4], 0.5)}`,
        boxShadow: `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`,
        backdropFilter: "blur(2px)",
        p: 4,
        borderRadius: 5,
      },
      heading: {
        display: "flex",
        alignItems: "center",
        zIndex: 999,
        gap: 2,
        color: palette[12],
      },
      subheading: {
        lineHeight: 1.5,
        color: palette[12],
        opacity: 0.7,
        fontWeight: 100,
      },
      input: {
        background: addHslAlpha(palette[4], 0.6),
        border: "2px solid",
        borderColor: addHslAlpha(palette[4], 0.6),
        "&:hover": {
          background: addHslAlpha(palette[4], 0.7),
          borderColor: addHslAlpha(palette[4], 0.7),
        },
        "&:focus-within": {
          background: "transparent",
          borderColor: addHslAlpha(palette[8], 0.6),
        },
        px: 2,
        py: 1,
        borderRadius: 5,
      },
    }),
    [palette]
  );

  const steps = useMemo(
    () => [
      <StepOne
        styles={styles}
        formData={formData}
        setFormData={setFormData}
        setStep={setStep}
      />,
      <StepTwo
        styles={styles}
        formData={formData}
        setFormData={setFormData}
        setStep={setStep}
      />,
      <StepThree
        styles={styles}
        formData={formData}
        setFormData={setFormData}
        setStep={setStep}
      />,
      <StepFour
        styles={styles}
        formData={formData}
        setFormData={setFormData}
        setStep={setStep}
      />,
      <StepFive
        styles={styles}
        formData={formData}
        setFormData={setFormData}
        setStep={setStep}
      />,
      <StepSix
        styles={styles}
        formData={formData}
        setFormData={setFormData}
        setStep={setStep}
      />,
    ],
    [formData, setFormData, styles, setStep]
  );

  const isDark = useDarkMode(formData.darkMode);
  const { width } = useWindowDimensions();

  const theme = createTheme(
    useCustomTheme({
      darkMode: isDark,
      themeColor: formData.color,
    })
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{}}>
        <Box
          sx={{
            "& svg, & .MuiTypography-root": {
              transition: "all .2s",
            },
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 3,
            position: "fixed",
            top: 0,
            left: 0,
          }}
        >
          <Logo color={formData.color} size={75} intensity={isDark ? 7 : 11} />
          <Typography
            variant="h2"
            className="font-heading"
            sx={{ color: palette[7] }}
          >
            Dysperse
          </Typography>
        </Box>
        <Box
          sx={{
            position: "fixed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            top: 0,
            left: 0,
            width: "100dvw",
            height: "100dvh",
            flexDirection: "column",
            pt: "90px",
            zIndex: 999,
          }}
        >
          {steps[step]}
        </Box>
        <Button
          onClick={() => setStep((s) => (s == 0 ? 0 : s - 1))}
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            zIndex: 99999,
          }}
        >
          Back
        </Button>
        <Button
          onClick={() => setStep((s) => s + 1)}
          sx={{
            position: "fixed",
            bottom: 0,
            right: 0,
            zIndex: 99999,
          }}
        >
          Next
        </Button>
      </Box>
      {/* Fade */}
      <AnimatePresence>
        <motion.div
          key={formData.color}
          initial={{ x: -300 }}
          animate={{ x: width + 300 }}
          transition={{ duration: 0.6 }}
          style={{ zIndex: -999 }}
        >
          <Box
            sx={{
              transform: "skew(-10deg,-0deg)",
              width: "300px",
              display: "block",
              height: "100dvh",
              position: "absolute",
              top: 0,
              left: 0,
              background: `linear-gradient(90deg, transparent, ${palette[9]}, transparent)`,
              opacity: 0.1,
            }}
          />
        </motion.div>
      </AnimatePresence>
    </ThemeProvider>
  );
}

export default function Page() {
  const timeZone = dayjs.tz.guess();
  const [formData, setFormData] = useState<any>({
    name: "",
    email: "",
    bio: "",
    password: "",
    category: "",
    confirmPassword: "",
    captchaToken: "",
    color: "lime",
    darkMode: "system",
    picture: null,
    timeZone,
    templates: [],
  });

  const palette = useColor(formData.color, useDarkMode(formData.darkMode));

  return (
    <NoSsr>
      <Box
        sx={{
          background: palette[1],
          color: palette[12],
          height: "100dvh",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='${encodeURIComponent(
            palette[11]
          )}' stroke-opacity='0.04'%3E%3Cpath d='M0 .5H31.5V32' /%3E%3C/svg%3E%0A")`,
          backgroundRepeat: "repeat",
          transition: "all .2s",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100dvw",
        }}
      >
        <Intro color={formData.color} darkMode={formData.darkMode} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 6 }}
        >
          <Signup formData={formData} setFormData={setFormData} />
        </motion.div>
      </Box>
    </NoSsr>
  );
}
