import type { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * Express 5 does forward rejected promises from async handlers to error
 * middleware on its own, but wrapping explicitly keeps that behavior
 * guaranteed even if the app is ever downgraded, and makes the intent
 * obvious at each route.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
