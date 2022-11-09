import { STATUS_OK } from "../constants/statusHttp";
import { getReposPerPage, makeFakeResponse } from "./repositories";

export const handlerPaginated = (req, res, ctx) =>
res(
  ctx.status(STATUS_OK),
  ctx.json({
    ...makeFakeResponse({totalCount: 10000}),
    items: getReposPerPage({
      perPage: Number(req.url.searchParams.get('per_page')),
      currentPage: req.url.searchParams.get('page'),
    }),
  }),
)