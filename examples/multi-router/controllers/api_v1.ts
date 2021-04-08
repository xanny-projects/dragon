import {
  HttpRequest,
  HttpResponse,
  HttpRouting,
  RequestMethod,
} from "../../../lib/mod.ts";

export function Api_v1(r: HttpRouting): void {
  r.withPath("/v2").withMethods(RequestMethod.GET).handleFunc(
    async function (Request: HttpRequest, ResponseWriter: HttpResponse) {
      ResponseWriter.withBody("Hello from APIv2 root route.").end();
    },
  );

  r.withPath("/users").withMethods(RequestMethod.GET).handleFunc(
    async function (Request: HttpRequest, ResponseWriter: HttpResponse) {
      ResponseWriter.withBody("List of APIv2 users.").end();
    },
  );
}
