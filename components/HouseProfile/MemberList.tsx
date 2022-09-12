import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import * as colors from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import useEmblaCarousel from "embla-carousel-react";
import * as React from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { AddPersonModal } from "./AddPersonModal";

function isEmail(email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

function Member({ member }): any {
  const [deleted, setDeleted] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  return deleted ? (
    <>This user no longer has access to your home</>
  ) : (
    <>
      <Box sx={{ width: "100%" }}>
        <Typography
          sx={{
            fontWeight: "600",
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {member.user.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {member.user.email}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            maxWidth: "100%",
            overflow: "hidden",
            mx: "auto",
            textOverflow: "ellipsis",
            display: "flex",
            mt: 0.5,
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span className="material-symbols-rounded">
            {member.permission === "member"
              ? "group"
              : member.permission == "owner"
              ? "productivity"
              : "visibility"}
          </span>
          <span
            style={{ marginTop: member.permission === "owner" ? "-4px" : "" }}
          >
            {member.permission == "member"
              ? "Read, write, and edit access"
              : member.permission == "owner"
              ? "Owner"
              : "Read-only access"}
          </span>
        </Typography>
        <LoadingButton
          loading={loading}
          variant="outlined"
          disabled={
            global.property.permission !== "owner" ||
            member.permission === "owner"
          }
          sx={{
            borderWidth: "2px!important",
            width: "100%",
            mt: 1.5,
            color: colors.red[900],
            "&:not(.MuiLoadingButton-loading, .Mui-disabled)": {
              borderColor: colors.red[900] + "!important",
            },
            borderRadius: 4,
          }}
          onClick={() => {
            if (
              confirm(
                "Remove member from your home? This person cannot join unless you invite them again."
              )
            ) {
              setLoading(true);
              fetch(
                "/api/property/members/remove?" +
                  new URLSearchParams({
                    id: member.id,
                    accessToken: global.property.accessToken,
                    property: global.property.propertyId,
                  }),
                {
                  method: "POST",
                }
              ).then((res: any) => {
                toast.success("Removed person from your home");
                setLoading(false);
                setDeleted(true);
              });
            }
          }}
        >
          Remove
        </LoadingButton>
      </Box>
    </>
  );
}

export function MemberList({ color }: any) {
  const url =
    "/api/property/members?" +
    new URLSearchParams({
      property: global.property.propertyId,
      accessToken: global.property.accessToken,
    });
  const { data, error } = useSWR(url, () =>
    fetch(url, {
      method: "POST",
    }).then((res) => res.json())
  );

  const images = data
    ? [
        ...data.map((member) => {
          return {
            content: <Member member={member} />,
          };
        }),
      ]
    : [];

  const [emblaRef, emblaApi]: any = useEmblaCarousel();
  React.useEffect(() => {
    emblaApi.reInit();
  }, [emblaApi]);
  return (
    <>
      <div style={{ width: "100%", display: "flex", marginTop: "-40px" }}>
        <AddPersonModal
          color={color}
          members={data ? data.map((member) => member.user.email) : []}
        />
      </div>
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {images.map((step, index) => (
            <Box
              key={index.toString()}
              className="embla__slide"
              sx={{ pl: index == 0 ? 0 : 2, flex: "0 0 90%" }}
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
                      : colors[color][100],
                }}
              >
                {step.content}
              </Box>
            </Box>
          ))}
        </div>
      </div>
    </>
  );
}
