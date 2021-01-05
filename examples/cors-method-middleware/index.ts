import {
  Application,
  CORSMethodMiddleware,
  HttpRequest,
  HttpResponse,
  RequestMethod,
} from "../../lib/mod.ts";

async function main(args: string[]): Promise<void> {
  const app = new Application();

  const r = app.routes({ maxRoutes: 1 });

  r.Path("/").withMethods(RequestMethod.GET).handleFunc(
    async function (Request: HttpRequest, ResponseWriter: HttpResponse) {
      ResponseWriter.withBody("Hello Dragon CORS").send();
    },
  ).withMiddleware(
    CORSMethodMiddleware(
      { origin: "127.0.0.1", headers: [RequestMethod.GET, RequestMethod.POST] },
    ),
  );

  app.listenAndServe({ port: 8080 });
}

await main(Deno.args);

console.log("Dragon listining...");
