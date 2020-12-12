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

import { assert, Cookies, getCookies, ServerRequest } from "../deps.ts";
import { Header, HttpMessage } from "./httpMessage.ts";
import { BodyParser } from "./bodyParser.ts";

/** Query Payload */
interface QueryPayload {
  key: string;
  value: string;
}

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
  public defaultOffset: number = 2;

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
  public GetMethod(): string {
    return this.req.method;
  }

  /**
   * Get the URL (no query string) for the request.
   *
   * @returns {string}
   * @api public
   */
  public Url(): string {
    return this.UrlQuery().replace(/\?.+/i, "");
  }

  /**
   * Get the URL (with query string) for the request.
   *
   * @returns {string}
   * @api public
   */
  public UrlQuery(): string {
    const proto = this.Secure() ? "https" : "http";
    const url = `${proto}://${this.HostName()}${this.req.url}`;
    return url;
  }

  /**
   * Get The Path the route responds to.
   *
   * @returns {string}
   * @api public
   */
  public GetPath(): string {
    return this.req.url;
  }

  /**
   * Check if the request was an `_XMLHttpRequest_`.
   *
   * @returns {boolean}
   * @api public
   */
  public IsXHR(): boolean {
    const val = this.GetHeader("X-Requested-With") || "";
    return val.toLowerCase() === "xmlhttprequest";
  }

  /**
   * Return the `Host` header field to a hostname.
   *
   * @returns {string}
   * @api public
   */
  public HostName(): string {
    return this.GetHeader("X-Forwarded-Host") || this.GetHeader("Host") ||
      "0.0.0.0";
  }

  /**
   * Value must be valid IPv4.
   *
   * @returns {boolean}
   * @api public
   */
  public IsIpv4(): boolean {
    return /^(?:(?:^|\.)(?:2(?:5[0-5]|[0-4]\d)|1?\d?\d)){4}$/.test(
      this.HostName(),
    );
  }

  /**
   * Value must be valid IPv6.
   *
   * @returns {boolean}
   * @api public
   */
  public IsIpv6(): boolean {
    return /^((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4}))*::((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4}))*|((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4})){7}$/
      .test(this.HostName());
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
  public SubDomains(): string[] | null {
    if (this.IsIpv4() || this.IsIpv6()) {
      return this.HostName().split(".").splice(0, this.defaultOffset);
    }
    return null;
  }

  /**
   * Return content length.
   *
   * @returns {number | null}
   * @api public
   */
  public ContentLength(): number | null {
    return this.req.contentLength;
  }

  /**
   * Gets the body of the message.
   *
   * @returns {unknown}
   * @api public
   */
  public async GetBody(): Promise<unknown> {
    const parser = await BodyParser(this.req.body, this.GetContentType());
    return parser;
  }

  /**
   * Get the body of the message without parsing.
   *
   * @returns {Deno.Reader}
   * @api public
   */
  public GetBodyWithoutParser(): Deno.Reader {
    return this.req.body;
  }

  /**
   * Get Content type.
   *
   * @returns {string}
   * @api public
   */
  public GetContentType(): string | null {
    return this.GetHeader(Header.ContentType);
  }

  /**
   * Return the protocol string "http" or "https".
   *
   * @returns {string}
   * @api public
   */
  public GetProtocol(): string {
    return this.req.proto;
  }

  /**
   * Retrieve query string argument.
   *
   * @returns {string[]}
   * @api public
   */
  public GetQueryParam(query: string): string | null {
    return new URL(this.UrlQuery()).searchParams.get(query);
  }

  /**
   * Retrieve query string arguments.
   *
   * @returns {QueryPayload[]}
   * @api public
   */
  public GetQueryParams(): Array<QueryPayload> {
    const listQueries: QueryPayload[] = [];
    const queries = new URL(this.UrlQuery()).searchParams;
    queries.forEach((value, key) => {
      listQueries.push({ value, key });
    });
    return listQueries;
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
  public Secure(): boolean {
    return /^https/i.test(this.GetProtocol());
  }

  /**
   * Retrieves cookies sent by the client to the server.
   *
   * @returns {Cookies}
   * @api public
   */
  public GetCookie(): Cookies {
    return getCookies(this.req);
  }

  /**
   * Return an instance with the specified cookies.
   *
   * For example:
   *
   *   WithCookie("full=of; tasty=chocolate")
   *
   * @returns {string}
   * @api public
   */
  public WithCookie(value: string): this {
    assert(typeof value === "string", "Cookie must be string");
    this.req.headers.set("Cookie", value);
    return this;
  }
}
