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
import LoadingButton from "@mui/lab/LoadingButton";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import emailjs from "@emailjs/browser";

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
  const [loading, setLoading] = React.useState<boolean>(false);
  const [role, setRole] = React.useState("member");

  const handleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value as string);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="contained"
        disabled={global.property.role !== "owner"}
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
              background:
                global.theme === "dark"
                  ? "hsl(240, 11%, 30%)"
                  : colors[themeColor][100],
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
          <LoadingButton
            loading={loading}
            onClick={() => {
              if (isEmail(value)) {
                fetch(
                  "/api/account/sync/invite?" +
                    new URLSearchParams({
                      propertyToken: global.property.id,
                      email: value,
                      houseName: global.property.houseName,
                      houseType: global.property.houseType,
                      role: role,
                    })
                )
                  .then((res) => res.json())
                  .then((res: any) => {
                    // if (res.data === true) {
                    emailjs
                      .send(
                        "service_bhq01y6",
                        "template_nbjdq1i",
                        {
                          to_email: value,
                          house_name:
                            global.session.property[
                              global.session.currentProperty
                            ].houseName,
                        },
                        "6Q4BZ_DN9bCSJFZYM"
                      )
                      .then(() => {
                        toast.success("Invitation sent!");
                        setLoading(false);
                      })
                      .catch((err) => alert(err));
                    // }
                  });
                setLoading(true);
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
          </LoadingButton>
        </Box>
      </SwipeableDrawer>
    </>
  );
}

function Member({ member }): any {
  const [deleted, setDeleted] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
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
      <Typography
        variant="body2"
        sx={{
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          color: member.accepted === "true" ? "green" : "red",
        }}
      >
        {member.accepted === "true" ? "Verified" : "Invitation pending"}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "flex",
          mt: 0.5,
          alignItems: "center",
          gap: "10px",
        }}
      >
        <span className="material-symbols-rounded">
          {member.role === "member"
            ? "group"
            : member.role == "owner"
            ? "productivity"
            : "visibility"}
        </span>
        <span style={{ marginTop: member.role === "owner" ? "-4px" : "" }}>
          {member.role == "member"
            ? "Read, write, and edit access"
            : member.role == "owner"
            ? "Owner"
            : "Read-only access"}
        </span>
      </Typography>
      <LoadingButton
        loading={loading}
        variant="outlined"
        disabled={global.property.role !== "owner" || member.role === "owner"}
        sx={{
          borderWidth: "2px!important",
          width: "100%",
          mt: 1.5,
          borderRadius: 4,
        }}
        onClick={() => {
          setLoading(true);
          fetch(
            "/api/account/sync/revokeToken?" +
              new URLSearchParams({
                id: member.id,
                email: member.email,
                accessToken: global.property.accessToken,
                propertyToken: global.property.id,
              }),
            {
              method: "POST",
            }
          ).then((res) => {
            toast.success("Removed person from your home");
            setLoading(false);
            setDeleted(true);
          });
        }}
      >
        Remove
      </LoadingButton>
    </>
  );
}

export function MemberList() {
  const url =
    "/api/account/sync/member-list?" +
    new URLSearchParams({
      propertyToken: global.property.id,
      accessToken: global.property.accessToken,
    });
  const { data, error } = useSWR(url, () =>
    fetch(url, {
      method: "POST",
    }).then((res) => res.json())
  );

  const images = data
    ? [
        ...data.data.map((member) => {
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
          mt: 1,
          "& *": {
            overscrollBehavior: "auto!important",
          },
          // "& [data-swipeable]": {
          //   width: "250px !important",
          // },
        }}
      >
        <SwipeableViews
          resistance
          style={{
            borderRadius: "20px",
            width: "100%",
            padding: "0 20px",
          }}
          slideStyle={{
            padding: "0 10px",
            paddingLeft: 0,
          }}
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
        >
          {images.map((step, index) => (
            <Box
              key={index.toString()}
              sx={{
                width: "100%",
              }}
            >
              <Box
                sx={{
                  p: 2,
                  width: "100%",
                  userSelect: "none",
                  px: 2.5,
                  borderRadius: 5,
                  background:
                    global.theme === "dark"
                      ? "hsl(240, 11%, 30%)"
                      : colors[themeColor][100],
                }}
              >
                {step.content}
              </Box>
            </Box>
          ))}
        </SwipeableViews>
      </Box>
    </>
  );
}
