import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import styled from "@emotion/styled";
import {
  Box,
  CircularProgress,
  Icon,
  IconButton,
  InputAdornment,
  SwipeableDrawer,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { cloneElement, useCallback, useState } from "react";
import { VirtuosoGrid } from "react-virtuoso";
import useSWRImmutable from "swr/immutable";
import { ErrorHandler } from "../Error";
import { Puller } from "../Puller";

const ItemContainer = styled.div`
  width: 25%;
  display: flex;
  flex: none;
  align-content: stretch;
  box-sizing: border-box;
`;

const ItemWrapper = styled.div`
  flex: 1;
  height: 40px;
  text-align: center;
`;

const ListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const EmojiPicker = function EmojiPicker({
  children,
  setEmoji,
  useNativeEmoji = false,
}: {
  children: JSX.Element;
  setEmoji: (emoji: string) => void;
  useNativeEmoji?: boolean;
}) {
  const { session } = useSession();

  const [open, setOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const isDark = useDarkMode(session.darkMode);

  const palette = useColor(session.themeColor, isDark);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = () => setOpen(false);

  const trigger = cloneElement(children, { onClick: handleOpen });

  const { data, isLoading, error } = useSWRImmutable(
    "https://cdn.jsdelivr.net/npm/@emoji-mart/data",
    (u) => fetch(u).then((res) => res.json())
  );

  function handleEmojiSelect(emoji) {
    const code = emoji.skins[0][useNativeEmoji ? "native" : "unified"];
    setEmoji(code);
    handleClose();
  }

  const filteredData = data
    ? Object.keys(data.emojis)
        .filter(
          (key) =>
            data.emojis[key].keywords.some((keyword) =>
              keyword.toLowerCase().includes(query.toLowerCase())
            ) ||
            query === "" ||
            data.emojis[key].name.toLowerCase().includes(query.toLowerCase()) ||
            key.toLowerCase().includes(query.toLowerCase())
        )
        .map((key) => data.emojis[key])
    : [];

  return (
    <>
      {trigger}

      <SwipeableDrawer
        open={open}
        onClose={handleClose}
        anchor="bottom"
        sx={{
          zIndex: 99999999999,
          textAlign: "center",
        }}
      >
        <Puller showOnDesktop />
        {error && (
          <ErrorHandler error="Couldn't load emojis. Please try again later" />
        )}
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              width: "100%",
              borderRadius: 5,
              height: "300px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ p: 2, pt: 0 }}>
              <TextField
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    background: palette[2],
                    "&:focus-within": {
                      background: palette[3],
                    },
                    transition: "all .2s",
                    mb: 2,
                    px: 2,
                    py: 0.3,
                    borderRadius: 3,
                  },
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon>search</Icon>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {query !== "" && (
                        <IconButton onClick={() => setQuery("")}>
                          <Icon className="outlined" sx={{ opacity: 0.6 }}>
                            cancel
                          </Icon>
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
              {data &&
                (filteredData.length === 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",
                      height: "300px",
                      alignItems: "center",
                      borderRadius: 5,
                      flexDirection: "column",
                      justifyContent: "center",
                      background: palette[2],
                    }}
                  >
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <img
                        src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${
                          query !== "" ? "1f62d" : "1f615"
                        }.png`}
                        alt="Crying emoji"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Typography variant="h6">No results found</Typography>
                    </motion.div>
                  </Box>
                ) : (
                  <VirtuosoGrid
                    totalCount={filteredData.length}
                    style={{
                      height: "300px",
                      background: palette[2],
                      borderRadius: "17px",
                    }}
                    components={{
                      Item: ItemContainer,
                      List: ListContainer as any,
                      ScrollSeekPlaceholder: () => (
                        <ItemContainer>
                          <ItemWrapper></ItemWrapper>
                        </ItemContainer>
                      ),
                    }}
                    itemContent={(index) => (
                      <Box sx={{ flex: 1 }}>
                        <Box
                          sx={{
                            fontSize: "24px",
                            "&:hover": { background: { sm: palette[3] } },
                            "&:active": { background: { sm: palette[4] } },
                            p: 1,
                            borderRadius: 3,
                          }}
                          onClick={() => handleEmojiSelect(filteredData[index])}
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            {filteredData[index].skins[0].native}
                          </motion.div>
                        </Box>
                      </Box>
                    )}
                    scrollSeekConfiguration={{
                      enter: (velocity) => Math.abs(velocity) > 200,
                      exit: (velocity) => Math.abs(velocity) < 30,
                      change: (_, range) => console.log({ range }),
                    }}
                  />
                ))}
            </Box>
          </>
        )}
      </SwipeableDrawer>
    </>
  );
};

export default EmojiPicker;
