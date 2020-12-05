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

import { ServerRequest, assert } from "../deps.ts";
import { HttpError } from "./httpError.ts";

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
export class HttpRequest {

  /** /
   * For example, if the domain is "deno.land.example.com":
   * This defaults to `2`
   */
  private defaultOffset:number = 2;

  /**
   * Construct a new, empty instance of the {@code HttpRequest} object.
   * @param {ServerRequest} req
   */
  constructor(private readonly req: ServerRequest) {}

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
   * Retrieves all message header values.
   *
   * @returns {Headers}
   * @api public
   */
   public GetHeaders(): Headers {
    return this.req.headers;
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
    return this.req.headers.get(name);
   }

  /**
   * Return an instance with the provided value replacing the specified header.
   *
   * @param {string} name
   * @param {string} value
   * @returns {Object}
   * @api public
   */
   public WithHeader(name:string, value:string): this {
    // Header validation.
    assert(name === null , "Header name must not be null");
    if(this.req.headers.has(name)) {
      throw new HttpError(`Header ${name} already exists`);
    }
    this.req.headers.set(name, value);
    return this;
   }

  /**
   * Get the URL (no query string) for the request.
   *
   * @returns {string}
   * @api public
   */
  public Url(): string {
    return this.req.url.replace(/\?.+/i,"");
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
    return this.GetHeader("X-Forwarded-Host") || this.GetHeader("Host") || "0.0.0.0";
  }

  /**
   * Value must be valid IPv4.
   *
   * @returns {boolean}
   * @api public
   */
  public IsIpv4(): boolean {
    return /^(?:(?:^|\.)(?:2(?:5[0-5]|[0-4]\d)|1?\d?\d)){4}$/.test(this.HostName());
  }

   /**
   * Value must be valid IPv6.
   *
   * @returns {boolean}
   * @api public
   */
  public IsIpv6(): boolean {
    return /^((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4}))*::((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4}))*|((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4})){7}$/.test(this.HostName());
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
    if(this.IsIpv4() || this.IsIpv6()){
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
   * @returns {Deno.Reader}
   * @api public
   */
  public GetBody(): Deno.Reader {
    return this.req.body;
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

}
