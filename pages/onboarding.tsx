import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Icon,
  InputLabel,
  ListItemButton,
  ListItemText,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Step,
  StepConnector,
  StepIconProps,
  StepLabel,
  Stepper,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { stepConnectorClasses } from "@mui/material/StepConnector";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { templates } from "../components/Boards/Board/Create";
import { Loading } from "../components/Layout/Loading";
import { Color } from "../components/Onboarding/Color";
import { InventoryList } from "../components/Onboarding/InventoryList";
import { cards } from "../components/Rooms/CreateItem/cards";
import { updateSettings } from "../components/Settings/updateSettings";
import { fetchApiWithoutHook } from "../hooks/useApi";
import { colors } from "../lib/colors";
import { useSession } from "./_app";

function BoardTemplate({ template }) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  return (
    <ListItemButton
      onClick={() => {
        setLoading(true);
        fetchApiWithoutHook("property/boards/create", {
          board: JSON.stringify(template),
        }).then(async () => {
          setAdded(true);
          setLoading(false);
        });
      }}
      key={template.name}
      disabled={added}
      sx={{ mt: 1, transition: "none" }}
    >
      <Box>
        <Box>
          <ListItemText
            primary={template.name}
            secondary={template.description.replace("NEW: ", "")}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          {template.columns.map((column, index) => (
            <picture key={index}>
              <img src={column.emoji} width="25px" height="25px" alt="emoji" />
            </picture>
          ))}
        </Box>
      </Box>
      {loading && <CircularProgress sx={{ ml: "auto" }} />}
      {added && <Icon sx={{ ml: "auto" }}>check_circle</Icon>}
    </ListItemButton>
  );
}

function StepContent({ forStep, currentStep, setCurrentStep, content }) {
  return forStep === currentStep ? (
    <Box>
      {content}
      <Box
        sx={{
          display: currentStep === 1 || currentStep === 5 ? "none" : "flex",
          justifyContent: "flex-end",
          mt: 2,
        }}
      >
        <Button
          onClick={() => setCurrentStep(currentStep + 1)}
          variant="contained"
          size="large"
          className="rippleDark"
          sx={{
            borderRadius: 9999,
          }}
        >
          Next
        </Button>
      </Box>
    </Box>
  ) : null;
}
const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: colors[themeColor ?? "brown"][500],
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: colors[themeColor ?? "brown"][500],
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled("div")<{ ownerState: { active?: boolean } }>(
  ({ theme, ownerState }) => ({
    color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
    display: "flex",
    height: 22,
    alignItems: "center",
    ...(ownerState.active && {
      color: colors[themeColor ?? "brown"][500],
    }),
    "& .QontoStepIcon-completedIcon": {
      color: colors[themeColor ?? "brown"][500],
      zIndex: 1,
      fontSize: 18,
    },
    "& .QontoStepIcon-circle": {
      width: 8,
      height: 8,
      borderRadius: "50%",
      marginLeft: "10px",
      backgroundColor: "currentColor",
    },
  })
);

function QontoStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <span
          className="material-symbols-rounded"
          style={{
            color: colors[themeColor ?? "brown"][500],
          }}
        >
          check
        </span>
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

