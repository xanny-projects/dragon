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

import { assertThrows, assertEquals, assertMatch, assertNotEquals } from "../deps.ts";
import { HttpResponse, MediaTypes, ServerResponse } from "../lib/httpResponse.ts";

/**
 * Mocking request server.
 *
 * @param {number} status
 * @param {Headers} headers
 * @param {Uint8Array | Deno.Reader | string} body
 * @param {Function} trailers
 * @returns {ServerResponse}
 */
function MockingServerRequest(
  status = 200,
  headers = new Headers(),
  body = "Hello Xanny",
  trailers?: () => Promise<Headers> | Headers
): ServerResponse {
  return {
    status,
    headers,
    body,
    respond:() => Promise.resolve()
  }
}

// Simulate HttpResponse injection.
const httpResponse = new HttpResponse(MockingServerRequest() as any);

Deno.test({
  name: "should return status code",
  fn(): void {
    assertEquals(httpResponse.GetStatusCode(), 200);
  },
});

Deno.test({
  name: "should set status code",
  fn(): void {
    const setStatusCode = httpResponse.WithStatus(300);
    assertEquals(setStatusCode.GetStatusCode(), 300);
  },
});

Deno.test({
  name: "should set Content-Type",
  fn(): void {
    const setContentType = httpResponse.WithContentType(MediaTypes.HTML);
    assertEquals(setContentType.GetContentType(), MediaTypes.HTML);
  },
});

Deno.test({
  name: "should set the Last-Modified date using a string or a Date",
  fn(): void {
    const setContentType = httpResponse.WithLastModified("10/02/2020");
    assertEquals(setContentType.GetLastModified(), new Date("10/02/2020"));
  },
});

Deno.test({
  name: "should render `HTML` template",
  fn(): void {
    const setTemplate = httpResponse.Html`<h1>Xanny Render Testing!</h1>`
    assertNotEquals(setTemplate.body, null);
    assertEquals(setTemplate.body, new Uint8Array([
      60, 104,  49,  62,  88,  97, 110, 110,
      121,  32,  82, 101, 110, 100, 101, 114,
      32,  84, 101, 115, 116, 105, 110, 103,
      33,  60,  47, 104,  49,  62
    ]));
  },
});
