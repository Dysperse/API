import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import useSWR from "swr";
import { AccountHeader } from "./AccountHeader";
import { Goal } from "./Goal";
import { Navbar } from "./Navbar";

export function AccountData({ setOpen, scrollTop, account }: any) {
  const url =
    "/api/finance/goals?" +
    new URLSearchParams({
      token: global.user.accessToken,
      accountId: account.account_id,
    });

  const { data, error } = useSWR(url, () =>
    fetch(url, { method: "POST" }).then((res) => res.json())
  );

  if (error)
    return (
      <Box
        sx={{
          borderRadius: 4,
          mt: 2,
          p: 3,
          background: "rgba(200,200,200,.3)",
        }}
      >
        Yikes! An error has occured. Try reloading this page
      </Box>
    );

  return (
    <>
      <Navbar setOpen={setOpen} scrollTop={scrollTop} account={account} />
      <AccountHeader
        currency={account.balances.iso_currency_code}
        balance={account.balances.current}
      />

      <Box sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: "600", mt: 1, mb: 3 }}>
          Goals
        </Typography>
        {data && data.data.length === 0 && (
          <Box
            sx={{
              borderRadius: 4,
              mt: 2,
              p: 3,
              background: "rgba(200,200,200,.3)",
            }}
          >
            You haven&apos;t set any goals yet.
          </Box>
        )}
        {!data && (
          <>
            {[...new Array(10)].map((_: any, id: number) => (
              <Skeleton
                key={id.toString()}
                variant="rectangular"
                height={150}
                sx={{ borderRadius: 4, mt: 2 }}
                animation="wave"
              />
            ))}
          </>
        )}
        {data &&
          data.data.map((goal: any, id: number) => (
            <Goal
              key={id.toString()}
              scrollTop={scrollTop}
              id={goal.id}
              image={goal.image}
              name={goal.name}
              note={goal.note}
              balance={account.balances.current}
              minAmountOfMoney={goal.minAmountOfMoney}
            />
          ))}
      </Box>
    </>
  );
}
