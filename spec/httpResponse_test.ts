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
  assertNotEquals,
  assertThrows,
  DenoStdInternalError,
} from "../deps.ts";
import { HttpResponse } from "../lib/httpResponse.ts";
import { HttpError } from "../lib/httpError.ts";
import { MediaTypes } from "../lib/httpMessage.ts";
import { ServerResponse } from "../lib/types.d.ts";

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
  trailers?: () => Promise<Headers> | Headers,
): ServerResponse {
  return {
    status,
    headers,
    body,
    respond: () => Promise.resolve(),
  };
}

// Simulate HttpResponse injection.
const httpResponse = new HttpResponse(MockingServerRequest() as any);

Deno.test({
  name: "should return status code",
  fn(): void {
    assertEquals(httpResponse.statusCode(), 200);
  },
});

Deno.test({
  name: "should set status code",
  fn(): void {
    const setStatusCode = httpResponse.withStatus(300);
    assertEquals(setStatusCode.statusCode(), 300);
  },
});

Deno.test({
  name: "should set Content-Type",
  fn(): void {
    const setContentType = httpResponse.withContentType(MediaTypes.HTML);
    assertEquals(setContentType.contentType(), MediaTypes.HTML);
  },
});

Deno.test({
  name: "should set the Last-Modified date using a string or a Date",
  fn(): void {
    const setContentType = httpResponse.withLastModified("10/02/2020");
    assertEquals(setContentType.lastModified(), new Date("10/02/2020"));
  },
});

Deno.test({
  name: "should render `HTML` template",
  fn(): void {
    const setTemplate = httpResponse.html`<h1>Xanny Render Testing!</h1>`;
    assertNotEquals(setTemplate.body, null);
    assertEquals(
      setTemplate.body,
      new Uint8Array([
        60,
        104,
        49,
        62,
        88,
        97,
        110,
        110,
        121,
        32,
        82,
        101,
        110,
        100,
        101,
        114,
        32,
        84,
        101,
        115,
        116,
        105,
        110,
        103,
        33,
        60,
        47,
        104,
        49,
        62,
      ]),
    );
  },
});

Deno.test({
  name: "should render `Json`",
  fn(): void {
    const setJson = httpResponse.json({
      project: "Xanny",
    });
    assertEquals(typeof setJson.body, "object");
    assertEquals(
      setJson.body,
      new Uint8Array([
        123,
        34,
        112,
        114,
        111,
        106,
        101,
        99,
        116,
        34,
        58,
        34,
        88,
        97,
        110,
        110,
        121,
        34,
        125,
      ]),
    );
  },
});

Deno.test({
  name: "should if a HTTP `Status` is a `RedirectStatus` ",
  fn(): void {
    assertEquals(httpResponse.isRedirectStatus(301), true);
    assertEquals(httpResponse.isRedirectStatus(302), true);
    assertNotEquals(httpResponse.isRedirectStatus(400), true);
    assertNotEquals(httpResponse.isRedirectStatus(200), true);
    assertNotEquals(httpResponse.isRedirectStatus(500), true);
  },
});

Deno.test({
  name: "should throw an HTTP error",
  fn(): void {
    assertThrows(
      (): void => {
        httpResponse.abort(403);
      },
      HttpError,
      "Something went wrong",
    );
  },
});

Deno.test({
  name: "should set cookie value",
  fn(): void {
    httpResponse.withCookie("Max-Age=2592000");
    assertNotEquals(httpResponse.hasHeader("Cookie"), "Max-Age=2592000");
    assertThrows(
      (): void => {
        httpResponse.withCookie(null as any);
      },
      DenoStdInternalError,
      "Cookie must be string",
    );
  },
});
