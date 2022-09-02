import useSWR from "swr";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useState } from "react";
import * as colors from "@mui/material/colors";
import toast from "react-hot-toast";
import { Budget } from "./Budget";

function CreateBudgetMenu({ transactions }: any) {
  let categories: string[] = [];
  transactions.forEach((transaction: any) => {
    categories = [...categories, ...transaction.category];
  });
  categories = [...new Set(categories)];
  const [open, setOpen] = useState<boolean>(false);
  const formik = useFormik({
    initialValues: {
      category: "Food and Drink",
      amount: "100",
      type: "daily",
    },
    onSubmit: async (values: {
      type: string;
      category: string;
      amount: any;
    }) => {
      await fetch(
        "/api/finance/budgets/create?" +
          new URLSearchParams({
            token: global.session.user.accessToken,
            type: values.type,
            category: values.category,
            amount: values.amount,
          }),
        {
          method: "POST",
        }
      );
      setOpen(false);
      toast.success("Created budget!");
      formik.resetForm();
    },
  });
  return (
    <>
      <IconButton
        edge="end"
        onClick={() => setOpen(true)}
        aria-label="next"
        sx={{
          borderRadius: 4,
          float: "right",
          mr: 2,
          "&, & *": { transition: "none!important" },
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
          justifyContent: "center",
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            background: colors[themeColor][50],
            width: {
              sm: "50vw",
            },
            maxWidth: "650px",
            maxHeight: "95vh",
            borderRadius: "30px 30px 0 0",
            mx: "auto",
            ...(global.theme === "dark" && {
              background: "hsl(240, 11%, 25%)",
            }),
          },
        }}
        onClose={() => setOpen(false)}
      >
        <Box sx={{ py: 6, px: 7 }}>
          <form onSubmit={formik.handleSubmit}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "600" }}>
              New budget
            </Typography>
            <FormControl
              fullWidth
              sx={{
                "& .MuiBackdrop-root ": { opacity: "0!important" },
              }}
            >
              <InputLabel id="demo-simple-select-label" sx={{ mt: 2 }}>
                What&apos;s this budget for?
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                variant="filled"
                value={formik.values.category}
                label="What's this budget for?"
                onChange={(e, v) =>
                  formik.setFieldValue("category", e.target.value)
                }
              >
                {categories.map((category: string, key: number) => (
                  <MenuItem value={category} key={key.toString()}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              sx={{
                mt: 2,
                "& .MuiBackdrop-root ": { opacity: "0!important" },
              }}
            >
              <InputLabel id="demo-simple-select-label" sx={{ mt: 2 }}>
                How long is this budget for?
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                variant="filled"
                value={formik.values.type}
                label="How long is this budget for?"
                onChange={(e, v) =>
                  formik.setFieldValue("type", e.target.value)
                }
              >
                {["Daily", "Weekly", "Monthly"].map(
                  (value: string, key: number) => (
                    <MenuItem value={value} key={key.toString()}>
                      {value}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>

            <TextField
              InputProps={{ required: true }}
              autoComplete={"off"}
              variant="filled"
              name="amount"
              label="What's your limit"
              margin="dense"
              type="number"
              autoFocus
              onChange={(e) => formik.setFieldValue("amount", e.target.value)}
              value={formik.values.amount}
              fullWidth
            />
            <Button
              variant="contained"
              type="submit"
              sx={{
                textTransform: "none",
                borderRadius: 9,
                mt: 3,
                boxShadow: 0,
                float: "right",
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

export function Budgets({ transactions }: { transactions: any }) {
  const url =
    "/api/finance/budgets?" +
    new URLSearchParams({
      token: global.session.user.accessToken,
    });
  const { data, error }: any = useSWR(url, () =>
    fetch(url, {
      method: "POST",
    })
  );

  const spentToday = transactions
    .filter(
      (transaction: any) => transaction.date == dayjs().format("YYYY-MM-DD")
    )
    .map((transaction: any) => transaction.amount)
    .reduce((a: any, b: any) => Math.abs(a) + Math.abs(b), 0);

  const spentMonth = transactions
    .filter(
      (transaction: any) =>
        dayjs(transaction.date).month() === new Date().getMonth() &&
        dayjs(transaction.date).year() === new Date().getFullYear()
    )
    .map((transaction: any) => transaction.amount)
    .reduce((a: any, b: any) => Math.abs(a) + Math.abs(b), 0);

  return (
    <>
      <Card
        sx={{
          background:
            global.theme === "dark"
              ? "hsl(240, 11%, 13%)"
              : "rgba(200, 200, 200, .3)",
          borderRadius: 5,
          boxShadow: 0,
          p: 1,
          mt: 2,
        }}
      >
        <Typography
          sx={{ fontWeight: "600", my: 2, ml: 2, mb: 0 }}
          variant="h5"
        >
          <CreateBudgetMenu transactions={transactions} />
          Budgets
        </Typography>
        <CardContent>
          <Typography
            sx={{ mt: -1, fontSize: "13px", textTransform: "uppercase" }}
          >
            By category
          </Typography>
          {error && (
            <>
              Yikes! An error occured while trying to fetch your budgets. Try
              reloading the page?
            </>
          )}
          {data && data.data ? (
            <>
              {data.data.map((budget: any, id: number) => (
                <Budget {...budget} key={id.toString()} />
              ))}
            </>
          ) : (
            "Loading..."
          )}
          {/* <Budget category="Food and Drink" amount="1000" type="monthly" />
          <Budget category="Sporting Goods" amount="500" type="monthly" /> */}

          <Typography
            sx={{ mt: 1, fontSize: "13px", textTransform: "uppercase" }}
          >
            Hard limits
          </Typography>
          <Budget
            hardLimit={true}
            category="Today"
            amount={global.session.user.budgetDaily}
            type="daily"
          />
          <Budget
            hardLimit={true}
            category="This week"
            amount={global.session.user.budgetWeekly}
            type="weekly"
          />
          <Budget
            hardLimit={true}
            category="This month"
            amountSpent={
              spentMonth > global.session.user.budgetMonthly
                ? global.session.user.budgetMonthly
                : spentMonth
            }
            amount={global.session.user.budgetMonthly}
            type="monthly"
          />
        </CardContent>
      </Card>
    </>
  );
}
