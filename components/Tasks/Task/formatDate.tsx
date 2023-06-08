export function formatDate(date) {
  let d = new Date(date),
    month = String(d.getMonth() + 1),
    day = String(d.getDate()),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [month, day, year].join("-");
}
