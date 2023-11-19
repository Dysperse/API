import { useSession } from "@/lib/client/session";
import { useColor, useDarkMode } from "@/lib/client/useColor";
import { Box, Icon, IconButton } from "@mui/material";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import {
  BubbleMenu,
  EditorProvider,
  FloatingMenu,
  useCurrentEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

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
  Underline.configure({
    HTMLAttributes: {
      class: "my-custom-class",
    },
  }),
  Placeholder.configure({
    emptyEditorClass: "is-editor-empty",
    placeholder: "Add description …",
  }),
];

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
      <IconButton
        size="small"
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive("paragraph") ? "is-active" : ""}
      >
        <Icon>view_headline</Icon>
      </IconButton>
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
          className="editor-menu"
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
        "& .editor-menu": {
          zIndex: 99,
          background: palette[5],
          borderRadius: 99,
          p: 0.4,
          display: "flex",
          alignItems: "center",
          overflowX: "scroll",
          maxWidth: { xs: "200px", sm: "300px" },
          "&::-webkit-scrollbar": { display: "none" },
          "& .is-active": {
            background: palette[6],
          },
        },
      }}
    >
      <EditorProvider
        slotBefore={<MenuBar />}
        extensions={extensions}
        content={description}
      >
        {" "}
      </EditorProvider>
    </Box>
  );
}
