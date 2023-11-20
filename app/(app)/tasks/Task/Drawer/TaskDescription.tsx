import { addHslAlpha } from "@/lib/client/addHslAlpha";
import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box, Icon, IconButton } from "@mui/material";
import Emoji, { gitHubEmojis } from "@tiptap-pro/extension-emoji";
import CharacterCount from "@tiptap/extension-character-count";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Underline from "@tiptap/extension-underline";
import {
  BubbleMenu,
  EditorProvider,
  FloatingMenu,
  useCurrentEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { memo } from "react";
import suggestion from "./suggestion";

const extensions = [
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
  Emoji.configure({
    emojis: gitHubEmojis,
    enableEmoticons: true,
    suggestion,
  }),
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Underline.configure({
    HTMLAttributes: {
      class: "my-custom-class",
    },
  }),
  Placeholder.configure({
    emptyEditorClass: "is-editor-empty",
    placeholder: "Tap to add note",
  }),
  CharacterCount.configure({
    limit: 1000,
  }),
  Link.configure({
    protocols: ["ftp", "mailto"],
    linkOnPaste: true,
    autolink: true,
  }),
  Image.configure({
    inline: true,
  }),
];

const CharacterLimit = memo(function Limit() {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <Box
      className="character-count"
      sx={{ px: 3, position: "absolute", top: 0, right: 0, py: 1 }}
    >
      {1000 - editor.storage.characterCount.characters()}
    </Box>
  );
});

const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  const children = (
    <>
      <IconButton
        size="small"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        <Icon>format_bold</Icon>
      </IconButton>
      <IconButton
        size="small"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "is-active" : ""}
      >
        <Icon>format_underlined</Icon>
      </IconButton>
      <IconButton
        size="small"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
      >
        <Icon>format_italic</Icon>
      </IconButton>
      {/* <IconButton
        size="small"
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive("paragraph") ? "is-active" : ""}
      >
        <Icon>view_headline</Icon>
      </IconButton> */}
      <IconButton
        size="small"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
      >
        <Icon>format_h1</Icon>
      </IconButton>
      <IconButton
        size="small"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
      >
        <Icon>format_h2</Icon>
      </IconButton>
      <IconButton
        size="small"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
      >
        <Icon>format_h3</Icon>
      </IconButton>
      <IconButton
        size="small"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
      >
        <Icon>format_list_bulleted</Icon>
      </IconButton>
      <IconButton
        size="small"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "is-active" : ""}
      >
        <Icon>format_list_numbered</Icon>
      </IconButton>
      <IconButton
        size="small"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive("codeBlock") ? "is-active" : ""}
      >
        <Icon>code</Icon>
      </IconButton>
      <IconButton
        size="small"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "is-active" : ""}
      >
        <Icon>format_quote</Icon>
      </IconButton>
      <IconButton
        size="small"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Icon>horizontal_rule</Icon>
      </IconButton>
    </>
  );

  return (
    <>
      {editor && (
        <BubbleMenu
          className="editor-menu"
          tippyOptions={{ duration: 100 }}
          editor={editor}
        >
          {children}
        </BubbleMenu>
      )}
      {editor && (
        <FloatingMenu
          className="editor-menu editor-menu-outlined"
          tippyOptions={{ duration: 100 }}
          editor={editor}
        >
          {children}
        </FloatingMenu>
      )}
    </>
  );
};

export function TaskDescription({ description, disabled, handleChange }) {
  const { session } = useSession();
  const palette = useColor(session.themeColor, useDarkMode(session.darkMode));

  return (
    <Box
      sx={{
        mt: -3,
        mb: 3,
        position: "relative",
        "& .character-count": { opacity: 0 },
        "&:focus-within .character-count": { opacity: 0.6 },
        "& .editor-menu": {
          zIndex: 99,
          background: addHslAlpha(palette[3], 0.9),
          backdropFilter: "blur(3px)",
          boxShadow: `0 0 50px ${palette[1]}`,
          borderRadius: 99,
          ml: 3.5,
          gap: 0.5,
          display: "flex",
          alignItems: "center",
          overflowX: "scroll",
          maxWidth: { xs: "200px", sm: "300px" },
          "&::-webkit-scrollbar": { display: "none" },
          "& .is-active": {
            background: palette[11],
            "& *": {
              color: palette[1],
            },
          },
          "&.editor-menu-outlined": {
            mt: -7,
            ml: -2,
          },
        },
        "& a": {
          color: "#0288d1",
          cursor: "pointer",
          textDecoration: "underline",
          textDecorationThickness: "2px",
        },
        "& img": {
          maxWidth: "100%",
          borderRadius: 5,
          "&.ProseMirror-selectednode": {
            outline: `3px solid ${palette[9]}`,
          },
        },
        "& h1, & h2, & h3": {
          mb: 0,
          lineHeight: 1,
        },
      }}
    >
      <EditorProvider
        onBlur={({ editor }) => {
          handleChange(editor.getHTML());
        }}
        slotBefore={<MenuBar />}
        slotAfter={<CharacterLimit />}
        extensions={extensions}
        content={description}
      >
        {" "}
      </EditorProvider>
    </Box>
  );
}
