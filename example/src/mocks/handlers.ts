import { rest } from "msw";

export const handlers = [
  rest.get(`/api/book/:id`, (_req, res, ctx) => {
    return res(
      ctx.json({
        id: "001",
        author_name: "author",
        filename: "filename",
      }),
      ctx.status(200),
    );
  }),
];
