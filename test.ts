import {
  Application,
  HttpRequest,
  HttpResponse,
  MiddlewareState,
  RequestMethod,
} from "./lib/mod.ts";

const TimeOut = async function (
  Request: HttpRequest,
  ResponseWriter: HttpResponse,
) {
  console.log("Heee");
  return MiddlewareState.Next;
};

const TimeOutFirst = async function (
  Request: HttpRequest,
  ResponseWriter: HttpResponse,
) {
  console.log("hello");
  return MiddlewareState.Next;
};

async function main(args: string[]): Promise<void> {
  const app = new Application();
  const r = app.NewRoute({ maxRoutes: 1 });
  r.WithMethods(RequestMethod.GET)
    .WithMiddleware(TimeOut)
    .WithName("")
    .WithMiddleware(TimeOutFirst)
    .Path(/graphql\/(?<id>[0-9]{1,})\/name\/(?<name>[a-z]+)/u)
    .HandleFunc(
      async function (
        Request: HttpRequest,
        ResponseWriter: HttpResponse,
      ): Promise<any> {
        console.log(await Request.GetParams());
      },
    );

  app.ListenAndServe({ port: 8080 });
}

main(Deno.args).then(() => {
  console.log("Serveur listining");
});
