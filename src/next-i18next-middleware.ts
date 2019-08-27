import i18nextMiddleware from "i18next-express-middleware";
import { Request, Response, NextFunction } from "express";
import { getConfigByHost } from "./common/site-specific-config";

export default function(nexti18next) {
  const { config, i18n } = nexti18next;
  const { ignoreRoutes } = config;

  const isI18nRoute = (req: Request) =>
    ignoreRoutes.every(x => !req.url.startsWith(x));

  const middleware = [];

  /*
    If not using server side language detection,
    we need to manually set the language for
    each request
  */
  if (!config.serverLanguageDetection) {
    middleware.push((req: Request, _res: Response, next: NextFunction) => {
      if (isI18nRoute(req)) {
        const host = req.headers.host;
        const siteConfig = getConfigByHost(host);
        req.lng = siteConfig.language;
      }
      next();
    });
  }

  /*
    This does the bulk of the i18next work
  */
  middleware.push(i18nextMiddleware.handle(i18n, { ignoreRoutes }));

  return middleware;
}
