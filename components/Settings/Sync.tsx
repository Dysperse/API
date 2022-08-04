import LoadingButton from "@mui/lab/LoadingButton";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import * as React from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { updateSettings } from "./updateSettings";
const filter = createFilterOptions<EmailOptionType>();

interface EmailOptionType {
  inputValue?: string;
  title: string;
}

function Person({ data }: any) {
  const [hide, setHide] = React.useState(false);
  return hide ? null : (
    <Box
      key={data.id}
      sx={{
        background: "rgba(200,200,200,.3)",
        px: 3,
        py: 2,
        mt: 2,
        borderRadius: 5,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Tooltip
        title={
          data.accepted === "true"
            ? "Verified account"
            : "This person hasn't accepted the invitation yet"
        }
      >
        <span
          className="material-symbols-rounded"
          style={{
            marginRight: "10px",
            cursor: "help",
            color: data.accepted === "true" ? "#00c853" : "#d50000",
          }}
        >
          {data.accepted !== "true" ? "gpp_maybe" : "verified_user"}
        </span>
      </Tooltip>
      <span>{data.email}</span>
      <IconButton
        sx={{ ml: "auto" }}
        onClick={() => {
          setHide(true);
          fetch(
            "/api/account/sync/revokeToken?" +
              new URLSearchParams({
                email: data.email,
              }),
            {
              method: "POST",
            }
          ).then((res) => toast.success("Removed person from your home"));
        }}
      >
        <span className="material-symbols-rounded">delete</span>
      </IconButton>
    </Box>
  );
}

function isEmail(email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

function Leave() {
  const url =
    "/api/account/sync/invitations?" +
    new URLSearchParams({
      token: global.session && global.session.property.propertyToken,
      email: global.session && global.session.account.email,
    });
  const { data, error } = useSWR(url, () =>
    fetch(url, {
      method: "POST",
    }).then((res) => res.json())
  );

  const [loading, setLoading] = React.useState<boolean>(!data);
  return (
    <Box>
      <Box
        sx={{
          background: "rgba(200,200,200,.2)",
          borderRadius: 5,
          mt: 4,
          p: 5,
        }}
      >
        Only the owner can invite others to your home.
      </Box>
      <Box
        sx={{
          background: "rgba(200,200,200,.2)",
          borderRadius: 5,
          mt: 2,
          p: 5,
        }}
      >
        <LoadingButton
          loading={loading}
          onClick={() => {
            setLoading(true);
            Promise.all([
              fetch(
                "/api/account/sync/revokeInvitation?" +
                  new URLSearchParams({
                    token:
                      global.session && global.session.property.propertyToken,
                    email: global.session && global.session.account.email,
                    id: data.data.filter((v) => v.accepted == "true")[0].id,
                  }),
                {
                  method: "POST",
                }
              ),
              updateSettings("SyncToken", ""),
            ]).then(() => {
              window.location.reload();
            });
          }}
          variant="outlined"
          sx={{
            borderWidth: "2px!important",
            borderRadius: 3,
            transition: "none",
            "& .MuiTouchRipple-rippleVisible": {
              animationDuration: "0s!important",
            },
          }}
          size="large"
        >
          Leave &ldquo;
          {data && data.data.filter((v) => v.accepted == "true")[0].houseName}
          &rdquo;
        </LoadingButton>
        <Typography sx={{ mt: 2 }} variant="body2">
          Heads up! You won&apos;t be able to join this home unless you are
          re-invited. Your original inventory will be restored
        </Typography>
      </Box>
    </Box>
  );
}

const top100Emails: readonly EmailOptionType[] = [];

export default function Sync() {
  const url =
    "/api/account/sync/member-list?" +
    new URLSearchParams({
      token: global.session && global.session.property.propertyToken,
    });
  const { data, error } = useSWR(url, () =>
    fetch(url, {
      method: "POST",
    }).then((res) => res.json())
  );
  const [value, setValue] = React.useState<EmailOptionType | null>(null);

  return (
    <Box
      sx={{
        py: 1,
        px: { xs: 3, sm: 10 },
        mt: 5,
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: "700" }}>
        Add person
      </Typography>
      {global.session.account.SyncToken ? (
        <Leave />
      ) : (
        <Box>
          <Box sx={{ display: "flex", width: "100%" }}>
            <Autocomplete
              sx={{ width: "100%" }}
              value={value}
              onChange={(event, newValue) => {
                if (typeof newValue === "string") {
                  setValue({
                    title: newValue,
                  });
                } else if (newValue && newValue.inputValue) {
                  // Create a new value from the user input
                  setValue({
                    title: newValue.inputValue,
                  });
                } else {
                  setValue(newValue);
                }
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);

                const { inputValue } = params;
                // Suggest the creation of a new value
                const isExisting = options.some(
                  (option) => inputValue === option.title
                );
                if (inputValue !== "" && !isExisting) {
                  filtered.push({
                    inputValue,
                    title: `"${inputValue}"`,
                  });
                }

                return filtered;
              }}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              id="free-solo-with-text-demo"
              options={top100Emails}
              ListboxProps={{
                style: {
                  background: "rgba(200,200,200,.3)",
                  borderRadius: "20px",
                  marginTop: "10px",
                },
              }}
              getOptionLabel={(option) => {
                // Value selected with enter, right from the input
                if (typeof option === "string") {
                  return option;
                }
                // Add "xxx" option created dynamically
                if (option.inputValue) {
                  return option.inputValue;
                }
                // Regular option
                return option.title;
              }}
              renderOption={(props, option) => (
                <li {...props}>{option.title}</li>
              )}
              freeSolo
              renderInput={(params) => (
                <TextField
                  type="email"
                  {...params}
                  sx={{
                    "& *": {
                      borderRadius: 4,
                    },
                  }}
                  label="Enter an email"
                />
              )}
            />
            <Box sx={{ ml: "auto", pl: 1 }}>
              <Fab
                sx={{
                  boxShadow: 0,
                }}
                onClick={() => {
                  if (
                    !value ||
                    value.title === global.session.account.email ||
                    !isEmail(value.title)
                  )
                    alert("Please enter an email");
                  else {
                    fetch(
                      "/api/account/sync/createToken?" +
                        new URLSearchParams({
                          token: global.session.property.propertyToken,
                          email: value.title,
                          houseName: global.session.property.houseName,
                          houseType: global.session.property.houseType,
                        }),
                      {
                        method: "POST",
                      }
                    ).then(() => {
                      toast.success(
                        "If the email provided is valid, an invitation will be sent."
                      );
                      setValue(null);
                    });
                  }
                }}
              >
                <span className="material-symbols-rounded">add</span>
              </Fab>
            </Box>
          </Box>

          {error &&
            "An error occured while loading your members. Please try again"}
          {data && data.data && (
            <>
              {data.data.map((member: any) => (
                <Person data={member} key={member.email} />
              ))}
            </>
          )}
          {data && data.data && data.data.length === 0 && (
            <Box
              sx={{
                background: "rgba(200,200,200,.2)",
                textAlign: "center",
                borderRadius: 5,
                mt: 9,
                p: 5,
              }}
            >
              You haven&apos;t invited anyone to your home yet
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
