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

import { Response, encode } from "../deps.ts";
import { HttpMessage } from "./httpMessage.ts";
import { HttpStatus } from "./httpError.ts";

/** Return respond using Response class instead of ServerRequest. */
export interface ServerResponse extends Response {
  respond(r: Response): Promise<void>;
}

/* "Back" is special-cased to provide Referrer support. */
export enum RedirectOptions {
  Back,
}

/** Common Media types  */
export enum MediaTypes {
  MD = "text/markdown",
  HTML = "text/html",
  HTM = "text/html",
  JSON = "application/json",
  MAP = "application/json",
  TXT = "text/plain",
  TS = "text/typescript",
  TSX = "text/tsx",
  JS = "application/javascript",
  JSX = "text/jsx",
  GZIP = "application/gzip",
  CSS = "text/css",
  WASM = "application/wasm",
  MJS = "application/javascript",
  FORM = "application/x-www-form-urlencoded",
  MULTIPARTFORM = "multipart/form-data"
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
  public body?: Uint8Array | Deno.Reader | string;

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
   * Return Content-Type response header with.
   *
   * @returns {string | null}
   * @api public
   */
  public GetContentType(): string | null {
    return this.GetHeader("Content-Type");
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
   * Example:
   *
   *    Html`<b>Hello Xanny</b>`
   *
   * @param {TemplateStringsArray} string
   * @param {unknown[]} values
   * @returns {string}
   * @api public
   */
  public Html(strings: TemplateStringsArray, ...values: unknown[]): this {
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
    this.body = encode(html);
    return this;
  }

  /**
   * Return `JSON` responses.
   *
   * @param {Record<string, any>} value
   * @returns {this}
   */
  public Json(value: Record<string, any>): this {
    this.WithContentType(MediaTypes.JSON);
    this.body = encode(
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
  ): this {
    if (typeof body === "undefined") {
      this.WithStatus(HttpStatus.NOCONTENT);
      this.RemoveHeader("Content-Type");
      this.RemoveHeader("Content-Length");
      this.RemoveHeader("Transfer-Encoding");
    }
    this.body = body || "";
    return this;
  }

  /**
   * Return a response.
   *
   * @returns {void}
   * @api public
   */
  public Return(): void {
    this.res.respond({
      body: this.body,
      headers: this.GetHeaders(),
      status: this.GetStatusCode(),
    });
  }
}
