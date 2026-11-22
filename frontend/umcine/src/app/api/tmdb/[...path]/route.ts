import { NextResponse } from "next/server";
import { apiError } from "@/server/http";
import { getServerMovieDetail, getServerMovies, parsePage, searchServerMovies } from "@/server/tmdb";

export async function GET(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const route = path.join("/");
  const params = new URL(request.url).searchParams;
  try {
    let data;
    if (route === "movie/popular") data = await getServerMovies(parsePage(params.get("page") ?? undefined));
    else if (path.length === 2 && path[0] === "movie" && /^[1-9]\d*$/.test(path[1]) && Number.isSafeInteger(Number(path[1]))) {
      data = await getServerMovieDetail(Number(path[1]));
    } else if (route === "search/movie") {
      const query = params.get("query")?.trim() ?? "";
      if (!query) return NextResponse.json({ message: "검색어를 입력해 주세요." }, { status: 400 });
      data = await searchServerMovies(query, parsePage(params.get("page") ?? undefined));
    } else return NextResponse.json({ message: "지원하지 않는 경로예요." }, { status: 404 });
    return NextResponse.json(data);
  } catch (error) { return apiError(error); }
}
