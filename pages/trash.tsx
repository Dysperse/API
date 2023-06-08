import { ConfirmationModal } from "@/components/ConfirmationModal";
import { ErrorHandler } from "@/components/Error";
import { fetchRawApi, useApi } from "@/lib/client/useApi";
import { useSession } from "@/lib/client/useSession";
import { toastStyles } from "@/lib/client/useTheme";
import { Masonry } from "@mui/lab";
import { Box, Button, CircularProgress, Icon, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import Categories from "./items";

function DeleteCard({ item }) {
  const [hidden, setHidden] = useState<boolean>(false);
  const session = useSession();

  const handleDelete = () => {
    setHidden(true);
    fetchRawApi("property/inventory/trash/item", {
      id: item.id,
      forever: true,
    }).catch(() => {
      toast.error(
        "An error occured while trying to delete this item. Please try again later",
        toastStyles
      );
      setHidden(false);
    });
  };

  return hidden ? null : (
    <Box
      key={item.id}
      sx={{
        p: 2,
        borderRadius: 5,
        background: `hsl(240,11%,${session.user.darkMode ? 15 : 95}%)`,
      }}
    >
      <Typography variant="h6">{item.name}</Typography>
      <Typography variant="body2">
        {item.quantity || "(no quantity specified)"}
      </Typography>
      <Button
        color="warning"
        fullWidth
        variant="outlined"
        sx={{
          borderRadius: 99,
          mt: 2,
        }}
        disabled={session.permission === "read-only"}
      >
        Restore
      </Button>
      <Button
        color="error"
        fullWidth
        variant="contained"
        disabled={session.permission === "read-only"}
        onClick={handleDelete}
        sx={{
          ...(session.permission !== "read-only" && {
            "&,&:hover": {
              background: `${red["900"]}!important`,
              color: `${red["50"]}!important`,
            },
          }),
          borderRadius: 99,
          mt: 1,
        }}
      >
        Delete
      </Button>
    </Box>
  );
}

export default function Trash() {
  const { data, url, error } = useApi("property/inventory/trash");
  const router = useRouter();
  const session = useSession();

  return (
    <Categories>
      {data?.length === 0 && (
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            width: "500px",
            mx: "auto",
            textAlign: "center",
            maxWidth: "100vw",
          }}
        >
          <Image
            src="/images/noStarredItems.png"
            alt="No deleted items"
            width={256}
            height={171}
            style={{
              ...(session.user.darkMode && { filter: "invert(1)" }),
            }}
          />
          <Typography variant="h6" gutterBottom>
            Nothing in your trash
          </Typography>
          <Typography>Deleted items will appear here</Typography>
        </Box>
      )}
      {data && data.length > 0 && (
        <Box sx={{ p: 5 }}>
          <Button
            onClick={() => router.push("/items")}
            size="small"
            variant="contained"
            sx={{ display: { sm: "none" }, mb: 2 }}
          >
            <Icon>west</Icon>
            Back to items
          </Button>
          <Typography variant="h5">Trash</Typography>
          <Typography variant="body2">
            {data ? data.length : 0} items
          </Typography>
          <ConfirmationModal
            title="Empty Trash?"
            question="Are you sure you want to empty your trash? This action cannot be undone."
            callback={async () => {
              await fetchRawApi("property/inventory/trash/clear")
                .catch(() => {
                  toast.error(
                    "An error occured while trying to empty your trash. Please try again later",
                    toastStyles
                  );
                })
                .then(() => {
                  mutate(url);
                });
            }}
          >
            <Button
              variant="contained"
              disabled={
                !data ||
                (data || []).length === 0 ||
                session.permission === "read-only"
              }
              sx={{
                ...(session.permission !== "read-only" && {
                  "&,&:hover": {
                    background: `${red["900"]}!important`,
                    color: `${red["50"]}!important`,
                  },
                }),
                borderRadius: 99,
                mt: 1,
                mb: 3,
              }}
            >
              Empty Trash
            </Button>
          </ConfirmationModal>
          {error && (
            <ErrorHandler
              callback={() => mutate(url)}
              error={
                "Yikes! An error occured while trying to fetch your trash. Please try again later"
              }
            />
          )}
          {data ? (
            <Masonry columns={3}>
              {data.map((item: any) => (
                <DeleteCard item={item} key={item.id} />
              ))}
            </Masonry>
          ) : (
            <CircularProgress />
          )}
        </Box>
      )}
    </Categories>
  );
}
