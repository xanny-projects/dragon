/*
 * Copyright 2020 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { assertEquals, assertNotEquals } from "../deps.ts";
import { HttpRouting, RequestMethod } from "../lib/httpRouting.ts";
import { HttpRequest } from "../lib/httpRequest.ts";
import { HttpResponse } from "../lib/httpResponse.ts";

// Simulate HttpRouting injection.
const httpRouting = new HttpRouting(
  "/",
  [],
  async () => Promise.resolve(),
);

httpRouting.withMethods(RequestMethod.GET);

Deno.test({
  name: "should push `HEAD` if the method is GET",
  fn(): void {
    assertEquals(
      httpRouting.methods(),
      [RequestMethod.GET, RequestMethod.HEAD],
    );
  },
});

Deno.test({
  name: "should add new methods",
  fn(): void {
    httpRouting.withMethods(RequestMethod.POST);
    assertEquals(httpRouting.methods(), [
      RequestMethod.GET,
      RequestMethod.HEAD,
      RequestMethod.POST,
    ]);
  },
});

Deno.test({
  name: "should check if route has given method",
  fn(): void {
    assertEquals(httpRouting.hasMethod(RequestMethod.GET), true);
    assertEquals(httpRouting.hasMethod(RequestMethod.POST), true);
    assertEquals(httpRouting.hasMethod(RequestMethod.HEAD), true);
    assertNotEquals(httpRouting.hasMethod(RequestMethod.PUT), true);
  },
});

Deno.test({
  name: "should check if a route with the given name exists",
  fn(): void {
    assertEquals(httpRouting.hasName(), false);
    httpRouting.withName("root:path");
    assertEquals(httpRouting.hasName(), true);
  },
});

Deno.test({
  name: "should check if a route with the given path exists",
  fn(): void {
    assertEquals(httpRouting.hasPath("/"), true);
    assertEquals(httpRouting.hasPath("/testing"), false);
  },
});

Deno.test({
  name: "should register new middleware",
  fn(): void {
    const middleware = async (
      Request: HttpRequest,
      ResponseWriter: HttpResponse,
    ) => Promise.resolve();
    httpRouting.withMiddleware(middleware);
    assertEquals(httpRouting.middlewares().length, 1);
  },
});

Deno.test({
  name: "should register a group of middleware",
  fn(): void {
    httpRouting.withMiddlewareGroups("testing", [
      async (Request: HttpRequest, ResponseWriter: HttpResponse) =>
        Promise.resolve(),
      async (Request: HttpRequest, ResponseWriter: HttpResponse) =>
        Promise.resolve(),
    ]);
    assertEquals(Array.isArray(httpRouting.middlewares()), true);
    assertEquals(httpRouting.middlewareGroups().length, 1);
    assertEquals(httpRouting.middlewareGroups()[0].handlers.length, 2);
  },
});
