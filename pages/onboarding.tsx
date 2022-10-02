import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import { Loading } from "./_app";
import { useState } from "react";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { StepIconProps } from "@mui/material/StepIcon";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { TextField, Typography } from "@mui/material";
import { colors } from "../lib/colors";
import { Color } from "../components/onboarding/Color";
import FormControl from "@mui/material/FormControl";
import { useRouter } from "next/router";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { updateSettings } from "../components/Settings/updateSettings";
import { cards } from "../components/AddPopup/cards";
import { InventoryList } from "../components/onboarding/InventoryList";

function StepContent({ forStep, currentStep, setCurrentStep, content }) {
  return forStep === currentStep ? (
    <Box>
      {content}
      <Box
        sx={{
          display: currentStep == 1 || currentStep == 4 ? "none" : "flex",
          justifyContent: "flex-end",
          mt: 2,
        }}
      >
        <Button
          onClick={() => setCurrentStep(currentStep + 1)}
          variant="contained"
          disableElevation
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
    "Welcome to Carbon!",
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
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
        }}
      >
        Welcome to Carbon!
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontWeight: 400,
          marginTop: 2,
        }}
      >
        Thanks for choosing Carbon! We&apos;re excited to have you here.
        Let&apos;s get started by personalizing your theme and entering some
        basic information about your home.
      </Typography>
    </>,
    <>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
        }}
      >
        Choose your look and feel
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontWeight: 400,
          marginTop: 2,
          mb: 1.5,
        }}
      >
        What&apos;s your favorite color? We&apos;ll use this to customize your
        dashboard.
      </Typography>
      <Color
        handleNext={() => null}
        setThemeColor={setThemeColor}
        color="red"
      />
      <Color
        handleNext={() => null}
        setThemeColor={setThemeColor}
        color="green"
      />
      <Color
        handleNext={() => null}
        setThemeColor={setThemeColor}
        color="blue"
      />
      <Color
        handleNext={() => null}
        setThemeColor={setThemeColor}
        color="pink"
      />
      <Color
        handleNext={() => null}
        setThemeColor={setThemeColor}
        color="purple"
      />
      <Color
        handleNext={() => null}
        setThemeColor={setThemeColor}
        color="orange"
      />
      <Color
        handleNext={() => null}
        setThemeColor={setThemeColor}
        color="teal"
      />
      <Color
        handleNext={() => null}
        setThemeColor={setThemeColor}
        color="cyan"
      />
      <Color
        handleNext={() => null}
        setThemeColor={setThemeColor}
        color="brown"
      />

      <Typography variant="h6" sx={{ mt: 4 }}>
        Select a theme
      </Typography>
      <Color
        handleNext={() => setStep(step + 1)}
        setThemeColor={setThemeColor}
        color="grey"
      />
      <Color
        handleNext={() => setStep(step + 1)}
        setThemeColor={setThemeColor}
        color="white"
      />
    </>,
    <>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
        }}
      >
        Your home
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontWeight: 400,
          marginTop: 2,
          mb: 1.5,
        }}
      >
        Tell us a little bit about your home.
      </Typography>

      <TextField
        variant="filled"
        label="Your home's name/address"
        placeholder="The Johnson's"
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
        fullWidth
      />
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
          <MenuItem value="dorm">Dorm</MenuItem>
          <MenuItem value="apartment">Apartment</MenuItem>
          <MenuItem value="home">Home</MenuItem>
        </Select>
      </FormControl>
    </>,
    <>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
        }}
      >
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
        Let&apos;s build up your inventory.
      </Typography>

      <InventoryList data={[...cards]} />
    </>,
    <>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
        }}
      >
        You&apos;re all set!
      </Typography>
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
        disableElevation
      >
        Go to my dashboard
      </Button>
    </>,
  ];
  const [step, setStep] = useState(0);

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
          width: "100%",
          maxWidth: "700px",
          backgroundColor: global.user.darkMode ? "hsl(240,11%,10%)" : "white",
          color: global.user.darkMode ? "white" : "hsl(240,11%,10%)",
          borderRadius: "10px",
          padding: "20px",
        }}
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
              <StepLabel StepIconComponent={QontoStepIcon}></StepLabel>
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
        </Box>
      </Box>
    </Box>
  );
}
