import Item from "../../components/ItemPopup";

/**
 * Item card
 */
export function ItemCard({ displayRoom = false, item }: any) {
  return <Item displayRoom={displayRoom} data={item} />;
}
