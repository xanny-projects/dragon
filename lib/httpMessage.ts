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

import { assert } from "../deps.ts";
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

  /**
   * Retrieves a message header value by the given case-sensitive name.
   * If the header does not appear in the message, this method MUST return null.
   *
   * @param {string} name
   * @returns {string | null}
   * @api public
   */
  public GetHeader(name: string): string | null {
    return this.headers.get(name);
  }

  /**
   * Checks if a header exists by the given case-sensitive name.
   *
   * @param {string} name
   * @returns {boolean}
   */
  public HasHeader(name: string):boolean {
    return this.headers.has(name);
  }

  /**
   * Return an instance with the provided value replacing the specified header.
   *
   * @param {string} name
   * @param {string} value
   * @returns {Object}
   * @api public
   */
  public WithHeader(name: string, value: string): this {
    // Header validation.
    assert(name === null, "Header name must not be null");
    if (this.headers.has(name)) {
      throw new HttpError(`Header ${name} already exists`);
    }
    this.headers.set(name, value);
    return this;
  }

}
