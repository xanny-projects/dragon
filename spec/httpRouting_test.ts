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

import {
  assertEquals,
  assertMatch,
  assertNotEquals,
  assertThrows,
} from "../deps.ts";
import { HttpRouting, RequestMethod } from "../lib/httpRouting.ts";

// Simulate HttpRouting injection.
const httpRouting = new HttpRouting(
  "/",
  [RequestMethod.GET],
  async () => Promise.resolve(),
);

Deno.test({
  name: "should push `HEAD` if the method is GET",
  fn(): void {
    assertEquals(httpRouting.methods, [RequestMethod.GET, RequestMethod.HEAD]);
  },
});

Deno.test({
  name: "should add new methods",
  fn(): void {
    httpRouting.WithMethods(RequestMethod.POST);
    assertEquals(httpRouting.methods, [
      RequestMethod.GET,
      RequestMethod.HEAD,
      RequestMethod.POST,
    ]);
  },
});

Deno.test({
  name: "should check if route has given method",
  fn(): void {
    assertEquals(httpRouting.HasMethod(RequestMethod.GET), true);
    assertEquals(httpRouting.HasMethod(RequestMethod.POST), true);
    assertEquals(httpRouting.HasMethod(RequestMethod.HEAD), true);
    assertNotEquals(httpRouting.HasMethod(RequestMethod.PUT), true);
  },
});
