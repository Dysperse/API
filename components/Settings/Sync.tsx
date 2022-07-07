import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
const filter = createFilterOptions<EmailOptionType>();

interface EmailOptionType {
  inputValue?: string;
  title: string;
}

function isEmail(email) {
  return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(
    email
  );
}

const top100Emails: readonly EmailOptionType[] = [];

export default function Developer() {
  const url = "https://api.smartlist.tech/v2/account/sync/tokens/";
  const { data, error } = useSWR(url, () =>
    fetch(url, {
      method: "POST",
      body: new URLSearchParams({
        token: global.session && global.session.accessToken,
      }),
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
        Invite people to your home
      </Typography>
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
          renderOption={(props, option) => <li {...props}>{option.title}</li>}
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
            onClick={() => {
              if (
                !value ||
                value.title === global.session.user.email ||
                !isEmail(value.title)
              )
                alert("Please enter an email");
              else {
                fetch(
                  "https://api.smartlist.tech/v2/account/sync/create-token/",
                  {
                    method: "POST",
                    body: new URLSearchParams({
                      token: global.session.accessToken,
                      email: value.title,
                    }),
                  }
                ).then(() => {
                  toast.success("Invitation sent!");
                  setValue(null);
                });
              }
            }}
          >
            <span className="material-symbols-rounded">add</span>
          </Fab>
        </Box>
      </Box>

      {error && "An error occured while loading your members. Please try again"}
      {data && data.data && (
        <>
          {data.data.map((member: any) => (
            <Box
              key={member.id}
              sx={{
                background: "rgba(200,200,200,.3)",
                px: 3,
                py: 2,
                mt: 2,
                borderRadius: 5,
              }}
            >
              {member.email}
            </Box>
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
          You haven't invited anyone to your home yet
        </Box>
      )}
    </Box>
  );
}
