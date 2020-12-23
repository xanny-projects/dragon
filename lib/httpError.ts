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

/** HTTP status codes */
export enum HttpStatus {
  /** RFC 7231, 6.2.1 */
  CONTINUE = 100,
  /** RFC 7231, 6.2.2 */
  SWITCHINGPROTOCOLS = 101,
  /** RFC 2518, 10.1 */
  PROCESSING = 102,
  /** RFC 8297 **/
  EARLYHINTS = 103,
  /** RFC 7231, 6.3.1 */
  OK = 200,
  /** RFC 7231, 6.3.2 */
  CREATED = 201,
  /** RFC 7231, 6.3.3 */
  ACCEPTED = 202,
  /** RFC 7231, 6.3.4 */
  NONAUTHORITATIVEINFO = 203,
  /** RFC 7231, 6.3.5 */
  NOCONTENT = 204,
  /** RFC 7231, 6.3.6 */
  RESETCONTENT = 205,
  /** RFC 7233, 4.1 */
  PARTIALCONTENT = 206,
  /** RFC 4918, 11.1 */
  MULTISTATUS = 207,
  /** RFC 5842, 7.1 */
  ALREADYREPORTED = 208,
  /** RFC 3229, 10.4.1 */
  IMUSED = 226,

  /** RFC 7231, 6.4.1 */
  MULTIPLECHOICES = 300,
  /** RFC 7231, 6.4.2 */
  MOVEDPERMANENTLY = 301,
  /** RFC 7231, 6.4.3 */
  FOUND = 302,
  /** RFC 7231, 6.4.4 */
  SEEOTHER = 303,
  /** RFC 7232, 4.1 */
  NOTMODIFIED = 304,
  /** RFC 7231, 6.4.5 */
  USEPROXY = 305,
  /** RFC 7231, 6.4.7 */
  TEMPORARYREDIRECT = 307,
  /** RFC 7538, 3 */
  PERMANENTREDIRECT = 308,

  /** RFC 7231, 6.5.1 */
  BADREQUEST = 400,
  /** RFC 7235, 3.1 */
  UNAUTHORIZED = 401,
  /** RFC 7231, 6.5.2 */
  PAYMENTREQUIRED = 402,
  /** RFC 7231, 6.5.3 */
  FORBIDDEN = 403,
  /** RFC 7231, 6.5.4 */
  NOTFOUND = 404,
  /** RFC 7231, 6.5.5 */
  METHODNOTALLOWED = 405,
  /** RFC 7231, 6.5.6 */
  NOTACCEPTABLE = 406,
  /** RFC 7235, 3.2 */
  PROXYAUTHREQUIRED = 407,
  /** RFC 7231, 6.5.7 */
  REQUESTTIMEOUT = 408,
  /** RFC 7231, 6.5.8 */
  CONFLICT = 409,
  /** RFC 7231, 6.5.9 */
  GONE = 410,
  /** RFC 7231, 6.5.10 */
  LENGTHREQUIRED = 411,
  /** RFC 7232, 4.2 */
  PRECONDITIONFAILED = 412,
  /** RFC 7231, 6.5.11 */
  REQUESTENTITYTOOLARGE = 413,
  /** RFC 7231, 6.5.12 */
  REQUESTURITOOLONG = 414,
  /** RFC 7231, 6.5.13 */
  UNSUPPORTEDMEDIATYPE = 415,
  /** RFC 7233, 4.4 */
  REQUESTEDRANGENOTSATISFIABLE = 416,
  /** RFC 7231, 6.5.14 */
  EXPECTATIONFAILED = 417,
  /** RFC 7168, 2.3.3 */
  TEAPOT = 418,
  /** RFC 7540, 9.1.2 */
  MISDIRECTEDREQUEST = 421,
  /** RFC 4918, 11.2 */
  UNPROCESSABLEENTITY = 422,
  /** RFC 4918, 11.3 */
  LOCKED = 423,
  /** RFC 4918, 11.4 */
  FAILEDDEPENDENCY = 424,
  /** RFC 8470, 5.2 */
  TOOEARLY = 425,
  /** RFC 7231, 6.5.15 */
  UPGRADEREQUIRED = 426,
  /** RFC 6585, 3 */
  PRECONDITIONREQUIRED = 428,
  /** RFC 6585, 4 */
  TOOMANYREQUESTS = 429,
  /** RFC 6585, 5 */
  REQUESTHEADERFIELDSTOOLARGE = 431,
  /** RFC 7725, 3 */
  UNAVAILABLEFORLEGALREASONS = 451,

  /** RFC 7231, 6.6.1 */
  INTERNALSERVERERROR = 500,
  /** RFC 7231, 6.6.2 */
  NOTIMPLEMENTED = 501,
  /** RFC 7231, 6.6.3 */
  BADGATEWAY = 502,
  /** RFC 7231, 6.6.4 */
  SERVICEUNAVAILABLE = 503,
  /** RFC 7231, 6.6.5 */
  GATEWAYTIMEOUT = 504,
  /** RFC 7231, 6.6.6 */
  HTTPVERSIONNOTSUPPORTED = 505,
  /** RFC 2295, 8.1 */
  VARIANTALSONEGOTIATES = 506,
  /** RFC 4918, 11.5 */
  INSUFFICIENTSTORAGE = 507,
  /** RFC 5842, 7.2 */
  LOOPDETECTED = 508,
  /** RFC 2774, 7 */
  NOTEXTENDED = 510,
  /** RFC 6585, 6 */
  NETWORKAUTHENTICATIONREQUIRED = 511,
}

/**
 * Defines the base HTTP error, which is handled by the default
 *
 * @api public
 */
export class HttpError extends Error {
  /**
   * Instantiate a plain HTTP Error.
   *
   * @example
   * `throw new HttpError()`
   *
   * @usageNotes
   * The constructor arguments define the response and the HTTP response status code.
   * - `message`: a short description of the HTTP error by default; override this
   * - `statusCode`: the Http Status Code.
   *
   * Best practice is to use the `HttpStatus` enum.
   */
  constructor(
    public readonly _message: string,
    public readonly _status: number = HttpStatus.INTERNALSERVERERROR,
  ) {
    super();
  }

  /**
    * Return error message.
    *
    * @returns {string}
    * @api public
    */
  public msg(): string {
    return this._message;
  }

  /**
    * Return error status.
    *
    * @returns {number}
    * @api public
    */
  public status(): number {
    return this._status;
  }
}
