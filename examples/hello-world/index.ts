import {
  Application,
  HttpRequest,
  HttpResponse,
  RequestMethod,
} from "../../lib/mod.ts";

async function main(args: string[]): Promise<void> {
  const app = new Application();

  const r = app.routes({ maxRoutes: 1 });

  r.Path("/").withMethods(RequestMethod.GET).handleFunc(
    async function (Request: HttpRequest, ResponseWriter: HttpResponse) {
      ResponseWriter.withBody("Hello Xanny").send();
    },
  );

  app.listenAndServe({ port: 8080 });
}

main(Deno.args).then((r) => console.log("🦕 Xanny listining..."));
