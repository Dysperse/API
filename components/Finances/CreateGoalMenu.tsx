import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useFormik } from "formik";

function Image({
  src,
  setBannerDialogOpen,
  setBanner,
  setDisabled
}: any): JSX.Element {
  return (
    <Box
      onClick={() => {
        setDisabled(true);
        setBannerDialogOpen(false);
        setBanner(src);
      }}
      sx={{
        background: "url(" + src + ")",
        width: "100%",
        mt: 1,
        borderRadius: 5,
        cursor: "pointer",
        height: "150px",
        "&:hover": {
          background:
            "linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(" +
            src +
            ")",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat"
        },
        "&:active": {
          background:
            "linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(" +
            src +
            ")",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat"
        },
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat"
      }}
    ></Box>
  );
}

export function CreateGoalMenu({ account }: any): JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [bannerDialogOpen, setBannerDialogOpen] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);

  React.useEffect(() => {
    document
      .querySelector(`meta[name="theme-color"]`)!
      .setAttribute("content", open ? "#0f200b" : "#091f1e");
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      minAmountOfMoney: "",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
    },
    onSubmit: async (values: {
      name: string;
      minAmountOfMoney: string;
      image: string;
    }) => {
      await fetch("https://api.smartlist.tech/v2/finances/goals/create/", {
        method: "POST",
        body: new URLSearchParams({
          token: session && session.accessToken,
          name: values.name,
          minAmountOfMoney: values.minAmountOfMoney,
          image: values.image,
          accountId: account.account_id
        })
      });
      setOpen(false);
      setDisabled(false);
      setBannerDialogOpen(false);
      formik.resetForm();
    }
  });
  function setBanner(e: string) {
    formik.setFieldValue("image", e);
  }
  return (
    <>
      <Dialog
        open={bannerDialogOpen}
        onClose={() => setBannerDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 5,
            width: "500px",
            p: 2,
            maxWidth: "calc(100vw - 20px)"
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: "600" }}>Select a banner</DialogTitle>
        <DialogContent>
          <Typography gutterBottom sx={{ mb: 1 }}>
            Photos by Unsplash
          </Typography>
          <Image
            setBannerDialogOpen={setBannerDialogOpen}
            setBanner={setBanner}
            setDisabled={setDisabled}
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
          />
          <Image
            setBannerDialogOpen={setBannerDialogOpen}
            setBanner={setBanner}
            setDisabled={setDisabled}
            src="https://images.unsplash.com/photo-1525921429624-479b6a26d84d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
          />
          <Image
            setBannerDialogOpen={setBannerDialogOpen}
            setBanner={setBanner}
            setDisabled={setDisabled}
            src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
          />
          <Image
            setBannerDialogOpen={setBannerDialogOpen}
            setBanner={setBanner}
            setDisabled={setDisabled}
            src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
          />
          <Image
            setBannerDialogOpen={setBannerDialogOpen}
            setBanner={setBanner}
            src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=873&q=80"
          />
          <Image
            setBannerDialogOpen={setBannerDialogOpen}
            setBanner={setBanner}
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
          />
          <Image
            setBannerDialogOpen={setBannerDialogOpen}
            setBanner={setBanner}
            setDisabled={setDisabled}
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
          />
          <Image
            setBannerDialogOpen={setBannerDialogOpen}
            setBanner={setBanner}
            setDisabled={setDisabled}
            src="https://images.unsplash.com/photo-1501183638710-841dd1904471?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
          />
          <Image
            setBannerDialogOpen={setBannerDialogOpen}
            setBanner={setBanner}
            setDisabled={setDisabled}
            src="https://images.unsplash.com/photo-1605289982774-9a6fef564df8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=464&q=80"
          />
          <Image
            setBannerDialogOpen={setBannerDialogOpen}
            setBanner={setBanner}
            setDisabled={setDisabled}
            src="https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
          />
          <Image
            setBannerDialogOpen={setBannerDialogOpen}
            setBanner={setBanner}
            setDisabled={setDisabled}
            src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
          />
          <Image
            setBannerDialogOpen={setBannerDialogOpen}
            setBanner={setBanner}
            setDisabled={setDisabled}
            src="https://images.unsplash.com/photo-1494947665470-20322015e3a8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
          />
          <Image
            setBannerDialogOpen={setBannerDialogOpen}
            setBanner={setBanner}
            setDisabled={setDisabled}
            src="https://images.unsplash.com/photo-1494905998402-395d579af36f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
          />
          <Image
            setBannerDialogOpen={setBannerDialogOpen}
            setBanner={setBanner}
            setDisabled={setDisabled}
            src="https://images.unsplash.com/photo-1449844908441-8829872d2607?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
          />
        </DialogContent>
      </Dialog>
      <IconButton
        size="large"
        disableRipple
        onClick={() => setOpen(true)}
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{
          mr: -1,
          "&:hover": { background: "rgba(255,255,255,.1)" },
          transition: "none"
        }}
      >
        <span className="material-symbols-rounded">add</span>
      </IconButton>

      <SwipeableDrawer
        anchor="bottom"
        swipeAreaWidth={0}
        onOpen={() => setOpen(true)}
        open={open}
        sx={{
          display: "flex",
          alignItems: { xs: "end", sm: "center" },
          height: "100vh",
          justifyContent: "center"
        }}
        PaperProps={{
          sx: {
            borderRadius: "28px",
            borderBottomLeftRadius: { xs: 0, sm: "28px!important" },
            borderBottomRightRadius: { xs: 0, sm: "28px!important" },
            position: "unset",
            mx: "auto",
            maxWidth: { sm: "70vw", xs: "100vw" },
            overflow: "hidden"
          }
        }}
        onClose={() => setOpen(false)}
      >
        <Box sx={{ py: 6, px: 7 }}>
          <form onSubmit={formik.handleSubmit}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "600" }}>
              Create goal
            </Typography>
            <TextField
              InputProps={{ required: true }}
              autoComplete={"off"}
              variant="filled"
              name="name"
              label="What's your goal?"
              margin="dense"
              autoFocus
              onChange={formik.handleChange}
              value={formik.values.name}
              fullWidth
            />
            <TextField
              autoComplete={"off"}
              variant="filled"
              name="minAmountOfMoney"
              label="How much money does this goal require?"
              margin="dense"
              onChange={formik.handleChange}
              value={formik.values.minAmountOfMoney}
              fullWidth
              InputProps={{ required: true }}
              type="number"
            />
            <TextField
              required
              variant="filled"
              label="Banner image"
              sx={{ display: "none" }}
              autoComplete={"off"}
              margin="dense"
              fullWidth
              onChange={formik.handleChange}
              value={formik.values.image}
              InputProps={{ readOnly: true }}
            />
            <LoadingButton
              variant="contained"
              type="button"
              onClick={() => setBannerDialogOpen(true)}
              disabled={disabled}
              sx={{
                textTransform: "none",
                borderRadius: 3,
                width: "100%",
                p: 1,
                mt: 1,
                background: "rgba(200,200,200,.3)",
                "&:hover": {
                  background: "rgba(200,200,200,.4)"
                },
                color: global.theme === "dark" ? "#fff" : "#000",
                boxShadow: 0
              }}
              size="large"
            >
              {disabled ? (
                <Box
                  sx={{
                    background: "url(" + formik.values.image + ")",
                    width: "100%",
                    borderRadius: 3,
                    cursor: "pointer",
                    height: "150px",
                    "&:hover": {
                      background:
                        "linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(" +
                        formik.values.image +
                        ")",
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat"
                    },
                    "&:active": {
                      background:
                        "linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(" +
                        formik.values.image +
                        ")",
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat"
                    },
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat"
                  }}
                ></Box>
              ) : (
                "Select a banner"
              )}
            </LoadingButton>
            <Button
              variant="contained"
              type="submit"
              sx={{
                textTransform: "none",
                borderRadius: 9,
                mt: 3,
                boxShadow: 0,
                float: "right"
              }}
              size="large"
            >
              Create
            </Button>
          </form>
        </Box>
      </SwipeableDrawer>
    </>
  );
}
