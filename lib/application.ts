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

import { DefaultServer, ServerTLS } from "../deps.ts";
import { HttpRouting, RequestMethod } from "./httpRouting.ts";
import { HttpError, HttpStatus } from "./httpError.ts";
import { HttpRequest } from "./httpRequest.ts";
import { HttpResponse } from "./httpResponse.ts";
import { Middleware, MiddlewareResolver } from "./middleware.ts";

export interface RoutingOptions {
  /** A custom length for parameters * This defaults to `100 characters`. */
  maxParamLength?: number;
  /** Configurable Handler to be used when no route matches. */
  notFoundHandler?: Middleware;
  /** Maximum allowed routes */
  maxRoutes?: number;
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

export type ListenOptions = ListenSimpleOptions | ListenTlsOptions;

/**
 * Register list of routes.
 *
 * @var {Routes}
 * @api public
 */
export const RegistredRoutes: HttpRouting[] = [];

/**
 * Routing Options.
 *
 * @var {RouteOptions}
 * @api public
 */
export var RouteOptions: RoutingOptions = {};

/* Initialize and Expose `Application` class */
export class Application {
  /**
  * Construct a new, empty instance of the {@code NewApplication} object.
  * @param {ApplicationOptions} options
  */
  constructor(private readonly options: ApplicationOptions = {}) {}

  /**
   * Check if TLS is enabled.
   *
   * @param {ListenOptions} options
   * @returns {boolean}
   * @api public
   */
  public IsSecure(options: ListenOptions): options is ListenTlsOptions {
    return "secure" in options;
  }

  /**
   * NewRoute registers an empty route.
   *
   * @param {RoutingOptions} options
   * @returns {HttpRouting}
   * @api public
   */
  public NewRoute(options?: RoutingOptions): HttpRouting {
    if (typeof options !== "undefined") {
      RouteOptions = options;
    }
    const route = new HttpRouting(
      "/",
      [RequestMethod.GET],
      async (Request: HttpRequest, ResponseWriter: HttpResponse) => {
        console.log("Hello");
      },
    );
    RegistredRoutes.push(route);
    return route;
  }

  /**
   * Return showing settings.
   *
   * @returns {object}
   * @api public
   */
  public Settings(): ApplicationOptions {
    return this.options;
  }

  /**
   * Start listening for given requests.
   * If the options is typeof `ListenSimpleOptions` the listening will be over HTTP.
   * If the options is typeof `ListenTlsOptions` the listening will be over HTTPS.
   *
   * @param {ListenOptions} options
   * @returns {Object}
   * @api public
   */
  public async ListenAndServe(
    options: ListenOptions,
  ): Promise<void | HttpError> {
    if (RegistredRoutes.length === 0) {
      throw new HttpError("Register at least one route.");
    }
    const server = this.IsSecure(options)
      ? ServerTLS(options)
      : DefaultServer(options);
    try {
      for await (const request of server) {
        // Match attempts to match the given request against the router's registered routes.
        const req = await new HttpRequest(request);
        const res = new HttpResponse(request);
        // If the match failure type (eg: not found) has a registered handler,
        // the handler is assigned to the Handler.
        if (
          await this.Match(req, res) === HttpStatus.NOTFOUND &&
          RouteOptions.notFoundHandler !== undefined
        ) {
          RouteOptions.notFoundHandler(req, res);
        }
      }
    } catch (err) {
      throw new HttpError(err.message || "Internal Server Error");
    } finally {
      // kill server.
      server.close();
    }
  }

  /**
   * Match attempts to match the given request against the router's registered routes.
   * If the request matches a route of this router or one of its subrouters the Route
   * execute handler.
   *
   * @param {HttpRequest} Request
   * @param {HttpResponse} ResponseWriter
   * @return {void | HttpStatus }
   * @api public
   */
  public async Match(
    Request: HttpRequest,
    ResponseWriter: HttpResponse,
  ): Promise<HttpStatus | void> {
    for (const route of RegistredRoutes) {
      if (
        route.HasPath(Request.GetPath()) && route.HasMethod(Request.GetMethod())
      ) {
        const middleware = new MiddlewareResolver(Request, ResponseWriter);
        // Resolve the registred middlewares. The order is very important.
        Promise.all([
          middleware.ResolveGlobalMiddlewares(),
          middleware.ResolveMiddlewareGroups(route.middlewareGroups),
          middleware.ResolveMiddlewares(route.middleware),
        ]).then(() => {
          // Excecute the handle function.
          route.action(Request, ResponseWriter);
        });
      }
    }
    return HttpStatus.NOTFOUND;
  }

  /**
   * Converts the input into a string that has the same format console.log().
   *
   * @returns {string}
   * @api public
   */
  public Inspect(value: unknown): string {
    return Deno.inspect(value);
  }
}
