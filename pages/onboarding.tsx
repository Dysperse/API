import { SelectChangeEvent } from "@mui/material/Select";
import { stepConnectorClasses } from "@mui/material/StepConnector";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Loading } from "../components/Layout/Loading";
import { Color } from "../components/Onboarding/Color";
import { InventoryList } from "../components/Onboarding/InventoryList";
import { cards } from "../components/Rooms/CreateItem/cards";
import { updateSettings } from "../components/Settings/updateSettings";
import { colors } from "../lib/colors";

import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
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

function StepContent({ forStep, currentStep, setCurrentStep, content }) {
  return forStep === currentStep ? (
    <Box>
      {content}
      <Box
        sx={{
          display: currentStep === 1 || currentStep === 4 ? "none" : "flex",
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
      <Typography variant="h5">Your group</Typography>
      <Typography
        variant="body1"
        sx={{
          fontWeight: 400,
          marginTop: 2,
          mb: 1.5,
        }}
      >
        Tell us a little bit about your {type}.
      </Typography>
      <FormControl fullWidth margin="dense">
        <InputLabel id="demo-simple-select-label" sx={{ mt: 2 }}>
          Type
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
      <Typography variant="h5">Add some items</Typography>
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
        You&apos;re all set! You can always come back to this page by clicking
        on the &quot;Onboarding&quot; button in the sidebar.
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
        Let&apos;go!
      </Button>
    </>,
  ];
  const [step, setStep] = useState(0);
  useEffect(() => {
    const container: any = document.getElementById("onboardingContainer");
    container.scrollTo({ top: 0 });
  }, [step]);
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
          backgroundColor: global.user.darkMode ? "hsl(240,11%,10%)" : "#fff",
          boxShadow: "13px 13px 50px 0 rgba(0,0,0,0.1)",
          color: global.user.darkMode ? "white" : "hsl(240,11%,10%)",
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
              key={Math.random()}
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
