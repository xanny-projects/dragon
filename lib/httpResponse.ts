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
import { HttpMessage } from "./httpMessage.ts";
import { HttpStatus } from "./httpError.ts";

/**
 * Representation of an outgoing, server-side response.
 *
 * Per the HTTP specification, this interface includes properties for
 * each of the following:
 *
 * - Status code
 * - Redirect
 * - Header
 *
 */
export class HttpResponse extends HttpMessage {

  /**
   * Construct a new, empty instance of the {@code HttpResponse} object.
   * @param {Response} res
   */
  constructor(private readonly res: Response) {
    super(res.headers || new Headers());
  }

  /**
   * Gets the response status code.
   * The status code is a 3-digit integer result code of the server's attempt
   * to understand and satisfy the request.
   *
   * @returns {number}
   * @api public
   */
  public GetStatusCode(): number {
    return this.res.status || HttpStatus.OK;
  }

  /**
   * Return an instance with the specified status code.
   *
   * @param {number | HttpStatus} statusCode
   * @returns {Object}
   * @see {@link http://tools.ietf.org/html/rfc7231#section-6}
   * @see {@link http://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml}
   * @api public
   */
  public WithStatus(statusCode: number | HttpStatus): this {
    this.res.status = statusCode;
    return this;
  }

  /**
   * Set Content-Length field to `n`.
   *
   * @param {number} n
   * @returns {Object}
   * @api public
   */
  public WithContentLength(n: number): this {
    this.WithHeader("Content-Length", n.toString());
    return this;
  }

}
