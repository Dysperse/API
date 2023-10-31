export async function POST(request: Request) {
  const res = await request.json();
  return Response.json(res);
}
