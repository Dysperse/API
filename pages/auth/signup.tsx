import { isEmail } from "@/components/Group/Members/isEmail";
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
import styled from "@emotion/styled";
import { Turnstile } from "@marsidev/react-turnstile";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardActionArea,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  Icon,
  IconButton,
  InputAdornment,
  LinearProgress,
  NoSsr,
  Skeleton,
  SwipeableDrawer,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import BoringAvatar from "boring-avatars";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { VirtuosoGrid } from "react-virtuoso";
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone"); // dependent on utc plugin

dayjs.extend(utc);
dayjs.extend(timezone);

const ItemContainer = styled.div`
  width: 25%;
  display: flex;
  flex: none;
  align-content: stretch;
  box-sizing: border-box;
`;

const ItemWrapper = styled.div`
  flex: 1;
  height: 220px;
  text-align: center;
`;

const ListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mt: 2,
              overflowX: "scroll",
            }}
          >
            {template.columns.map((column) => (
              <Box
                key={column.id}
                sx={{
                  width: "100%",
                  minWidth: "200px",
                  overflowX: "auto",
                  p: { xs: 1.5, sm: 2.5 },
                  gap: 2,
                  background: palette[3],
                  borderRadius: 3,
                }}
              >
                <img
                  src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${column.emoji}.png`}
                  height="30px"
                  alt="emoji"
                />

                <Typography
                  sx={{
                    fontSize: 18,
                    fontWeight: 600,
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {column.name}
                </Typography>
                <Skeleton width="90%" animation={false} />
                <Skeleton width="100%" animation={false} />
                <Skeleton width="70%" animation={false} />
              </Box>
            ))}
          </Box>
        </DialogContent>
        <Box sx={{ p: 2 }}>
          <Button
            className="contained"
            fullWidth
            sx={{ background: palette[3] + "!important" }}
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
        </Box>
      </Dialog>
      <Card
        onClick={() => setOpen(true)}
        sx={{
          background: palette[3],
          borderRadius: 5,
          maxWidth: "100%",
          height: "220px",
          position: "relative",
        }}
      >
        <CardActionArea
          sx={{
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          <Box
            sx={{
              maxHeight: "220px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <BoringAvatar
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
          <Box
            sx={{
              p: 3,
              mt: "auto",
              zIndex: 999,
              position: "absolute",
              top: 0,
              left: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <Typography variant="h4">
              {template.name}{" "}
              {formData.templates.includes(template) && (
                <Icon className="outlined" sx={{ verticalAlign: "middle" }}>
                  check_circle
                </Icon>
              )}
            </Typography>
            {template.columns.length > 0 && (
              <Typography variant="body2" sx={{ mt: 1 }} className="font-body">
                {template.columns.length} columns
              </Typography>
            )}
          </Box>
        </CardActionArea>
      </Card>
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
      <Button variant="outlined" onClick={() => setStep(0)} sx={{ mb: 2 }}>
        <Icon>west</Icon>
      </Button>
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
            key={role}
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

  const [subStep, setSubStep] = useState(0);
  const [open, setOpen] = useState(false);

  return (
    <Box sx={styles.container}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Image
          src={
            subStep === 0
              ? "/images/boards.png"
              : "/images/perspectives/days.png"
          }
          blurDataURL="data:image/png;base64,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"
          placeholder="blur"
          width={1920}
          height={1080}
          alt="Boards"
          style={{
            borderRadius: "20px",
            width: "100%",
            maxWidth: "calc(100% - 20px)",
            height: "auto",
          }}
        />
      </Box>
      <Typography
        className="font-heading"
        variant="h3"
        sx={{ ...styles.heading, mt: 2, justifyContent: "center" }}
      >
        {subStep === 0 ? "Let's create some boards!" : "Perspectives"}
      </Typography>
      <Typography
        sx={{ ...styles.subheading, mt: 1, mb: 2, textAlign: "center" }}
      >
        {subStep == 0
          ? "Boards are sweet places where you can organize anything from your assignments, to project planning."
          : `Later, you'll be able to connect your favorite apps with boards and import data. Everything created in boards will appear in planner-style perspectives.`}
      </Typography>
      <SwipeableDrawer
        open={open}
        anchor="right"
        PaperProps={{
          ref,
          sx: {
            height: "100dvh",
            display: "flex",
            width: "100dvw",
          },
        }}
        onClose={() => setOpen(false)}
      >
        <AppBar sx={{ border: 0 }}>
          <Toolbar>
            <IconButton onClick={() => setOpen(false)}>
              <Icon>close</Icon>
            </IconButton>
            Templates
          </Toolbar>
        </AppBar>
        <Typography
          variant="h3"
          className="font-heading"
          sx={{ p: 8, pb: 2, pt: 1 }}
        >
          For you
        </Typography>
        <Box sx={{ flexGrow: 1, px: 4 }}>
          <VirtuosoGrid
            components={{
              Item: ItemContainer,
              List: ListContainer as any,
              ScrollSeekPlaceholder: () => (
                <ItemContainer>
                  <ItemWrapper
                    style={{
                      padding: "10px",
                    }}
                  >
                    <Skeleton
                      width="100%"
                      sx={{ borderRadius: 5 }}
                      height={"100%"}
                      variant="rectangular"
                    />
                  </ItemWrapper>
                </ItemContainer>
              ),
            }}
            totalCount={
              templates.filter((t) => t.name !== "Blank board").length
            }
            style={{
              height: "100%",
              width: "100%",
            }}
            itemContent={(index) => {
              const template = templates[index + 1];

              return (
                <Box sx={{ flex: 1, pt: 4, px: 2 }}>
                  <OnboardingTemplate
                    key={index}
                    template={template}
                    formData={formData}
                    setFormData={setFormData}
                  />
                </Box>
              );
            }}
            scrollSeekConfiguration={{
              enter: (velocity) => Math.abs(velocity) > 200,
              exit: (velocity) => Math.abs(velocity) < 30,
              change: (_, range) => console.log({ range }),
            }}
          />
        </Box>
      </SwipeableDrawer>
      <Box
        sx={{
          justifyContent: "center",
          gap: 2,
          display: "flex",
        }}
      >
        <Button
          onClick={() => {
            if (subStep === 0) setStep(1);
            else setSubStep(0);
          }}
        >
          <Icon>west</Icon>
        </Button>
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          sx={{
            ...(subStep === 1 && { display: "none" }),
          }}
        >
          Create <Icon>auto_awesome</Icon>
        </Button>
        <Button
          variant={
            subStep == 1
              ? "contained"
              : formData.templates.length === 0
              ? "text"
              : "contained"
          }
          onClick={() => {
            if (subStep == 0) setSubStep(1);
            else setStep(3);
          }}
        >
          {subStep == 1
            ? "Sweet!"
            : formData.templates.length == 0
            ? "Skip"
            : "Continue"}{" "}
          <Icon>east</Icon>
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
        You&apos;ll be able to earn 30+ more throughout your journey.
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
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button variant="outlined" onClick={() => setStep(2)}>
          <Icon>west</Icon>
        </Button>
        <Button
          onClick={() => {
            let l = "";
            if (formData.darkMode === "light") l = "dark";
            else if (formData.darkMode === "dark") l = "system";
            else if (formData.darkMode === "system") l = "light";
            setFormData((d) => ({ ...d, darkMode: l }));
          }}
          sx={{
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

  const [exists, setExists] = useState<any>(false);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  useEffect(() => {
    setLoadingAvailability(true);
    const delayDebounceFn = setTimeout(async () => {
      const user = await fetch(
        `/api/user/profile?` +
          new URLSearchParams({
            email: formData.email,
            username: formData.username,
          })
      )
        .then((res) => {
          setLoadingAvailability(false);
          return res.json();
        })
        .catch((err) => {
          toast.error(
            "Couldn't check if this username is available. Please try again later..."
          );
          setLoadingAvailability(true);
        });
      if (user?.name) {
        setExists(user);
      } else {
        setExists(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [formData.username, formData.email]);

  return (
    <Box sx={styles.container}>
      <Typography className="font-heading" variant="h3" sx={styles.heading}>
        Create a Profile
      </Typography>
      <Typography variant="h6" sx={styles.subheading}>
        Productivity profiles are a great way to instantly gather availability.
        You can always choose who can see it later.
      </Typography>
      <TextField
        autoComplete="off"
        placeholder="What's your email?"
        helperText={
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              justifyContent: "center",
            }}
          >
            Used for your account only. We won&apos;t send you any newsletters!
            <Emoji emoji="1f607" size={24} />
          </span>
        }
        value={formData.email}
        onChange={(e) =>
          setFormData((d) => ({
            ...d,
            email: e.target.value.replaceAll(" ", ""),
          }))
        }
        onKeyDown={(e) => e.key === "Enter" && ref?.current?.click()}
        variant="standard"
        InputProps={{
          autoComplete: "off",
          sx: styles.input,
          disableUnderline: true,
          endAdornment:
            formData.email && !isEmail(formData.email) ? (
              <Icon className="outlined">cancel</Icon>
            ) : loadingAvailability && formData.email ? (
              <CircularProgress />
            ) : (
              exists && (
                <InputAdornment position="end">
                  <Icon className="outlined">
                    {exists?.email === formData.email
                      ? "cancel"
                      : "check_circle"}
                  </Icon>
                </InputAdornment>
              )
            ),
        }}
        sx={{ my: 2 }}
      />
      <DatePicker
        maxDate={dayjs()}
        onChange={(e) => setFormData((d) => ({ ...d, birthday: e }))}
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
      <Box sx={{ display: "flex", mt: 2, justifyContent: "space-between" }}>
        <Button variant="outlined" onClick={() => setStep(2)}>
          <Icon>west</Icon>
        </Button>
        <Button
          variant="contained"
          disabled={
            exists ||
            loadingAvailability ||
            !formData.email.trim() ||
            !formData.birthday ||
            dayjs(formData.birthday || "-1").isValid() === false
          }
          onClick={() => setStep(5)}
        >
          Continue <Icon>east</Icon>
        </Button>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Typography
        sx={{
          textAlign: "center",
          opacity: 0.5,
          fontWeight: 900,
          fontSize: "14px",
          mb: 2,
        }}
      >
        OPTIONAL
      </Typography>
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
                color: formData.color,
                email: formData.name,
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
              gap: 1,
              width: "130px",
              "& .MuiButton-root": {
                minWidth: "40px",
              },
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
                    {exists?.username === formData.username
                      ? "cancel"
                      : formData.email
                      ? "check_circle"
                      : ""}
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
        Must be 8+ characters, with both numbers and letters
      </Typography>
      <TextField
        name="password"
        type="password"
        autoComplete="new-password"
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
        name="password"
        type="password"
        autoComplete="new-password"
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
        }}
        sx={{ mt: 2 }}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button variant="outlined" onClick={() => setStep(4)}>
          <Icon>west</Icon>
        </Button>
        <Button
          onClick={() => setStep(6)}
          variant="contained"
          disabled={
            formData.password !== formData.confirmPassword ||
            formData.password.length < 8 ||
            !formData.password.match(/[a-zA-Z]/g) ||
            !formData.password.match(/[0-9]/g)
          }
        >
          Finish <Icon>check</Icon>
        </Button>
      </Box>
    </Box>
  );
}

function StepSeven({ styles, formData, setFormData, setStep }) {
  const palette = useColor(formData.color, useDarkMode(formData.darkMode));
  const ref: any = useRef();
  const router = useRouter();

  const createAccount = useCallback(async () => {
    if (formData.captchaToken) {
      try {
        const account = await fetch(`/api/auth/signup`, {
          method: "POST",
          body: JSON.stringify({
            ...formData,
            birthday: dayjs(formData.birthday).toISOString(),
          }),
        }).then((res) => res.json());
        router.push("/");
      } catch (e) {
        toast.dismiss();
        toast.error(
          <>
            Something went wrong!? Please try again later
            <Button onClick={createAccount}>Retry</Button>
          </>,
          {
            duration: 9999999999,
          }
        );
      }
    }
  }, [formData]);

  useEffect(() => {
    createAccount();
  }, [createAccount]);

  return (
    <Box sx={styles.container}>
      {formData.captchaToken ? (
        <>
          <Typography className="font-heading" variant="h3" sx={styles.heading}>
            Almost there...
          </Typography>
          <Box
            sx={{
              display: "flex",
            }}
          >
            <CircularProgress />{" "}
            <Box>
              <b>Creating your account...</b>
              <p>This may take a while</p>
            </Box>
          </Box>
        </>
      ) : (
        <>
          <Typography className="font-heading" variant="h3" sx={styles.heading}>
            Verifying...
          </Typography>
          <Typography variant="h6" sx={styles.subheading}>
            You&apos;re probably human, but we still have to check from our side{" "}
            <Emoji
              size={24}
              emoji="1f928"
              style={{ verticalAlign: "middle" }}
            />
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Turnstile
              ref={ref}
              siteKey="0x4AAAAAAABo1BKboDBdlv8r"
              onError={() => {
                ref.current?.reset();
                toast.error("An error occured. Retrying...");
              }}
              onExpire={() => {
                ref.current?.reset();
                toast.error("Captcha expired. Retrying...");
              }}
              scriptOptions={{ defer: true }}
              options={{ retry: "auto" }}
              onSuccess={(token) =>
                setFormData((d) => ({ ...d, captchaToken: token }))
              }
            />
          </Box>
        </>
      )}
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
        maxHeight: "calc(100% - 70px)",
        overflowY: "scroll",
        width: "100%",
        border: `2px solid ${addHslAlpha(palette[4], 0.5)}`,
        boxShadow: `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`,
        background: palette[1],
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
        key="1"
        styles={styles}
        formData={formData}
        setFormData={setFormData}
        setStep={setStep}
      />,
      <StepTwo
        key="2"
        styles={styles}
        formData={formData}
        setFormData={setFormData}
        setStep={setStep}
      />,
      <StepThree
        key="3"
        styles={styles}
        formData={formData}
        setFormData={setFormData}
        setStep={setStep}
      />,
      <StepFive
        key="4"
        styles={styles}
        formData={formData}
        setFormData={setFormData}
        setStep={setStep}
      />,
      <StepFour
        key="5"
        styles={styles}
        formData={formData}
        setFormData={setFormData}
        setStep={setStep}
      />,
      <StepSix
        key="6"
        styles={styles}
        formData={formData}
        setFormData={setFormData}
        setStep={setStep}
      />,
      <StepSeven
        key="7"
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

          <LinearProgress
            variant="determinate"
            sx={{
              flexShrink: 0,
              maxWidth: "400px",
              width: "100%",
              height: "7px",
              mt: 2,
              background: palette[4],
              borderRadius: 999,
              "& *": {
                borderRadius: 999,
                transition: "all .3s cubic-bezier(.3,.66,.11,1.29)!important",
              },
            }}
            value={((step + 1) / steps.length) * 100}
          />
        </Box>
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
    birthday: null,
    password: "",
    category: "",
    confirmPassword: "",
    captchaToken: null,
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
          "& .MuiButton-outlined": {
            borderWidth: "2px!important",
          },
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
