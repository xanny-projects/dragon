import {
  Application,
  HttpRequest,
  HttpResponse,
  RequestMethod,
} from "../../lib/mod.ts";
import { Api_v1 } from "./controllers/api_v1.ts";

async function main(args: string[]): Promise<void> {
  const app = new Application();

  const r = app.routes({ maxRoutes: 1 });

  r.Path("/").withMethods(RequestMethod.GET).handleFunc(
    async function (Request: HttpRequest, ResponseWriter: HttpResponse) {
      ResponseWriter.withBody("Hello from root route.").send();
    },
  );

  // register controllers.
  Api_v1(r);

  app.listenAndServe({ port: 8080 });
}

await main(Deno.args);

console.log("🦕 Xanny listining...");
