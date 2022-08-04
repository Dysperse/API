import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import * as colors from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import * as React from "react";
import SwipeableViews from "react-swipeable-views";
import { ProfileMenu } from "../Layout/Profile";
import useSWR from "swr";
import toast from "react-hot-toast";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import { Puller } from "../Puller";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

function isEmail(email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

function AddPersonModal() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [role, setRole] = React.useState("member");

  const handleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value as string);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="contained"
        disabled={global.session.property.role !== "owner"}
        sx={{
          mb: 2,
          borderRadius: 4,
          ml: "auto",
          boxShadow: 0,
        }}
      >
        <span
          className="material-symbols-rounded"
          style={{ marginRight: "10px" }}
        >
          add
        </span>
        Add person
      </Button>
      <SwipeableDrawer
        open={open}
        onOpen={() => setOpen(true)}
        PaperProps={{
          elevation: 0,
          sx: {
            background: colors[themeColor][50],
            width: {
              sm: "50vw",
            },
            maxWidth: "650px",
            overflow: "scroll",
            maxHeight: "95vh",
            borderRadius: "30px 30px 0 0",
            mx: "auto",
            ...(global.theme === "dark" && {
              background: "hsl(240, 11%, 25%)",
            }),
          },
        }}
        onClose={() => setOpen(false)}
        anchor="bottom"
        swipeAreaWidth={0}
      >
        <Puller />
        <Box sx={{ p: 4 }}>
          <Typography variant="h5">Invite a person</Typography>
          <Box
            sx={{
              fontSize: "15px",
              my: 4,
              background: colors[themeColor][100],
              borderRadius: 5,
              display: "block",
              p: 2,
              userSelect: "none",
              textAlign: "center",
            }}
          >
            <span
              className="material-symbols-rounded"
              style={{
                display: "block",
                marginBottom: "10px",
              }}
            >
              warning
            </span>
            Make sure you trust who you are inviting. Anyone with access can
            view your finances, lists, rooms, and inventory
          </Box>
          <TextField
            value={value}
            onChange={(e) => setValue(e.target.value)}
            variant="filled"
            autoComplete="off"
            label="Enter an email address"
            fullWidth
          />
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={role}
              variant="filled"
              sx={{ mt: 2, pt: 0, pb: 1, mb: 2, height: "90px" }}
              label="Permissions"
              onChange={handleChange}
            >
              <MenuItem value={"read-only"}>
                <Box sx={{ my: 1 }}>
                  <Typography variant="h6">Read only</Typography>
                  <Typography variant="body2">
                    View access to your inventory, rooms, and lists
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value={"member"}>
                <Box sx={{ my: 1 }}>
                  <Typography variant="h6">Member</Typography>
                  <Typography variant="body2">
                    Can view and edit your inventory, rooms, lists, etc
                  </Typography>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
          <Button
            onClick={() => {
              if (isEmail(value)) {
                fetch(
                  "/api/account/sync/invite?" +
                    new URLSearchParams({
                      accessToken: global.session.property.propertyToken,
                      email: value,
                      houseName: global.session.property.houseName,
                      houseType: global.session.property.houseType,
                      role: "member",
                    })
                );
                toast.success("Invitation sent!");
              } else {
                toast.error("Please enter a valid email address");
              }
            }}
            variant="outlined"
            size="large"
            sx={{
              borderWidth: "2px!important",
              borderRadius: 4,
              transition: "none!important",
              mt: 1,
              float: "right",
            }}
          >
            Send invitation
          </Button>
        </Box>
      </SwipeableDrawer>
    </>
  );
}

function Member({ member }): any {
  const [deleted, setDeleted] = React.useState<boolean>(false);

  return deleted ? (
    <>This user no longer has access to your home</>
  ) : (
    <>
      <Typography
        sx={{
          fontWeight: "600",
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {member.name}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {member.email}
      </Typography>
      <Button
        variant="outlined"
        disabled={global.session.property.role !== "owner"}
        sx={{
          borderWidth: "2px!important",
          width: "100%",
          mt: 1.5,
          borderRadius: 4,
        }}
        onClick={() => {
          fetch(
            "/api/account/sync/revokeToken?" +
              new URLSearchParams({
                email: member.email,
                accessToken: global.session.property.accessToken,
                propertyToken: global.session.property.propertyToken,
              }),
            {
              method: "POST",
            }
          ).then((res) => toast.success("Removed person from your home"));
        }}
      >
        Remove
      </Button>
    </>
  );
}

export function MemberList() {
  const url =
    "/api/account/sync/member-list?" +
    new URLSearchParams({
      propertyToken: global.session.property.propertyToken,
      accessToken: global.session.property.accessToken,
    });
  const { data, error } = useSWR(url, () =>
    fetch(url, {
      method: "POST",
    }).then((res) => res.json())
  );

  const images = data
    ? [
        {
          content: (
            <>
              <Typography
                sx={{
                  fontWeight: "600",
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {global.session.account.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {global.session.account.email}
              </Typography>
              <ProfileMenu>
                <Button
                  variant="contained"
                  sx={{
                    border: "2px solid transparent !important",
                    boxShadow: 0,
                    borderRadius: 4,
                    width: "100%",
                    mt: 1.5,
                  }}
                >
                  Account&nbsp;settings
                </Button>
              </ProfileMenu>
            </>
          ),
        },
        ...data.data
          .filter((e: any) => e.email !== global.session.account.email)
          .map((member) => {
            return {
              content: <Member member={member} />,
            };
          }),
      ]
    : [];

  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = images.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  return (
    <>
      <div style={{ width: "100%", display: "flex", marginTop: "-40px" }}>
        <AddPersonModal />
      </div>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          "& *": {
            overscrollBehavior: "auto!important",
          },
          // "& [data-swipeable]": {
          //   width: "250px !important",
          // },
        }}
      >
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
        >
          {images.map((step, index) => (
            <Box key={index.toString()} sx={{ p: 1 }}>
              <Box
                sx={{
                  p: 2,
                  userSelect: "none",
                  px: 2.5,
                  borderRadius: 5,
                  background: colors[themeColor][100],
                }}
              >
                {step.content}
              </Box>
            </Box>
          ))}
        </SwipeableViews>

        <Box>
          <IconButton
            disabled={activeStep === maxSteps - 1}
            onClick={handleNext}
            sx={{
              color: colors[themeColor][900],
              background: colors[themeColor][200] + "!important",
              backdropFilter: "blur(10px)",
              zIndex: 99,
            }}
          >
            <span className="material-symbols-rounded">chevron_right</span>
          </IconButton>
        </Box>
      </Box>
    </>
  );
}
