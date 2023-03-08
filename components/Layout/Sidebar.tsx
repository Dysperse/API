import { openSpotlight } from "@mantine/spotlight";
import { Box, Icon, Tooltip } from "@mui/material";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import { useHotkeys } from "react-hotkeys-hook";
import { useSession } from "../../pages/_app";
import InviteButton from "./UserMenu";
const SearchPopup = dynamic(() => import("./Search"));

export function Sidebar() {
  const router = useRouter();

  useHotkeys(
    "ctrl+shift+1",
    (e) => {
      e.preventDefault();
      router.push("/zen");
    },
    [open]
  );

  useHotkeys(
    "ctrl+shift+4",
    (e) => {
      e.preventDefault();
      router.push("/items");
    },
    [open]
  );
  useHotkeys(
    "ctrl+shift+3",
    (e) => {
      e.preventDefault();
      router.push("/coach");
    },
    [open]
  );
  useHotkeys(
    "ctrl+shift+2",
    (e) => {
      e.preventDefault();
      router.push("/tasks");
    },
    [open]
  );
  const session = useSession();
  const styles = (active: any = false) => {
    return {
      color: session?.user?.darkMode ? "hsl(240,11%,90%)" : "hsl(240,11%,30%)",
      borderRadius: 3,
      my: 0.5,
      maxHeight: "9999px",
      overflow: "visible",
      "& .material-symbols-rounded, & .material-symbols-outlined": {
        transition: "none",
        height: 50,
        width: 50,
        display: "flex",
        alignItems: "center",
        borderRadius: 5,
        justifyContent: "center",
      },
      "&:hover .material-symbols-outlined": {
        background: session?.user?.darkMode
          ? "hsl(240,11%,14%)"
          : "hsl(240,11%,90%)",
        color: session?.user?.darkMode ? "#fff" : "#000",
      },
      "&:focus-visible span": {
        boxShadow: session?.user?.darkMode
          ? "0px 0px 0px 1.5px hsl(240,11%,50%) !important"
          : "0px 0px 0px 1.5px var(--themeDark) !important",
      },
      userSelect: "none",
      ...(active && {
        " .material-symbols-outlined,  .material-symbols-rounded": {
          background: session?.user?.darkMode
            ? "hsl(240,11%,17%)"
            : "hsl(240,11%,85%)",
          color: session?.user?.darkMode
            ? "hsl(240,11%,95%)"
            : "hsl(240,11%,10%)",
        },
      }),
    };
  };

  return (
    <Box
      sx={{
        display: { xs: "none", md: "flex!important" },
        maxWidth: "85px",
        width: "80px",
        zIndex: "99!important",
        filter: "none!important",
        overflowX: "hidden",
        background: {
          sm: session?.user?.darkMode
            ? router.asPath === "/zen" || router.asPath === "/coach"
              ? "hsla(240,11%,8%)"
              : "hsla(240,11%,5%)"
            : "hsl(240,11%,93%)",
        },
        height: "100vh",
        backdropFilter: "blur(10px)",
        position: "fixed",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Image
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
        src="/logo.svg"
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAQAAAAkGDomAAAAAmJLR0QA/4ePzL8AAAAHdElNRQfnAhkVNQ1WKRV/AAAAAW9yTlQBz6J3mgAABotJREFUaN7t2mlTG9cSxvHfzEhIYpPY4dpxKouT2Hz/j2Kwk5A4N44BAZaR0L5MXsxIxo5ZJE3qum5x9JZq/dV9uvs53fBwHs7DeTjXTyDI1mDuX8KLv0TAQChALM4OMMoUL5ITCbLDy9KDgVDeAvpZ+jArwEAgp6iEjpFhVn7M0oN5JasCkYG+UTZms/NgZMGKNaFAR8fwS/NgpGjVplCsoamfTZCzAQyEckrW7AgNvVPXzSbIWXkwtGDFhh2RnqoL4ZflwUhR2ZY9kY63Fl0ZZGE6C8CkAi5Zt2NHpGnDsvd6RvP7MBvAsf+2bYk0bam40M4ik+cHDATylm3YsWNDqGXXpqorg/k7SpgBYE5Rxa49m1at2rBn15pFufnF17xiIQnvuid+8qMnKgpiPQ2XrrIo1/MChvJW7Hnqme9tW5YTGOhoqGvpzVsN5wMM5Cza8o1nfvKVikJqcaDtSlPHYL5cngcwCe+ar/zouW9tW5ITCARifW1Nbd35wjw7YCBUsGrPU/t+8EjZglCQKutYX0dLR38eH84KmBTnZTu+s++Zr20oiVL/JZCxgY6OrsHsN3E2wDHetm88n4Q3nxatAKFQiKGerv7siLMAjvGS5Nj3vT2raXiv/03yPhnp6xkYzla0pwcMRAqp936y76lHafZex0ueUJGcUGxokCL+y4CJX4pW7aTe+8FjFcV/9IwxYl5eTmBkaGQ0faDvDzj+wkUV//Gd5/Y99diakugzLTMQiOQsWLAgJxAbGU0b6PsBBkKhvKIVm554at9z33ukcgPedcSCoqKF9BLEppo73AUYTB7kBUvW7fnGj/Y98609FcUb8T5GLCkpKcinpcjkStwhJ6JbTIep+byiZWt2PPHUM8/94GvbVhXk7tBDQZrzBSVLliwqWpATCdNvCD4B/uTkbjCa/PbkDhUtKduw65HHHqeyqij/UWG5GTFKIUtWrNu26y8nzr3X1NbTTxPos/OI4DMGQ6GcnIKCRcvK1m3ZtWfPjg1li+mNuq/ai8WG+trqLlQdO3bizIVLDS0dXX3DtFbGtwGOc7WoZFnZmg1bdmzbsWnNqsU0sNNK0djIUE9LQ825qqpTZ87VJpj9f2qfj0M8Du2CohXrNm3btWvXlg2rlhTT/jC9Ug7SW5ekzLKyirKV1GZAWic/yfLwDnPR5JN01/knqOO6EH5kN3RDmkSfNfAhKAP9tJcmD6CAa5k3XYiTe9hS986pt95449iJczUN7VT13HkHr3eAkiWrKmnu7dq1bd2KUprB94ccGaUPgZozp46dqLpQU09lbSIo7gT8ABmmNXBByYqKzbTMPLJr3XJaou+DGIsN9FypqfrLG385djbxWz9FG32uy0Q3mBz/5r6ujqaGuvcuXWnriyc3524vJhelrebYb146cOhXfzhxoa6lc7sYi241nWAO9XW1NTU0riGO+0Fwq42Rnivn/vSLAwd+9tqJmoZOWqJvlQ93i4WkdI4M9HQ0NTV19Jnk982IsaGehqrfvfTCoSNvXbjSTV8qd8qG+40+xpCJL1uartKsi1H8SKx+ild34rVXXvndWzUtvWnU9f1nMx88mdzL7qQsVD6LmAS37tiRQy/95til9rTv5OmGR7GRWDuV8MlDKCnphU8QE7yGE0deOHDkRD31+VSCddrpVnztM2KyvBmLpw9/N9B05rVDB351rK5nOL3kn2X8Fhvqpn0lkk8lfSg/AUwKyzv/9cpLR47VZ50wzD5ZSOrkUGAhVctjjRMb6ar506EXfvHW5ewDkHlmM3Gq4HJKliYakVhf3bGfvfDKG+/nmc/MB5i80wIFS5bTDs1Qy7nfHDj0h3fzTQnnnQ8mJSNn0Uran2N9l9546cCRquY8k5ks1rGxWKhoxapFebGWqiMHfvZWXW++GWsWgAQKllWsKBiqe+OVQ69dzD8EzmKhHQvkLCkrKxp453eHfnXiSv9/PaP+YKekrKKk79QvXvpDLYt93fx7kthI35VzJ6pWRc6cONOYd/ibFWDS1treO3OqLOdUVU0r1TpfBOBIX9OFqrLIqQuNbDZ1WW07Ex9eOrMiUlXTzsZ/2e2LE3F1blHkfHZp8G8BxmJ9LTVFoQvN+TdM2QImwqHjUk7ofbqIzcSDWf7nUSA0SldgXcNszGYFOB6JDHW1dbJKkaw9mBScZNb3xQEmZ5RuRDJKkWwBg4mEzQzvzhn71LZmWDTcfrIOsSzhHs7DeTj/D+dvWivBRuN+GP4AAAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMDItMjVUMjE6NTM6MTMrMDA6MDC075D4AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIzLTAyLTI1VDIxOjUzOjEzKzAwOjAwxbIoRAAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyMy0wMi0yNVQyMTo1MzoxMyswMDowMJKnCZsAAAAASUVORK5CYII="
        width={50}
        height={50}
        alt="Logo"
        style={{
          borderRadius: "999px",
          marginTop: "15px",
          ...(session?.user?.darkMode && {
            filter: "invert(100%)",
          }),
        }}
      />
      <Box sx={{ mt: "auto" }} />
      <Box
        sx={styles(
          router.asPath === "/zen" ||
            router.asPath === "/" ||
            router.asPath === ""
        )}
        onClick={() => router.push("/zen")}
        onMouseDown={() => router.push("/zen")}
      >
        <Tooltip title="Start" placement="right">
          <span
            className={`material-symbols-${
              router.asPath === "/zen" ||
              router.asPath === "/" ||
              router.asPath === ""
                ? "rounded"
                : "outlined"
            }`}
          >
            change_history
          </span>
        </Tooltip>
      </Box>
      <Box
        sx={styles(router.asPath.includes("/tasks"))}
        onClick={() => router.push("/tasks")}
        onMouseDown={() => router.push("/tasks")}
      >
        <Tooltip title="Lists" placement="right">
          <span
            className={`material-symbols-${
              router.asPath.includes("/tasks") ? "rounded" : "outlined"
            }`}
          >
            check_circle
          </span>
        </Tooltip>
      </Box>
      <Box
        sx={styles(router.asPath === "/coach")}
        onClick={() => router.push("/coach")}
        onMouseDown={() => router.push("/coach")}
      >
        <Tooltip title="Coach" placement="right">
          <span
            className={`material-symbols-${
              router.asPath === "/coach" ? "rounded" : "outlined"
            }`}
          >
            rocket_launch
          </span>
        </Tooltip>
      </Box>
      <Box
        sx={styles(
          router.asPath === "/items" ||
            router.asPath === "/trash" ||
            router.asPath === "/starred" ||
            router.asPath.includes("rooms")
        )}
        onClick={() => router.push("/items")}
        onMouseDown={() => router.push("/items")}
      >
        <Tooltip title="Items" placement="right">
          <span
            className={`material-symbols-${
              router.asPath === "/items" ||
              router.asPath === "/trash" ||
              router.asPath === "/starred" ||
              router.asPath.includes("rooms")
                ? "rounded"
                : "outlined"
            }`}
          >
            inventory_2
          </span>
        </Tooltip>
      </Box>

      <Box
        sx={{
          mt: "auto",
          mb: 1,
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <SearchPopup styles={styles} />
        <Tooltip title="Jump to" placement="right">
          <Box onClick={() => openSpotlight()} sx={styles(false)}>
            <Icon className="outlined">bolt</Icon>
          </Box>
        </Tooltip>
        <InviteButton styles={styles} />
      </Box>
    </Box>
  );
}
