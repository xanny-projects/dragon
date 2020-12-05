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

import { assert, Response } from "../deps.ts";
import { HttpError } from "./httpError.ts";

/**
 * HTTP messages consist of requests from a client to a server and responses.
 * from a server to a client. This interface defines the methods common to each.
 *
 * @see {@link http://www.ietf.org/rfc/rfc7230.txt}
 * @see {@link http://www.ietf.org/rfc/rfc7231.txt}
 */
export class HttpMessage {

  /**
   * Construct a new, empty instance of the {@code HttpMessage} object.
   * @param {Headers} headers
   */
  constructor(private readonly headers: Headers) {}

  /**
   * Retrieves all message header values.
   *
   * @returns {Headers}
   * @api public
   */
  public GetHeaders(): Headers {
    return this.headers;
  }

}
