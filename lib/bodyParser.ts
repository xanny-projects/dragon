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

import { decode } from "../deps.ts";
import { MediaTypes } from "./httpResponse.ts";

/**
 * Extract the entire body portion of an incoming request stream and exposes it
 * on GetBody() method.
 *
 * @param {Deno.Reader} body
 * @param {string | MediaTypes} contentType
 * @returns {unknown}
 * @api public
 */
export async function BodyParser(
  body: Deno.Reader,
  contentType: string | MediaTypes,
): Promise<unknown> {
  var data: Record<string, unknown> = {};
  switch (true) {
    case contentType.includes(MediaTypes.JSON):
      data = JSON.parse(
        await decode(await Deno.readAll(body)),
      );
      break;
    case contentType.includes(MediaTypes.FORM):
      for (
        const [k, v] of new URLSearchParams(
          decode(await Deno.readAll(body)),
        )
      ) {
        data[k] = v;
      }
      break;
  }
  return data;
}
