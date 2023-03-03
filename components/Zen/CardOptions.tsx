import { Icon, IconButton } from "@mui/material";
import { memo } from "react";
import { useSession } from "../../pages/_app";
import { updateSettings } from "../Settings/updateSettings";

export const CardOptions = memo(function CardOptions({
  option,
  items,
  setItems,
}: any) {
  const handleDelete = () => {
    setItems((items) => {
      const newArray = items.filter((item) => item !== option);
      updateSettings("zenCardOrder", JSON.stringify(newArray));
      return newArray;
    });
  };
  const session = useSession();

  return (
    <IconButton
      size="large"
      onClick={handleDelete}
      sx={{
        mb: 1.5,
        background: session?.user?.darkMode
          ? "hsla(240,11%,60%,.1)!important"
          : "rgba(200,200,200,.3)!important",
        "&:hover": {
          background: session?.user?.darkMode
            ? "hsla(240,11%,90%,.1)!important"
            : "rgba(200,200,200,.5)!important",
        },
        borderRadius: 3,
        borderTopLeftRadius: "0px!important",
        borderBottomLeftRadius: "0px!important",
      }}
    >
      <Icon className="outlined">delete</Icon>
    </IconButton>
  );
});
