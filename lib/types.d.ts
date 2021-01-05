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
import { RequestMethod } from "./httpRouting.ts";
import { HttpRequest } from "./httpRequest.ts";
import { HttpResponse } from "./httpResponse.ts";

// Handler function.
export interface HandlerFunc {
  (Request: HttpRequest, ResponseWriter: HttpResponse): Promise<unknown>;
}

// Middleware & MiddlewareGroups interfaces.
export interface Middleware extends HandlerFunc {} // Groups of middleware.

export interface MiddlewareGroups {
  name: string;
  handlers: Middleware[];
}

/** Return respond using Response class instead of ServerRequest. */
export interface ServerResponse extends Response {
  respond(r: Response): Promise<void>;
}

/** Query Payload */
interface QueryPayload {
  key: string;
  value: string;
}

/** Routing Option Interface */
export interface RoutingOptions {
  /** A custom length for parameters * This defaults to `100 characters`. */
  maxParamLength?: number;
  /** Configurable Handler to be used when no route matches. */
  notFoundHandler?: Middleware;
  /** Maximum allowed routes */
  maxRoutes?: number;
}

/** CORS Option Interface */
export interface CORSOptions {
  headers: Array<RequestMethod>;
  origin: string;
}

export interface ApplicationOptions {
  /** If set to `true`, proxy headers will be trusted when processing requests.
   * This defaults to `false`. */
  proxy?: boolean;
  /** Return array of subdomains in the domain name of the request.
   * This defaults to `2`. */
  subdomainOffset?: string[] | 2;
  /** Return header for identifying the originating IP address of a client connecting to a web server
   * through an HTTP proxy or a load balancer */
  proxyIpHeader?: string | "X-Forwarded-For";
}

export interface ListenSimpleOptions {
  /** A unique name for a computer or network node in a network
   * This defaults to `0.0.0.0` */
  hostname?: string;
  /** Numbers used by protocols for operation of network applications.
   * This defaults to `4200` */
  port: number;
}

export interface ListenTlsOptions extends ListenSimpleOptions {
  certFile: string;
  keyFile: string;
  /** The listening will be over HTTPS */
  secure: true;
}

/** Parameter Payload */
export type ParameterPayload = { [key: string]: string };

export type ListenOptions = ListenSimpleOptions | ListenTlsOptions;
