import {
  Application,
  HttpRequest,
  HttpResponse,
  RequestMethod,
} from "../../lib/mod.ts";

async function main(args: string[]): Promise<void> {
  const app = new Application();

  const r = app.routes({ maxRoutes: 1 });

  r.Path("/").withMethods(RequestMethod.PUT).handleFunc(
    async function (Request: HttpRequest, ResponseWriter: HttpResponse) {
      console.log("Hello world");
      ResponseWriter.withBody("Hello Dragon").send();
    },
  );

  app.listenAndServe({ port: 8080 });
}

await main(Deno.args);

console.log("Dragon listining...");
