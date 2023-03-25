import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Icon,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Step,
  StepConnector,
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
import { BoardTemplate } from "../components/Onboarding/BoardTemplate";
import { Color } from "../components/Onboarding/Color";
import { InventoryList } from "../components/Onboarding/InventoryList";
import { StepIcon } from "../components/Onboarding/StepIcon";
import { cards } from "../components/Rooms/CreateItem/cards";
import { updateSettings } from "../components/Settings/updateSettings";
import { fetchRawApi } from "../lib/client/useApi";
import { colors } from "../lib/colors";
import { useSession } from "./_app";

export default function Onboarding() {
  const router = useRouter();
  const steps = [
    "Welcome to Dysperse!",
    "Customize your theme",
    "Edit your home",
    "Add some items",
    "You're all set!",
  ];
  const session = useSession();

  const [type, setType] = useState(
    session.property.profile.type || "apartment"
  );
  const [submitLoading, setSubmitLoading] = useState(false);
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

  const styles = {
    title: {
      fontSize: { xs: 50, sm: 30 },
      mt: { xs: 5, sm: 0 },
      mb: 2,
    },
  };

  const content = [
    <>
      <Typography variant="h3" className="font-heading" sx={styles.title}>
        Welcome to Dysperse!
      </Typography>
      <Typography variant="body1">
        We&apos;re excited to have you here. Let&apos;s get started by
        customizing your group and dashboard! ✨
      </Typography>
    </>,
    <>
      <Typography variant="h5" sx={styles.title} className="font-heading">
        Choose your look &amp; feel
      </Typography>
      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
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

      <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
        <span style={{ opacity: 0.6 }}>#2 </span>
        Night or Day?
      </Typography>
      <Color handleNext={() => setStep(step + 1)} color="grey" />
      <Color handleNext={() => setStep(step + 1)} color="white" />
    </>,
    <>
      <Typography variant="h5" sx={styles.title} className="font-heading">
        About you
      </Typography>
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
        Tell us a bit about your <i>group</i>.
      </Typography>
      <FormControl fullWidth margin="dense">
        <InputLabel id="demo-simple-select-label" sx={{ mt: 2 }}>
          Group type
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={type}
          variant="filled"
          onChange={handleChange}
        >
          <MenuItem value="study group">Study group</MenuItem>
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
        defaultValue={session.property.profile.name}
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
      <Alert icon={<Icon>lightbulb</Icon>} severity="warning" sx={{ mt: 2 }}>
        Once you&apos;re done, you&apos;ll be able to invite up to five members
        to your group.
      </Alert>
    </>,
    <>
      <Typography variant="h5" sx={styles.title} className="font-heading">
        Boards
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
      <Typography variant="h5" sx={styles.title} className="font-heading">
        Items
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 400, mt: 2, mb: 1.5 }}>
        Let&apos;s build up your inventory. Once you&apos;re done, you can
        quickly build up your inventory by scanning items on with your
        phone&apos;s camera
      </Typography>
      <InventoryList data={[...cards]} />
    </>,
    <>
      <Typography variant="h5" sx={styles.title} className="font-heading">
        You&apos;re all set!
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontWeight: 400,
          mb: 1.5,
        }}
      >
        You can always come back to this page by clicking on the
        &quot;Onboarding&quot; button in the sidebar.
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "end", gap: 2 }}>
        <Button
          variant="outlined"
          size="large"
          sx={{
            borderRadius: 99999,
            mt: 2,
            px: 3,
          }}
          onClick={() => setStep((s) => s - 1)}
        >
          Back
        </Button>
        <LoadingButton
          loading={submitLoading}
          variant="contained"
          size="large"
          sx={{
            borderRadius: 99999,
            mt: 2,
            px: 3,
          }}
          onClick={() => {
            setSubmitLoading(true);
            updateSettings(
              "onboardingComplete",
              "true",
              false,
              async () => {
                await fetchRawApi("purge");
                router.push("/");
              },
              false
            );
          }}
        >
          Let&apos;s go <Icon>east</Icon>
        </LoadingButton>
      </Box>
    </>,
  ];
  const [step, setStep] = useState(0);
  useEffect(() => {
    const container: any = document.getElementById("onboardingContainer");
    container.scrollTo({ top: 0 });
  }, [step]);

  function StepContent({
    forStep,
    currentStep,
    setCurrentStep,
    content,
    contentLength,
  }) {
    return forStep === currentStep ? (
      <Box sx={{ pb: 10 }}>
        {content}
        <Box
          sx={{
            justifyContent: "flex-end",
            mt: 2,
            position: { xs: "fixed", sm: "unset" },
            zIndex: 99999,
            bottom: 0,
            left: 0,
            width: { xs: "100%" },
            backdropFilter: "blur(10px)",
            p: { xs: 2, sm: 0 },
            display: "flex",
            ...(currentStep + 1 === contentLength && {
              display: "none",
            }),
            alignItems: "center",
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            size="large"
            sx={{
              display: currentStep === 0 ? "none" : "inline-flex",
              borderRadius: 9999,
              px: 2,
              minWidth: "auto",
            }}
            onClick={() => {
              setStep(currentStep - 1);
            }}
          >
            <Icon>west</Icon>
          </Button>
          <Button
            onClick={() => setCurrentStep(currentStep + 1)}
            variant="contained"
            size="large"
            sx={{
              borderRadius: 9999,
              px: 3,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Continue
            <Icon sx={{ ml: "auto" }}>east</Icon>
          </Button>
        </Box>
      </Box>
    ) : null;
  }

  const Connector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 10,
      left: "calc(-50% + 16px)",
      right: "calc(50% + 16px)",
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: colors[session.themeColor || "brown"][500],
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: colors[session.themeColor || "brown"][500],
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      borderColor:
        theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
      borderTopWidth: 3,
      borderRadius: 1,
    },
  }));

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
          width: "100vw",
          height: "100vh",
          zIndex: 1,
          backdropFilter: "blur(20px)",
        }}
      />
      <Box
        sx={{
          position: "fixed",
          top: { xs: 0, sm: "50%" },
          left: { xs: 0, sm: "50%" },
          transform: { xs: 0, sm: "translate(-50%, -50%)" },
          zIndex: 2,
          maxHeight: { xs: "100vh", sm: "80vh" },
          height: { xs: "100vh", sm: "auto" },
          overflowY: "auto",
          maxWidth: { xs: "100vw", sm: "calc(100vw - 40px)" },
          width: { xs: "100vw", sm: "500px" },
          backgroundColor: `hsl(240,11%,${session.user.darkMode ? 10 : 100}%)`,
          boxShadow: "13px 13px 50px 0 rgba(0,0,0,0.1)",
          color: `hsl(240,11%,${session.user.darkMode ? 100 : 10}%)`,
          borderRadius: { xs: 0, sm: "20px" },
          padding: { xs: "7px", sm: "28px" },
          pt: { xs: 0, sm: "25px" },
        }}
        id="onboardingContainer"
      >
        <Stepper
          sx={{
            p: 1,
            mt: 2,
            position: "sticky",
            backdropFilter: "blur(20px)",
            zIndex: 999,
            top: "20px",
            borderRadius: 999,
            width: "100%",
          }}
          activeStep={step}
          connector={<Connector />}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={StepIcon} />
            </Step>
          ))}
        </Stepper>
        <Box sx={{ p: 2, px: 3 }}>
          {content.map((_, i) => (
            <StepContent
              contentLength={content.length}
              key={i}
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
