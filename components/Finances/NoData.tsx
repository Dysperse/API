import React, { useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import { usePlaidLink } from "react-plaid-link";
import useFetch from "react-fetch-hook";
import router from "next/router";
function ConnectBankAccount() {
  const [completed, setCompleted] = useState(false);

  function LinkButton({ token }: any) {
    const { open, ready } = usePlaidLink({
      token: token,
      onSuccess: (public_token, metadata) => {
        // send public_token to server
        fetch(`/api/finance/exchangePublicToken?public_token=${public_token}`)
          .then((res) => res.json())
          .then((res) => {
            global.session.user.financeToken = res.access_token;
            // alert(res.access_token);
            fetch("https://api.smartlist.tech/v2/account/update/", {
              method: "POST",
              body: new URLSearchParams({
                token: global.session && global.session.accessToken,
                data: JSON.stringify({
                  financeToken: res.access_token
                })
              })
            })
              .then((res) => res.json())
              .then((res) => {
                setCompleted(true);
                fetch(
                  "/api/login/?" +
                    new URLSearchParams({
                      token: global.session && global.session.accessToken
                    })
                );
              });
          });
      }
    });
    return (
      <>
        <LoadingButton
          onClick={() => open()}
          loading={!ready}
          disabled={completed}
          variant="contained"
          size="large"
          sx={{
            background: "#212121",
            "&:hover": { background: "#202020" },
            "&:active, &:focus": { background: "#101010" },
            mt: 2,
            textTransform: "none",
            px: 4,
            mr: 1,
            borderRadius: 9,
            boxShadow: 0
          }}
        >
          Connect a bank account
        </LoadingButton>
      </>
    );
  }

  const { isLoading, data }: any = useFetch(
    "/api/finance/createLinkToken/?" +
      new URLSearchParams({
        access_token: global.session.user.financeToken
      })
  );
  return isLoading ? (
    <>
      <LoadingButton
        size="large"
        loading={true}
        sx={{
          background: "#eee",
          mt: 2,
          textTransform: "none",
          px: 4,
          mr: 1,
          borderRadius: 9,
          boxShadow: 0
        }}
      >
        Connect a bank account
      </LoadingButton>
    </>
  ) : (
    <LinkButton token={data.link_token} />
  );
}

const steps = [
  {
    label: "Let's get started",
    description: `You haven't connected your bank account with Smartlist. You'll need to connect your bank account for us to view your transactions and help you save money.`
  },
  {
    label: "Connect your bank account",
    description: (
      <>
        To let us help you save money and track your expenses, we'll need{" "}
        <b>read-only</b> access to your bank accounts. Connect your bank account
        to continue
        <br />
        <ConnectBankAccount />
      </>
    )
  },
  {
    label: "Set a goal",
    description: "Pick a goal which you want to set"
  },
  {
    label: "Configure notifications",
    caption: "Optional",
    description: `We'll let you know when you overspend.`
  }
];

export default function NoData() {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box
      sx={{
        maxWidth: {
          sm: "400px"
        },
        mt: 2
      }}
    >
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                step.caption ? (
                  <Typography variant="caption">{step.caption}</Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>
            <StepContent>
              <Typography>{step.description}</Typography>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleNext}
                    sx={{
                      mt: 2,
                      textTransform: "none",
                      px: 4,
                      mr: 1,
                      borderRadius: 9,
                      boxShadow: 0
                    }}
                  >
                    {index === steps.length - 1 ? "Finish" : "Continue"}
                  </Button>
                  <Button
                    size="large"
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{
                      mt: 2,
                      px: 3,
                      mr: 1,
                      textTransform: "none",
                      borderRadius: 9
                    }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography variant="h6">You're all set!</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Feel free to explore your finance dashboard, goals, and lessons.
            You'll be saving money in no time
          </Typography>
          <Button
            sx={{
              mt: 2,
              textTransform: "none",
              px: 4,
              mr: 1,
              borderRadius: 9,
              boxShadow: 0
            }}
            size="large"
            onClick={handleReset}
            variant="outlined"
          >
            Restart setup
          </Button>
          <Button
            size="large"
            onClick={() => router.push("/finances")}
            sx={{
              mt: 2,
              textTransform: "none",
              px: 4,
              mr: 1,
              borderRadius: 9,
              boxShadow: 0
            }}
            variant="contained"
          >
            Let's go!
          </Button>
        </Paper>
      )}
    </Box>
  );
}
