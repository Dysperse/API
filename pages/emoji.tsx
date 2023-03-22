import { useState } from "react";
import { EmojiPicker } from "../components/EmojiPicker";

export default function App() {
  const [emoji, setEmoji] = useState("1f440");

  return (
    <EmojiPicker emoji={emoji} setEmoji={setEmoji}>
      <button>open</button>
    </EmojiPicker>
  );
}
