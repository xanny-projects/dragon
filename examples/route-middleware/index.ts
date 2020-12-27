import {
  Application,
  HttpRequest,
  HttpResponse,
  MiddlewareState,
  RequestMethod,
} from "../../lib/mod.ts";

// Cache Control Attack
async function Cache(
  Request: HttpRequest,
  ResponseWriter: HttpResponse,
): Promise<MiddlewareState> {
  ResponseWriter.withHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, max-age=0, s-maxage=0",
  );
  return MiddlewareState.Next;
}

async function main(args: string[]): Promise<void> {
  const app = new Application();

  const r = app.routes({ maxRoutes: 1 });

  r.Path("/").withMethods(RequestMethod.GET).handleFunc(
    async function (Request: HttpRequest, ResponseWriter: HttpResponse) {
      ResponseWriter.withBody("Hello Xanny").send();
    },
  ).withMiddleware(Cache);

  app.listenAndServe({ port: 8080 });
}

main(Deno.args).then((r) => console.log("🦕 Xanny listining..."));
