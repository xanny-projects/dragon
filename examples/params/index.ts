import {
  Application,
  HttpRequest,
  HttpResponse,
  RequestMethod,
} from "../../lib/mod.ts";

async function main(args: string[]): Promise<void> {
  const app = new Application();

  const r = app.routes({ maxRoutes: 1 });

  r.withPath(/user\/(?<id>[0-9]{1,})/u).withMethods(RequestMethod.GET)
    .handleFunc(
      async function (Request: HttpRequest, ResponseWriter: HttpResponse) {
        const { id: userID } = Request.params();
        ResponseWriter.withBody(`Hello ${userID}`).end();
      },
    );

  app.listenAndServe({ port: 8080 });
}

await main(Deno.args);

console.log("Dragon listining...");
