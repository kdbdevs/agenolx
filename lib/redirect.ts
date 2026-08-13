import { NextResponse } from "next/server";

export function redirectRelative(path: string, status = 303) {
  return new NextResponse(null, {
    status,
    headers: {
      Location: path
    }
  });
}

export function withSearchParam(path: string, key: string, value: string) {
  const [pathname, search = ""] = path.split("?");
  const params = new URLSearchParams(search);
  params.set(key, value);
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
