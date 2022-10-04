import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { colors } from "../../lib/colors";

import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { StepIconProps } from "@mui/material/StepIcon";

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: `${colors[themeColor][50]}`,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: `${colors[themeColor][50]}`,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor:
      theme.palette.mode === "dark"
        ? theme.palette.grey[800]
        : `${colors[themeColor][700]}`,
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled("div")<{ ownerState: { active?: boolean } }>(
  ({ theme, ownerState }) => ({
    color:
      theme.palette.mode === "dark"
        ? theme.palette.grey[700]
        : `${colors[themeColor][300]}`,
    display: "flex",
    height: 22,
    alignItems: "center",
    ...(ownerState.active && {
      color: `${colors[themeColor][50]}`,
    }),
    "& .QontoStepIcon-completedIcon": {
      color: `${colors[themeColor][50]}`,
      zIndex: 1,
      fontSize: 18,
    },
    "& .QontoStepIcon-circle": {
      width: 8,
      height: 8,
      borderRadius: "50%",
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
            color: `${colors[themeColor][50]}`,
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

const steps = ["Declutter", "Discard", "Organize"];

/**
 * Bannner for maintenance, which shows upcoming tasks the current week
 * @param {any} {count}
 * @returns {JSX.Element}
 */
export function Header({
  step,
  setStep,
}: {
  step: number;
  setStep: (step: number) => void;
}): JSX.Element {
  return (
    <>
      <Box sx={{ p: { sm: 3 }, pt: { sm: 1 } }}>
        <Box
          sx={{
            width: "100%",
            background: colors[themeColor][800],
            color: `${colors[themeColor][100]}`,
            borderRadius: { sm: 5 },
            pb: 3,
            display: "block",
            pt: 2,
            py: { sm: 3 },
          }}
        >
          {/* <Typography sx={{ fontWeight: "600" }}>Tidy</Typography> */}
          <Stepper
            alternativeLabel
            activeStep={step}
            connector={<QontoConnector />}
          >
            {steps.map((label) => (
              <Step key={label} sx={{}}>
                <StepLabel StepIconComponent={QontoStepIcon}>
                  <span
                    style={{
                      // if step is completed, make text green
                      color:
                        step > steps.indexOf(label)
                          ? colors[themeColor][50]
                          : colors[themeColor][100],
                      fontWeight:
                        step === steps.indexOf(label) ? "bold" : "400",
                    }}
                  >
                    {label}
                  </span>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        <Button onClick={() => setStep(step - 1)}>Back</Button>
        <Button onClick={() => setStep(step + 1)}>Next</Button>
      </Box>
    </>
  );
}
