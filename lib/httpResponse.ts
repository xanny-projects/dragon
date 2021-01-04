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

import { assert, encode } from "../deps.ts";
import { ServerResponse } from "./types.d.ts";
import { HttpMessage, MediaTypes } from "./httpMessage.ts";
import { HttpError, HttpStatus } from "./httpError.ts";

/* "Back" is special-cased to provide Referrer support. */
export enum RedirectOptions {
  Back = "back",
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
   * Send the content of the response.
   * @var
   */
  private _body?: Uint8Array | Deno.Reader | string;

  public get body(): Uint8Array | Deno.Reader | string | undefined {
    return this._body;
  }

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
  public statusCode(): number {
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
  public withStatus(statusCode: number | HttpStatus): this {
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
  public withContentLength(n: number): this {
    this.withHeader("Content-Length", n.toString());
    return this;
  }

  /**
   * Set Content-Type response header with `type`
   * when it does not contain a charset.
   *
   * Examples:
   *
   *    withContentType(".html")
   *    withContentType("html")
   *    withContentType("json")
   *    withContentType("application/json")
   *
   *
   * @param {string} value
   * @returns {Object}
   * @api public
   */
  public withContentType(value: string): this {
    if (!this.hasHeader("Content-Type")) {
      this.withHeader("Content-Type", value);
    }
    return this;
  }

  /**
   * Return Content-Type response header with.
   *
   * @returns {string | null}
   * @api public
   */
  public contentType(): string | null {
    return this.header("Content-Type");
  }

  /**
   * Rise an HTTP error from the server.
   * Optionally, you may provide the response text.
   *
   * @param {number | HttpStatus} status
   * @param {string} message
   * @return {HttpError}
   * @api public
   */
  public abort(status: number | HttpStatus, message?: string): HttpError {
    throw new HttpError(message || "Something went wrong", status);
  }

  /**
   * Set the Last-Modified date using a string or a Date.
   *
   * Example :
   *
   *   withLastModified(new Date())
   *   withLastModified("2020-12-06")
   *
   * @param {Date} value
   * @returns {Object}
   * @api public
   */
  public withLastModified(value: string | Date): this {
    if (typeof value === "string") {
      value = new Date(value);
    }
    this.withHeader("Last-Modified", value.toUTCString());
    return this;
  }

  /**
   * Get the Last-Modified date in Date form, if it exists.
   *
   * @returns {Date}
   * @api public
   */
  public lastModified() {
    const date = this.header("Last-Modified");
    if (date) return new Date(date);
  }

  /**
   * Redirect the client to another URL with optional response `status` defaulting to 302.
   *
   * Examples:
   *
   *   redirect('/deno/space')
   *
   * @param {string|RedirectOptions} url
   * @param {number|HttpStatus} status
   * @returns {void}
   * @api public
   */
  public redirect(
    url: string | RedirectOptions,
    status = HttpStatus.FOUND,
  ): void {
    // "back" is an alias for the referrer.
    if (url == RedirectOptions.Back) {
      url = this.header("Referrer") || "/";
    }
    // set status Permanent: (301 and 308), Temporary: (302, 303, and 307).
    this.withStatus(HttpStatus.FOUND);
    // set location.
    this.withHeader("Location", encodeURI(url));
    return this.send();
  }

  /**
   * Render `html` template.
   *
   * Example:
   *
   *    html`<b>Hello Dragon</b>`
   *
   * @param {TemplateStringsArray} string
   * @param {unknown[]} values
   * @returns {string}
   * @api public
   */
  public html(strings: TemplateStringsArray, ...values: unknown[]): this {
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
    // encode html.
    this._body = encode(html);
    return this;
  }

  /**
   * Return `json` responses.
   *
   * @param {Record<string, any>} value
   * @returns {this}
   */
  public json(value: Record<string, any>): this {
    this.withContentType(MediaTypes.JSON);
    this._body = encode(
      typeof value === "object" ? JSON.stringify(value) : value,
    );
    return this;
  }

  /**
   * Determines if a HTTP `Status` is a `RedirectStatus` (3XX).
   *
   * @param {number} status
   * @returns {boolean}
   * @api public
   */
  public isRedirectStatus(status: number | HttpStatus): boolean {
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
  public withBody(
    body?: string | Deno.Reader | Uint8Array | undefined,
  ): this {
    if (typeof body === "undefined") {
      this.withStatus(HttpStatus.NOCONTENT);
      this.delHeader("Content-Type");
      this.delHeader("Content-Length");
      this.delHeader("Transfer-Encoding");
    }
    this._body = body || "";
    return this;
  }

  /**
   * Return an instance with the specified cookies.
   *
   * For example:
   *
   *   withCookie("full=of; tasty=chocolate")
   *
   * @returns {string}
   * @api public
   */
  public withCookie(value: string): this {
    assert(typeof value === "string", "Cookie must be string");
    this.res.headers?.set("Cookie", value);
    return this;
  }

  /**
   * Return a response.
   *
   * @returns {void}
   * @api public
   */
  public send(): void {
    this.res.respond({
      body: this._body,
      headers: this.headers(),
      status: this.statusCode(),
    });
  }
}
