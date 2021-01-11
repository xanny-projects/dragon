import {
  Application,
  HttpRequest,
  HttpResponse,
  RequestMethod,
  XFRAMEProtectionMiddleware,
  XSSProtectionMiddleware,
} from "../../lib/mod.ts";

async function main(args: string[]): Promise<void> {
  const app = new Application();

  const r = app.routes({ maxRoutes: 1 });

  r.Path("/").withMethods(RequestMethod.GET).handleFunc(
    async function (Request: HttpRequest, ResponseWriter: HttpResponse) {
      ResponseWriter.withBody("Hello Dragon").send();
    },
  ).withMiddleware(XSSProtectionMiddleware)
    .withMiddleware(XFRAMEProtectionMiddleware("DENY"));

  app.listenAndServe({ port: 8080 });
}

await main(Deno.args);

console.log("Dragon listining...");
