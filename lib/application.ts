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

import { DefaultServer, ServerRequest, ServerTLS } from "../deps.ts";
import {
  ApplicationOptions,
  ListenOptions,
  ListenTlsOptions,
  RoutingOptions,
} from "./types.d.ts";
import { HttpRouting, RegistredRoutes } from "./httpRouting.ts";
import { HttpError, HttpStatus } from "./httpError.ts";
import { HttpRequest } from "./httpRequest.ts";
import { HttpResponse } from "./httpResponse.ts";
import { MiddlewareResolver } from "./middleware.ts";

/**
 * Routing Options.
 *
 * @var {RouteOptions}
 * @api private
 */
var RouteOptions: RoutingOptions = {};

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
  public isSecure(options: ListenOptions): options is ListenTlsOptions {
    return "secure" in options;
  }

  /**
   * Routes registers an empty route.
   *
   * @param {RoutingOptions} options
   * @returns {HttpRouting}
   * @api public
   */
  public routes(options?: RoutingOptions): HttpRouting {
    if (typeof options !== "undefined") {
      RouteOptions = options;
    }
    const route = new HttpRouting(
      "/",
      [],
      async (Request: HttpRequest, ResponseWriter: HttpResponse) => {},
    );
    return route;
  }

  /**
   * Return showing settings.
   *
   * @returns {object}
   * @api public
   */
  public settings(): ApplicationOptions {
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
  public async listenAndServe(
    options: ListenOptions,
  ): Promise<void | HttpError> {
    if (RegistredRoutes.length === 0) {
      throw new HttpError("Register at least one route.");
    }
    const server = this.isSecure(options)
      ? ServerTLS(options)
      : DefaultServer(options);
    try {
      for await (const request of server) {
        this.handleHttpRequest(request);
      }
    } catch (err) {
      throw new HttpError(err.message || "Internal Server Error");
    } finally {
      // kill server.
      server.close();
    }
  }

  /**
   * Handle an HTTP request from the Deno server.
   * 
   * @param {ServerRequest} serverRequest - The incoming request object.
   * @returns {void | HttpStatus }
   * @api private
   */
  private async handleHttpRequest(serverRequest: ServerRequest) {
    // Instantiate Resquest & Response.
    const request = new HttpRequest(serverRequest);
    const response = new HttpResponse(serverRequest);
    // Attempts to match the given request against the router's registered routes.
    // If the request matches a route of this router or one of its subrouters the Route
    // execute handler.
    var is_match = false;
    // find next matching routes.
    for (const route of RegistredRoutes) {
      if (!route.hasPath(request.path())) {
        is_match = false;
        continue;
      }
      if (!route.hasMethod(request.method())) {
        is_match = false;
        continue;
      }
      if (typeof route.path !== "string") {
        // Set a parameter to the given value.
        const r = route.path.exec(request.path());
        request.parameters = r?.groups;
      }
      // route is found
      is_match = true;
      // Resolve the registred middlewares.
      const middleware = new MiddlewareResolver(request, response);
      // The order is very important.
      Promise.all([
        middleware.resolveGlobalMiddlewares(),
        middleware.resolveMiddlewareGroups(route.middlewareGroups()),
        middleware.resolveMiddlewares(route.middlewares()),
      ]).then(() => {
        // Excecute the handle function.
        route.action(request, response);
      });
    }
    // no match
    if (is_match !== true && RouteOptions.notFoundHandler !== undefined) {
      await RouteOptions.notFoundHandler(request, response);
    }
  }

  /**
   * Converts the input into a string that has the same format console.log().
   *
   * @returns {string}
   * @api public
   */
  public inspect(value: unknown): string {
    return Deno.inspect(value);
  }
}
