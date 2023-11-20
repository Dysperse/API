import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box, MenuItem } from "@mui/material";
import { ReactRenderer } from "@tiptap/react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import tippy from "tippy.js";
// import "./EmojiList.scss";

export const EmojiList = forwardRef(function EmojiList1(props: any, ref: any) {
  const { session } = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = useCallback(
    (index) => {
      const item = props.items[index];

      if (item) {
        props.command({ name: item.name });
      }
    },
    [props]
  );

  const upHandler = useCallback(() => {
    setSelectedIndex(
      (selectedIndex + props.items.length - 1) % props.items.length
    );
  }, [props.items.length, selectedIndex]);

  const downHandler = useCallback(() => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  }, [selectedIndex, props.items.length]);

  const enterHandler = useCallback(() => {
    selectItem(selectedIndex);
  }, [selectedIndex, selectItem]);

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(
    ref,
    () => {
      return {
        onKeyDown: (x) => {
          if (x.event.key === "ArrowUp") {
            upHandler();
            return true;
          }

          if (x.event.key === "ArrowDown") {
            downHandler();
            return true;
          }

          if (x.event.key === "Enter") {
            enterHandler();
            return true;
          }

          return false;
        },
      };
    },
    [upHandler, downHandler, enterHandler]
  );

  return (
    <Box
      sx={{
        p: 0.5,
        border: `2px solid ${palette[5]}`,
        borderRadius: 5,
        background: palette[3],
        "& img": {
          width: 20,
          height: 20,
        },
      }}
    >
      {props.items.map((item, index) => (
        <MenuItem
          selected={index === selectedIndex}
          key={index}
          sx={{ borderRadius: 5, gap: 2 }}
          onClick={() => selectItem(index)}
        >
          {item.fallbackImage ? (
            <img src={item.fallbackImage} alt="Emoji" />
          ) : (
            item.emoji
          )}
          :{item.name}:
        </MenuItem>
      ))}
    </Box>
  );
});

const d = {
  items: ({ editor, query }) => {
    return editor.storage.emoji.emojis
      .filter(({ shortcodes, tags }) => {
        return (
          shortcodes.find((shortcode) =>
            shortcode.startsWith(query.toLowerCase())
          ) || tags.find((tag) => tag.startsWith(query.toLowerCase()))
        );
      })
      .slice(0, 5);
  },

  allowSpaces: false,

  render: () => {
    let component;
    let popup;

    return {
      onStart: (props) => {
        component = new ReactRenderer(EmojiList, {
          props,
          editor: props.editor,
        });

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate(props) {
        component.updateProps(props);

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props) {
        if (props.event.key === "Escape") {
          popup[0].hide();
          component.destroy();

          return true;
        }

        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};
export default d;
