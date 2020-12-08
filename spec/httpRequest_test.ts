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

import { assert, assertEquals } from "../deps.ts";
import { HttpError } from "../lib/httpError.ts";
import { RequestMethod } from "../lib/httpRouting.ts";
import { HttpRequest } from "../lib/httpRequest.ts";

interface ServerRequest {
  url: string;
  method: string;
  proto: string;
  body: string | Deno.Reader | Uint8Array;
  headers: Headers;
  respond(): Promise<void>;
}

/**
 * Mocking request server. Inspired by oak framework.
 *
 * @param {string} url
 * @param {string} host
 * @param {RequestMethod} method
 * @param {string} proto
 * @param {object} headerVal
 * @returns {ServerRequest}
 * @see {@link https://github.com/oakserver/oak/blob/main/request_test.ts}
 */
function MockingServerRequest(
  url = "/testing",
  host = "localhost",
  method = RequestMethod.GET,
  proto = "HTTP/1.1",
  body = "Hello xanny",
  headerVal = {},
): ServerRequest {
  // init headers
  const headers = new Headers();
  headers.set("host", host);
  for (const [key, value] of Object.entries(headerVal)) {
    headers.set(key, value as string);
  }
  return {
    headers,
    method,
    url,
    proto,
    body,
    async respond() {},
  };
}

// Simulate HttpRequest injection.
const httpRequest = new HttpRequest(MockingServerRequest() as any);

Deno.test({
  name: "should return default offset",
  fn(): void {
    assertEquals(httpRequest.defaultOffset, 2);
  },
});
