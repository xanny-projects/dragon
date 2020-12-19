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

import { HttpError } from "./httpError.ts";

/**
 * HTTP headers let the client and the server pass additional information with an HTTP request or response.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers}
 */
export enum Header {
  AcceptEncoding = "Accept-Encoding",
  Allow = "Allow",
  Authorization = "Authorization",
  ContentDisposition = "Content-Disposition",
  ContentEncoding = "Content-Encoding",
  ContentLength = "Content-Length",
  ContentType = "Content-Type",
  Cookie = "Cookie",
  SetCookie = "Set-Cookie",
  IfModifiedSince = "If-Modified-Since",
  LastModified = "Last-Modified",
  Location = "Location",
  Upgrade = "Upgrade",
  Vary = "Vary",
  WWWAuthenticate = "WWW-Authenticate",
  XForwardedFor = "X-Forwarded-For",
  XForwardedProto = "X-Forwarded-Proto",
  XForwardedProtocol = "X-Forwarded-Protocol",
  XForwardedSsl = "X-Forwarded-Ssl",
  XUrlScheme = "X-Url-Scheme",
  XHTTPMethodOverride = "X-HTTP-Method-Override",
  XRealIP = "X-Real-IP",
  XRequestID = "X-Request-ID",
  XRequestedWith = "X-Requested-With",
  Server = "Server",
  Origin = "Origin", // Access control
  AccessControlRequestMethod = "Access-Control-Request-Method",
  AccessControlRequestHeaders = "Access-Control-Request-Headers",
  AccessControlAllowOrigin = "Access-Control-Allow-Origin",
  AccessControlAllowMethods = "Access-Control-Allow-Methods",
  AccessControlAllowHeaders = "Access-Control-Allow-Headers",
  AccessControlAllowCredentials = "Access-Control-Allow-Credentials",
  AccessControlExposeHeaders = "Access-Control-Expose-Headers",
  AccessControlMaxAge = "Access-Control-Max-Age", // Security
  StrictTransportSecurity = "Strict-Transport-Security",
  XContentTypeOptions = "X-Content-Type-Options",
  XXSSProtection = "X-XSS-Protection",
  XFrameOptions = "X-Frame-Options",
  ContentSecurityPolicy = "Content-Security-Policy",
  ContentSecurityPolicyReportOnly = "Content-Security-Policy-Report-Only",
  XCSRFToken = "X-CSRF-Token",
  ReferrerPolicy = "Referrer-Policy",
}

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
   * Checks if a header exists by the given non case-sensitive name.
   *
   * @param {string} name
   * @returns {boolean}
   */
  public HasHeader(name: string): boolean {
    return this.headers.has(name);
  }

  /**
   * Remove given header if exists.
   *
   * @param {string} name
   * @returns {Object}
   * @api public
   */
  public RemoveHeader(name: string): this | HttpError {
    if (!this.headers.has(name)) {
      throw new HttpError(`Header ${name} does not exists`);
    }
    this.headers.delete(name);
    return this;
  }

  /**
   * Add a series of headers to the response before sending it back to the user.
   *
   * @param {string} name
   * @param {string} value
   * @returns {Object}
   * @api public
   */
  public WithHeader(name: string, value: string): this {
    if (this.headers.has(name)) {
      throw new HttpError(`Header ${name} already exists`);
    }
    this.headers.set(name, value);
    return this;
  }
}
