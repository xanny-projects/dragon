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
  name: "Retrieves all message header values",
  fn(): void {
    assert(httpMessage.GetHeaders() instanceof Headers);
    assertEquals(httpMessage.GetHeaders(), header);
  },
});

Deno.test({
  name: "Retrieve specific header by the the given case-sensitive name",
  fn(): void {
    assertEquals(httpMessage.GetHeader("X-Powered-By"), "Deno");
    assertEquals(httpMessage.GetHeader("Host"), null);
  },
});

Deno.test({
  name: "Checks if a header exists by the given case-sensitive name",
  fn(): void {
    assertEquals(httpMessage.HasHeader("X-Powered-By"), true);
    assertEquals(httpMessage.HasHeader("Host"), false);
  },
});

Deno.test({
  name: "Remove given header if exists",
  fn(): void {
    assertEquals(httpMessage.RemoveHeader("X-Powered-By"), httpMessage);
    assertThrows(
      (): void => {
        assertEquals(httpMessage.RemoveHeader("Host"), httpMessage);
      },
      HttpError,
      "Header Host does not exists",
    );
  },
});
