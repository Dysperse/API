export async function GET(request: Request) {
  const res = await request.json();
  return Response.json(res);
}
