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

/** External dependencies that Dragon depends upon */
export {
  serve as DefaultServer,
  ServerRequest,
  serveTLS as ServerTLS,
} from "https://deno.land/std@0.82.0/http/server.ts";
export { decode, encode } from "https://deno.land/std@0.82.0/encoding/utf8.ts";
export { getCookies } from "https://deno.land/std@0.82.0/http/cookie.ts";
export {
  assertEquals,
  assertMatch,
  assertNotEquals,
  assertThrows,
} from "https://deno.land/std@0.82.0/testing/asserts.ts";
export {
  assert,
  DenoStdInternalError,
} from "https://deno.land/std@0.82.0/_util/assert.ts";
export { StringReader } from "https://deno.land/std@0.82.0/io/mod.ts";

/**
 * Export Types.
 *
 * @see {@link https://github.com/microsoft/TypeScript/issues/28481}
 */
export type { Response } from "https://deno.land/std@0.82.0/http/server.ts";
export type { Cookies } from "https://deno.land/std@0.82.0/http/cookie.ts";
