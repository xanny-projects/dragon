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

import { Response } from "../deps.ts";
import { HttpMessage } from "./httpMessage.ts";
import { HttpError, HttpStatus } from "./httpError.ts";

/** Return respond using Response class instead of ServerRequest. */
export interface ServerResponse extends Response {
  respond(r: Response): Promise<void>;
}

/* "Back" is special-cased to provide Referrer support. */
export enum RedirectOptions {
  Back,
}

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
   * @param {ServerResponse} res
   */
  constructor(private readonly res: ServerResponse) {
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

  /**
   * Set Content-Type response header with `type`
   * when it does not contain a charset.
   *
   * Examples:
   *
   *    WithContentType(".html")
   *    WithContentType("html")
   *    WithContentType("json")
   *    WithContentType("application/json")
   *
   *
   * @param {string} value
   * @returns {Object}
   * @api public
   */
  public WithContentType(value: string): this {
    if (!this.HasHeader("Content-Type")) {
      this.WithHeader("Content-Type", value);
    }
    return this;
  }

  /**
   * Set the Last-Modified date using a string or a Date.
   *
   * Example :
   *
   *   WithLastModified(new Date())
   *   WithLastModified("2020-12-06")
   *
   * @param {Date} value
   * @returns {Object}
   * @api public
   */
  public WithLastModified(value: string | Date): this {
    if (typeof value === "string") {
      value = new Date(value);
    }
    this.WithHeader("Last-Modified", value.toUTCString());
    return this;
  }

  /**
   * Get the Last-Modified date in Date form, if it exists.
   *
   * @returns {Date}
   * @api public
   */
  public GetLastModified() {
    const date = this.GetHeader("Last-Modified");
    if (date) return new Date(date);
  }

  /**
   * Render `Html` template.
   *
   * @param {string} string
   * @param {unknown[]} values
   * @returns {string}
   * @api public
   */
  public Html(strings: string, ...values: unknown[]): string {
    const l = strings.length - 1;
    let html = "";

    for (let i = 0; i < l; i++) {
      let v = values[i];
      if (v instanceof Array) {
        v = v.join("");
      }
      const s = strings[i] + v;
      html += s;
    }
    html += strings[l];
    return html;
  }

  /**
   * Perform redirection to `url`.
   *
   * Examples:
   *
   *    Redirect("/")
   *    Redirect(RedirectOptions.Back)
   *
   * @param {string} url
   * @api public
   */
  public Redirect(url: string | RedirectOptions): void {
    // Location
    if (url === RedirectOptions.Back) url = this.GetHeader("Referrer") || "/";
    const statusCode = this.GetStatusCode();
    if (!statusCode || this.IsRedirectStatus(statusCode)) {
      this.WithStatus(HttpStatus.FOUND);
    }
    this.WithHeader("Location", url);
  }

  /**
   * Determines if a HTTP `Status` is a `RedirectStatus` (3XX).
   *
   * @param {number} status
   * @returns {boolean}
   * @api public
   */
  public IsRedirectStatus(status: number | HttpStatus): boolean {
    return [
      HttpStatus.MULTIPLECHOICES,
      HttpStatus.MOVEDPERMANENTLY,
      HttpStatus.FOUND,
      HttpStatus.SEEOTHER,
      HttpStatus.USEPROXY,
      HttpStatus.TEMPORARYREDIRECT,
      HttpStatus.PERMANENTREDIRECT,
    ].includes(status);
  }

  /**
   * Set response body.
   *
   * @param {string | Deno.Reader | Uint8Array | undefined } body
   * @returns {Object}
   * @api public
   */
  public WithBody(
    body?: string | Deno.Reader | Uint8Array | undefined,
  ): this | HttpError | void {
    if (typeof body === "undefined") {
      this.WithStatus(HttpStatus.NOCONTENT);
      this.RemoveHeader("Content-Type");
      this.RemoveHeader("Content-Length");
      this.RemoveHeader("Transfer-Encoding");
      return;
    }
    this.res.body = body;
    return this;
  }

  /**
   * Send a response.
   *
   * @returns {void}
   * @api public
   */
  public Send(): void {
    this.res.respond({
      body: this.res.body || "",
      headers: this.GetHeaders(),
      status: this.GetStatusCode(),
    });
  }
}
