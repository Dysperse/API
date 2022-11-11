"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import type { CustomRoom } from "@prisma/client";
import { encode } from "js-base64";
import React from "react";
import { ErrorHandler } from "../../components/error";
import { FloatingActionButton } from "../../components/Rooms/FloatingActionButton";
import { useApi } from "../../hooks/useApi";
import { colors } from "../../lib/colors";
import type { ApiResponse } from "../../types/client";
import { Action } from "./Action";
import { CategoryModal } from "./CategoryModal";

/**
 * Component to dispay items by category
 */
function CategoryList() {
  const { error, data }: ApiResponse = useApi("property/inventory/categories");

  return (
    <>
      {error && (
        <ErrorHandler error="An error occured while trying to fetch your items" />
      )}
      {!error && data ? (
        <>
          {[...new Set(data)].map((category: any) => (
            <CategoryModal category={category} key={category.toString()} />
          ))}
          {[...new Set(data)].length === 0 && (
            <Box
              sx={{
                p: 2,
                my: 1,
                background: "rgba(200,200,200,.3)",
                borderRadius: 5,
                fontWeight: "500",
              }}
            >
              You haven&apos;t added any categories to items yet
            </Box>
          )}
        </>
      ) : (
        !error && (
          <>
            {[...new Array(5)].map(() => (
              <Skeleton
                animation="wave"
                height={30}
                sx={{ width: "100%", mb: 2, borderRadius: 3 }}
                variant="rectangular"
                key={Math.random().toString()}
              />
            ))}
          </>
        )
      )}
    </>
  );
}

/**
 * Rooms popup
 */
function Rooms() {
  const { data, error } = useApi("property/rooms");

  return (
    <>
      {data &&
        data.map((room: CustomRoom) => (
          <Action
            href={`/rooms/${encode(
              `${room.id},${room.name}`
            ).toString()}?custom=true`}
            icon="label"
            primary={room.name}
            key={room.id.toString()}
          />
        ))}
      {error && (
        <ErrorHandler error="An error occured while trying to fetch your items" />
      )}
    </>
  );
}

/**
 * Top-level component for the items page
 */
export default function Categories() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  /**
   * Closes the popup
   * @returns void
   */
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [viewBy, setViewBy] = React.useState("room");
  const { data } = useApi("property/inventory/count");

  return (
    <Box
      sx={{
        maxWidth: { sm: "500px" },
        mx: "auto",
      }}
    >
      <FloatingActionButton />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem
          onClick={() => {
            setViewBy("room");
            handleClose();
          }}
          sx={{
            ...(viewBy === "room" && {
              background:
                colors[global.themeColor][global.user.darkMode ? 700 : 300],
            }),
          }}
        >
          Room
        </MenuItem>
        <MenuItem
          onClick={() => {
            setViewBy("category");
            handleClose();
          }}
          sx={{
            ...(viewBy === "category" && {
              background:
                colors[global.themeColor][global.user.darkMode ? 700 : 300],
            }),
          }}
        >
          Category
        </MenuItem>
      </Menu>
      <Container sx={{ mb: 3 }}>
        <Box
          sx={{
            my: 4,
            px: 1,
            borderRadius: "15px!important",
          }}
        >
          <Typography sx={{ my: 5, fontWeight: "600" }} variant="h5">
            Inventory
          </Typography>
          <ButtonGroup
            variant="outlined"
            sx={{
              p: 0.2,
              borderRadius: "15px!important",
              width: "100%",
              background: `${
                colors[themeColor][global.theme !== "dark" ? 100 : 900]
              }!important`,
            }}
            aria-label="outlined primary button group"
          >
            <Button
              variant="contained"
              disableElevation
              onClick={() => setViewBy("room")}
              sx={{
                px: 5,
                mr: 0.1,
                borderRadius: "15px!important",
                transition: "none!important",
                width: "50%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                ...(viewBy !== "room" && {
                  background: `${
                    colors[themeColor][global.theme !== "dark" ? 100 : 900]
                  }!important`,
                  color: `${
                    colors[themeColor][global.user.darkMode ? 50 : 900]
                  }!important`,
                }),
              }}
            >
              Room
            </Button>
            <Button
              variant="contained"
              disableElevation
              onClick={() => setViewBy("category")}
              sx={{
                px: 5,
                borderRadius: "15px!important",
                borderWidth: "2px!important",
                transition: "none!important",
                width: "50%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                ...(viewBy !== "category" && {
                  background: `${
                    colors[themeColor][global.theme !== "dark" ? 100 : 900]
                  }!important`,

                  color: `${
                    colors[themeColor][global.user.darkMode ? 50 : 900]
                  }!important`,
                }),
              }}
            >
              Category
            </Button>
          </ButtonGroup>
        </Box>
        {viewBy === "room" ? (
          <>
            <Action
              href="/rooms/kitchen"
              icon="oven_gen"
              primary="Kitchen"
              count={data}
            />
            <Action
              href="/rooms/bedroom"
              icon="bedroom_parent"
              primary="Bedroom"
              count={data}
            />
            <Action
              count={data}
              href="/rooms/bathroom"
              icon="bathroom"
              primary="Bathroom"
            />
            <Action
              count={data}
              href="/rooms/garage"
              icon="garage"
              primary="Garage"
            />
            <Action
              count={data}
              href="/rooms/dining"
              icon="dining"
              primary="Dining room"
            />
            <Action
              count={data}
              href="/rooms/living"
              icon="living"
              primary="Living room"
            />
            <Action
              href="/rooms/laundry"
              count={data}
              icon="local_laundry_service"
              primary="Laundry room"
            />
            <Action
              href="/rooms/storage"
              count={data}
              icon="inventory_2"
              primary="Storage room"
            />
            <Action
              href="/rooms/garden"
              count={data}
              icon="yard"
              primary="Garden"
            />
            <Action
              href="/rooms/camping"
              count={data}
              icon="camping"
              primary="Camping"
            />
            <Divider sx={{ my: 1 }} />
            <Rooms />
            <Action
              onClick={() =>
                document.getElementById("setCreateRoomModalOpen")?.click()
              }
              disableLoading
              icon="add_circle"
              primary="Create room"
            />
            <Action
              onClick={() =>
                document.getElementById("houseProfileTrigger")?.click()
              }
              icon="edit"
              primary="Manage rooms"
            />
            <Divider sx={{ my: 1 }} />
            <Action href="/starred" icon="star" primary="Starred" />
            <Action href="/trash" icon="delete" primary="Trash" />
          </>
        ) : (
          <CategoryList />
        )}
      </Container>
    </Box>
  );
}
