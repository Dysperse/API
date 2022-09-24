import Item from "../../components/ItemPopup";
import type { Item as ItemType } from "@prisma/client";

/**
 * Item card
 */
export function ItemCard({
  displayRoom = false,
  item,
}: {
  displayRoom?: boolean;
  item: ItemType;
}) {
  return <Item displayRoom={displayRoom} data={item} />;
}
