import Item from "../../components/ItemPopup";

export function RecentItem({ item }: any) {
  return <Item key={Math.random().toString()} variant="list" data={item} />;
}
