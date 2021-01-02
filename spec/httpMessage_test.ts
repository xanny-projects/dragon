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

import { assert, assertEquals, assertThrows } from "../deps.ts";
import { HttpError } from "../lib/httpError.ts";
import { HttpMessage } from "../lib/httpMessage.ts";

// Simulate header injection.
const header = new Headers();
header.set("X-Powered-By", "Deno");
const httpMessage = new HttpMessage(header);

Deno.test({
  name: "should retrieves all message header values",
  fn(): void {
    assert(httpMessage.headers() instanceof Headers);
    assertEquals(httpMessage.headers(), header);
  },
});

Deno.test({
  name: "should retrieve specific header by the the given case-sensitive name",
  fn(): void {
    assertEquals(httpMessage.header("X-Powered-By"), "Deno");
    assertEquals(httpMessage.header("Host"), null);
  },
});

Deno.test({
  name: "should checks if a header exists by the given case-sensitive name",
  fn(): void {
    assertEquals(httpMessage.header("X-Powered-By"), "Deno");
    assertEquals(httpMessage.header("Host"), null);
  },
});

Deno.test({
  name: "should remove given header if exists",
  fn(): void {
    assertEquals(httpMessage.delHeader("X-Powered-By"), httpMessage);
    assertThrows(
      (): void => {
        assertEquals(httpMessage.delHeader("Host"), httpMessage);
      },
      HttpError,
      "Header Host does not exists",
    );
  },
});

Deno.test({
  name: "should add new header value",
  fn(): void {
    assertEquals(
      httpMessage.withHeader(
        "Host",
        "https://github.com/xanny-projects/Dragon",
      ),
      httpMessage,
    );
  },
});
