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

import { Cookies, getCookies, ServerRequest } from "../deps.ts";
import { ParameterPayload, QueryPayload } from "./types.d.ts";
import { Header, HttpMessage } from "./httpMessage.ts";
import { BodyParser } from "./bodyParser.ts";

/**
 * Representation of an outgoing, client-side request.
 *
 * Per the HTTP specification, this class includes properties for
 * each of the following:
 *
 * - HTTP method
 * - URI
 * - Headers
 * - Message body
 *
 */
export class HttpRequest extends HttpMessage {
  /** /
   * For example, if the domain is "deno.land.example.com":
   * This defaults to `2`
   */
  private _defaultOffset: number = 2;

  /**
   * The array of matched parameters.
   *
   * @var {string[]}
   */
  private _parameters?: ParameterPayload = {};

  public set parameters(params: ParameterPayload | undefined) {
    this._parameters = params;
  }

  /**
   * Construct a new, empty instance of the {@code HttpRequest} object.
   * @param {ServerRequest} req
   */
  constructor(private readonly req: ServerRequest) {
    super(req.headers);
  }

  /**
   * Retrieves the HTTP method of the request.
   *
   * @return {string}
   * @api public
   */
  public method(): string {
    return this.req.method;
  }

  /**
   * Get the URL (no query string) for the request.
   *
   * @returns {string}
   * @api public
   */
  public url(): string {
    return this.urlQuery().replace(/\?.+/i, "");
  }

  /**
   * Get the URL (with query string) for the request.
   *
   * @returns {string}
   * @api public
   */
  public urlQuery(): string {
    const proto = this.secure() ? "https" : "http";
    const url = `${proto}://${this.hostName()}${this.req.url}`;
    return url;
  }

  /**
   * Get The Path the route responds to.
   *
   * @returns {string}
   * @api public
   */
  public path(): string {
    return this.req.url;
  }

  /**
   * Check if the request was an `_XMLHttpRequest_`.
   *
   * @returns {boolean}
   * @api public
   */
  public isXHR(): boolean {
    const val = this.header("X-Requested-With") || "";
    return val.toLowerCase() === "xmlhttprequest";
  }

  /**
   * Return the `Host` header field to a hostname.
   *
   * @returns {string}
   * @api public
   */
  public hostName(): string {
    return this.header("X-Forwarded-Host") || this.header("Host") ||
      "0.0.0.0";
  }

  /**
   * Value must be valid IPv4.
   *
   * @returns {boolean}
   * @api public
   */
  public isIpv4(): boolean {
    return /^(?:(?:^|\.)(?:2(?:5[0-5]|[0-4]\d)|1?\d?\d)){4}$/.test(
      this.hostName(),
    );
  }

  /**
   * Value must be valid IPv6.
   *
   * @returns {boolean}
   * @api public
   */
  public isIpv6(): boolean {
    return /^((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4}))*::((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4}))*|((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4})){7}$/
      .test(this.hostName());
  }

  /**
   * Return subdomains as an array.
   *
   * Subdomains are the dot-separated parts of the host before the main domain of the app.
   * By default, the domain of the app is assumed to be the last two parts of the host.
   *
   * @returns {string[] | null}
   * @api public
   */
  public subDomains(): string[] | null {
    if (this.isIpv4() || this.isIpv6()) {
      return this.hostName().split(".").splice(0, this._defaultOffset);
    }
    return null;
  }

  /**
   * Return content length.
   *
   * @returns {number | null}
   * @api public
   */
  public contentLength(): number | null {
    return this.req.contentLength;
  }

  /**
   * Gets the body of the message.
   *
   * @returns {unknown}
   * @api public
   */
  public async body(): Promise<unknown> {
    const parser = await BodyParser(this.req.body, this.contentType());
    return parser;
  }

  /**
   * Get the body of the message without parsing.
   *
   * @returns {Deno.Reader}
   * @api public
   */
  public bodyWithoutParser(): Deno.Reader {
    return this.req.body;
  }

  /**
   * Get Content type.
   *
   * @returns {string}
   * @api public
   */
  public contentType(): string | null {
    return this.header(Header.ContentType);
  }

  /**
   * Return the protocol string "http" or "https".
   *
   * @returns {string}
   * @api public
   */
  public schemes(): string {
    return this.req.proto;
  }

  /**
   * Retrieve query string argument.
   *
   * @returns {string[]}
   * @api public
   */
  public queryParam(query: string): string | null {
    return new URL(this.urlQuery()).searchParams.get(query);
  }

  /**
   * Retrieve query string arguments.
   *
   * @returns {QueryPayload[]}
   * @api public
   */
  public queryParams(): Array<QueryPayload> {
    const listQueries: QueryPayload[] = [];
    const queries = new URL(this.urlQuery()).searchParams;
    queries.forEach((value, key) => {
      listQueries.push({ value, key });
    });
    return listQueries;
  }

  /**
   * Retrieve parameters from the route.
   *
   * @returns {ParameterPayload}
   * @api public
   */
  public params(): ParameterPayload {
    return this._parameters || {};
  }

  /**
   * Verify if the request is secure.
   *
   * Short-hand for:
   *
   *    req.proto === 'https'
   *
   * @returns {boolean}
   * @api public
   */
  public secure(): boolean {
    return /^https/i.test(this.schemes());
  }

  /**
   * Retrieves cookies sent by the request.
   *
   * @returns {Cookies}
   * @api public
   */
  public cookie(): Cookies {
    return getCookies(this.req);
  }
}
