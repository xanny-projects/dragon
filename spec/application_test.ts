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

import { assertEquals, assertThrows } from "../deps.ts";
import { Application, RegistredRoutes } from "../lib/application.ts";
import { HttpError } from "../lib/httpError.ts";
import { HttpRequest } from "../lib/httpRequest.ts";
import { HttpResponse } from "../lib/httpResponse.ts";

// Simulate Application  injection.
const application = new Application();

Deno.test({
  name: "should init route with default `/` path",
  fn(): void {
    application.routes({ maxRoutes: 1 });
    assertEquals(RegistredRoutes.length, 1);
    assertEquals(RegistredRoutes[0].hasMethod("GET"), false);
    assertEquals(RegistredRoutes[0].hasPath("/"), true);
  },
});

Deno.test({
  name: "should throw error if the maxRoutes > currentRoute",
  fn(): void {
    assertThrows(
      (): void => {
        const r = application.routes({ maxRoutes: 0 });
        r.withPath("/graphql")
          .handleFunc(
            async function (
              Request: HttpRequest,
              ResponseWriter: HttpResponse,
            ): Promise<any> {},
          );
      },
      HttpError,
      "Maximum allowed number of routes: 0",
    );
  },
});
