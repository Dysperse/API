export function Emoji({
  style = {},
  emoji,
  size,
}: {
  emoji: string;
  size: string | number;
  style?: any;
}) {
  return (
    <img
      src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${emoji}.png`}
      width={size}
      height={size}
      style={style}
    />
  );
}
