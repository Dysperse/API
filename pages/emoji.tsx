import { useState } from "react";
import { EmojiPicker } from "../components/EmojiPicker";

export default function App() {
  const [emoji, setEmoji] = useState("1f440");

  return (
    <EmojiPicker emoji={emoji} setEmoji={setEmoji}>
      <button>
        <img
          src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${emoji}.png`}
        />
      </button>
    </EmojiPicker>
  );
}