export default function Onboarding() {
  const router = useRouter();
  const steps = [
    "Welcome to Dysperse!",
    "Customize your theme",
    "Edit your home",
    "Add some items",
    "You're all set!",
  ];

  const [type, setType] = useState(global.property.profile.type || "apartment");
  const [bestDescription, setBestDescription] = useState("Student");

  const handleChange = (event: SelectChangeEvent) => {
    setType(event.target.value as string);
    updateSettings(
      "type",
      event.target.value as string,
      false,
      () => null,
      true
    );
  };

  const content = [
    <>
      <Typography variant="h5">Welcome to Dysperse!</Typography>
      <Typography
        variant="body1"
        sx={{
          fontWeight: 400,
          marginTop: 2,
        }}
      >
        Thank you for choosing Dysperse! We&apos;re excited to have you here.
        <br />
        <br />
        Let&apos;s get started by customizing your group and dashboard 🔥
      </Typography>
    </>,
    <>
      <Typography variant="h5">Choose your look and feel</Typography>
      <Typography variant="h6" sx={{ mt: 4 }}>
        <span style={{ opacity: 0.6 }}>#1 </span>
        What&apos;s your favorite color?
      </Typography>
      {[
        "lime",
        "red",
        "green",
        "blue",
        "pink",
        "purple",
        "indigo",
        "amber",
        "cyan",
      ].map((color) => (
        <Color handleNext={() => null} color={color} key={color} />
      ))}

      <Typography variant="h6" sx={{ mt: 4 }}>
        <span style={{ opacity: 0.6 }}>#2 </span>
        Select a theme
      </Typography>
      <Color handleNext={() => setStep(step + 1)} color="grey" />
      <Color handleNext={() => setStep(step + 1)} color="white" />
    </>,
    <>
      <Typography variant="h6" sx={{ mt: 0, mb: 1 }}>
        <span style={{ opacity: 0.6 }}>#3 </span>
        What best describes <i>you</i>?
      </Typography>
      <FormControl>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="female"
          name="radio-buttons-group"
          value={bestDescription}
          onChange={(_, value) => {
            setBestDescription(value);
          }}
        >
          {[
            {
              icon: "book",
              name: "Student",
              description:
                "You're a high-school student trying to organize your assignments & tests.",
            },
            {
              icon: "school",
              name: "College student",
              description:
                "You're a college student trying to organize your assignments & tests.",
            },
            {
              icon: "cast_for_education",
              name: "Educator",
              description:
                "You're an educator trying to organize your lesson plans.",
            },
            {
              icon: "directions_run",
              name: "Adult",
              description:
                "You're an independent adult trying to organize your life",
            },
          ].map((type) => (
            <FormControlLabel
              key={type.name}
              value={type.name}
              control={<Radio />}
              label={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    my: 1,
                  }}
                >
                  <Icon
                    sx={{ fontSize: "36px !important" }}
                    className="outlined"
                  >
                    {type.icon}
                  </Icon>
                  <div>
                    <Typography>{type.name}</Typography>
                    <Typography variant="body2">{type.description}</Typography>
                  </div>
                </Box>
              }
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
        <span style={{ opacity: 0.6 }}>#4 </span>
        About your group
      </Typography>
      <FormControl fullWidth margin="dense">
        <InputLabel id="demo-simple-select-label" sx={{ mt: 2 }}>
          Group type
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={type}
          sx={{ pl: 0.2 }}
          variant="filled"
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value="study group">
            Study group
            <Chip label="NEW" color="error" size="small" />
          </MenuItem>
          <MenuItem value="dorm">Dorm</MenuItem>
          <MenuItem value="apartment">Apartment</MenuItem>
          <MenuItem value="home">Home</MenuItem>
        </Select>
        <FormHelperText>
          What type of residence do you live in? You can also select &quot;study
          group&quot;.
        </FormHelperText>
      </FormControl>
      <TextField
        variant="filled"
        label="Set a name for your group"
        placeholder={
          type === "home" || type === "apartment"
            ? "The Johnson's"
            : "My study group"
        }
        onKeyDown={(e: any) => {
          if (e.key == "Enter") e.target.blur();
        }}
        defaultValue={global.property.profile.name}
        onBlur={(event) => {
          updateSettings(
            "name",
            event.target.value as string,
            false,
            () => null,
            true
          );
        }}
        margin="dense"
      />
    </>,
    <>
      <Typography variant="h6" sx={{ mb: 1 }}>
        <span style={{ opacity: 0.6 }}>#5 </span>
        Let&apos;s create some boards
      </Typography>
      <Typography>
        Boards are sweet places where you can plan &amp; organize anything, from
        shopping lists, to lesson plans.
      </Typography>
      <Alert icon={<Icon>lightbulb</Icon>} severity="warning" sx={{ mt: 2 }}>
        You told us you were{" "}
        {bestDescription == "Adult" || bestDescription == "Educator"
          ? "an"
          : "a"}{" "}
        <u>
          <b>{bestDescription.toLocaleLowerCase()}</b>
        </u>
        . If you want to change this, scroll down and hit &quot;Back&quot;
      </Alert>

      {templates
        .filter((template) => template.for.includes(bestDescription))
        .map((template) => (
          <BoardTemplate template={template} key={template.name} />
        ))}
    </>,
    <>
      <Typography variant="h6" sx={{ mb: 1 }}>
        <span style={{ opacity: 0.6 }}>#6 </span>
        Add some items
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontWeight: 400,
          marginTop: 2,
          mb: 1.5,
        }}
      >
        Let&apos;s build up your inventory. Scroll down and click
        &quot;Next&quot; when you&apos;re done!
      </Typography>

      <InventoryList data={[...cards]} />
    </>,
    <>
      <Typography variant="h5">You&apos;re all set!</Typography>
      <Typography
        variant="body1"
        sx={{
          fontWeight: 400,
          marginTop: 2,
          mb: 1.5,
        }}
      >
        You can always come back to this page by clicking on the
        &quot;Onboarding&quot; button in the sidebar.
      </Typography>

      <Button
        variant="contained"
        size="large"
        sx={{
          width: "100%",
          borderRadius: 99999,
          mt: 2,
        }}
        onClick={() => {
          updateSettings(
            "onboardingComplete",
            "true",
            false,
            () => {
              router.push("/");
            },
            false
          );
        }}
      >
        Let&apos;s go &rarr;
      </Button>
    </>,
  ];
  const [step, setStep] = useState(0);
  useEffect(() => {
    const container: any = document.getElementById("onboardingContainer");
    container.scrollTo({ top: 0 });
  }, [step]);
  const session = useSession();

  return (
    <Box>
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          position: "absolute",
          zIndex: 1,
          top: 0,
          left: 0,
        }}
      >
        <Loading />
      </Box>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          backdropFilter: "blur(20px)",
        }}
      />
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2,
          maxHeight: "80vh",
          overflowY: "auto",
          maxWidth: "calc(100vw - 40px)",
          width: "500px",
          backgroundColor: session.user.darkMode ? "hsl(240,11%,10%)" : "#fff",
          boxShadow: "13px 13px 50px 0 rgba(0,0,0,0.1)",
          color: session.user.darkMode ? "white" : "hsl(240,11%,10%)",
          borderRadius: "10px",
          padding: { xs: "7px", sm: "20px" },
        }}
        id="onboardingContainer"
      >
        <Stepper
          sx={{
            p: 1,
            position: "sticky",
            backdropFilter: "blur(20px)",
            zIndex: 999,
            top: 0,
            borderRadius: 999,
            width: "100",
          }}
          activeStep={step}
          connector={<QontoConnector />}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={QontoStepIcon} />
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 2, p: 2 }}>
          {content.map((_, i) => (
            <StepContent
              key={i}
              forStep={i}
              currentStep={step}
              setCurrentStep={setStep}
              content={content[i]}
            />
          ))}
          {step !== 0 && step !== content.length - 1 && (
            <Button
              size="small"
              sx={{
                mt: 2,
                px: 1,
                py: 0,
              }}
              onClick={() => {
                setStep(step - 1);
              }}
            >
              &larr; Back
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}
