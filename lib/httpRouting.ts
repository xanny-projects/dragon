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

import { RegistredRoutes, RouteOptions } from "./application.ts";
import { Middleware, MiddlewareGroups } from "./middleware.ts";
import { HttpRequest } from "./httpRequest.ts";
import { HttpResponse } from "./httpResponse.ts";
import { HttpError } from "./httpError.ts";

/**
 * Request methods to indicate the desired action to be performed.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods}
 * */
export enum RequestMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
  ALL = "ALL",
  OPTIONS = "OPTIONS",
  HEAD = "HEAD",
}

// Handler function.
export interface HandlerFunc {
  (Request: HttpRequest, ResponseWriter: HttpResponse): Promise<unknown>;
}

// Parameter Payload.
interface IParameterPayload {
  name: string;
  value: string | null;
}

/* Initialize and Expose `HttpRouting` class */
export class HttpRouting {
  /**
   * The Path the route responds to.
   *
   * @var {string}
   */
  public path: string;

  /**
   * The Original path for given request.
   *
   * @var {string}
   */
  public originalUrl!: string;

  /**
   * The HTTP methods the route responds to.
   *
   * @var {Array<RequestMethod>}
   */
  public methods: RequestMethod[];

  /**
   * The route handler.
   *
   * @var {HandlerFunc}
   */
  public action: HandlerFunc;

  /**
   * Unique route name.
   *
   * @var {string}
   */
  public name: string = "<anonymous>";

  /**
   * All of the short-hand keys for middlewares.
   *
   * @var {Middleware[]}
   */
  public middleware: Middleware[] = [];

  /**
   * All of the middleware groups.
   *
   * @var {MiddlewareGroups[]}
   */
  public middlewareGroups: MiddlewareGroups[] = [];

  /**
   * Register global middleware.
   *
   * @var {Middleware[]}
   */
  public static globalMiddleware: Middleware[] = [];

  /**
   * Queries registers a new route.
   *
   * @var {URLSearchParams}
   */
  public queries?: URLSearchParams;

  /**
   * The array of matched parameters.
   *
   * @var {string[]}
   */
  public parameters: IParameterPayload[] = [];

  /**
  * Construct a new, instance of the {@code Routing} object.
  *
  * @param {string} path
  * @param {RequestMethod[]} methods
  * @param {HandlerCallable} action
  * @returns {void}
  */
  constructor(path: string, methods: RequestMethod[], action: HandlerFunc) {
    this.path = path;
    this.action = action;
    this.methods = methods;
    // Push "HEAD" if the method is GET.
    if (
      methods.includes(RequestMethod.GET) &&
      !methods.includes(RequestMethod.HEAD)
    ) {
      this.methods.push(RequestMethod.HEAD);
    }
    // Register query values.
    this.WithQueries();
  }

  /**
   * Determine if the route has parameters.
   *
   * @returns {boolean}
   * @api public
   */
  public HasParameters(): boolean {
    return this.parameters.length === 0;
  }

  /**
   * Determine a given parameter exists from the route.
   *
   * @param {string} key
   * @returns {boolean}
   * @api public
   */
  public HasParameter(key: string): boolean {
    for (var parameter of this.parameters) {
      if (parameter.name === key) {
        return true;
      }
    }
    return false;
  }

  /**
   * Set a parameter to the given value.
   *
   * @param {string} name
   * @param {string | null } value
   * @returns {Object | HttpError}
   * @api public
   */
  public WithParameter(name: string, value: string | null): this | HttpError {
    if (this.HasParameter(name)) {
      throw new HttpError(`Parameter ${name} already exists`);
    }
    this.parameters.push({ name, value });
    return this;
  }

  /**
   * Register a new middlware.
   *
   * @param {Middleware} middleware
   * @returns {Object}
   * @api public
   */
  public WithMiddleware(middleware: Middleware): this {
    this.middleware.push(middleware);
    return this;
  }

  /**
   * Register a global middlware.
   *
   * Use Cases:
   *
   *   - If you want a middleware to run during every HTTP request to your application
   *
   * @static
   * @param {Middleware} middleware
   * @returns {void}
   * @api public
   */
  public static GlobalMiddleware(middleware: Middleware): void {
    this.globalMiddleware.push(middleware);
  }

  /**
   * Set a name to the given route.
   *
   * @param {string} name
   * @returns {Object}
   * @api public
   */
  public WithName(name: string): this {
    this.name = name;
    return this;
  }

  /**
   * Methods registers a new route with a matcher for HTTP methods.
   *
   * @param {RequestMethod[]} methods
   * @returns {Object}
   * @api public
   */
  public WithMethods(...methods: RequestMethod[]): this {
    this.methods = [...this.methods,...methods];
    return this;
  }

  /**
   * Get an handler for the route.
   *
   * @returns {HandlerCallable}
   * @api public
   */
  public async GetHandler(): Promise<HandlerFunc> {
    return await this.action;
  }

  /**
   * Check if a middlewareGroup with the given name exists.
   *
   * @param {string} name
   * @returns {boolean}
   * @api public
   */
  public HasMiddlewareGroups(name: string): boolean {
    for (var middleware of this.middlewareGroups) {
      if (middleware.name === name) {
        return true;
      }
    }
    return false;
  }


  /**
   * Get all of the defined middleware groups.
   *
   * @returns {MiddlewareGroups[]}
   * @api public
   */
  public GetMiddlewareGroups(): MiddlewareGroups[] {
    return this.middlewareGroups;
  }

  /**
   * Register a group of middleware.
   *
   * @param {string} name
   * @param {Middleware[]} middlewares
   * @returns {Object}
   * @api public
   */
  public WithMiddlewareGroups(name: string, middlewares: Middleware[]): this {
    this.middlewareGroups.push({
      name,
      handlers: [...middlewares],
    });
    return this;
  }

  /**
   * Check if a route with the given path exists.
   *
   * @param {string} path
   * @returns {boolean}
   * @api public
   */
  public HasPath(path: string): boolean {
    return this.path === path;
  }

  /**
   * Check if a route with the given name exists.
   *
   * @returns {boolean}
   * @api public
   */
  public HasName(): boolean {
    return this.name !== "<anonymous>";
  }

  /**
   * Check if route has given method.
   *
   * @param {string} verb
   * @returns {boolean}
   * @api public
   */
  public HasMethod(verb: string): boolean {
    return this.methods.includes(verb as RequestMethod);
  }

  /**
   * Register new path value.
   *
   * @param {string} value
   * @returns {Object}
   * @api public
   */
  public Path(value: string): this {
    this.path = value;
    return this;
  }

  /**
   * Return original url.
   *
   * @returns {string}
   */
  public GetOriginalURL(): string {
    return this.originalUrl;
  }

  /**
   * HandleFunc registers a new route with a matcher for the URL path.
   *
   * @param {HandlerFunc} handler
   * @returns {HttpRouting}
   * @api public
   */
  public HandleFunc(handler: HandlerFunc): HttpRouting {
    const maxAllowedRoutes = RouteOptions.maxRoutes;
    if (
      typeof maxAllowedRoutes !== "undefined" &&
      RegistredRoutes.length > maxAllowedRoutes
    ) {
      throw new HttpError(
        `Maximum allowed number of routes: ${maxAllowedRoutes}`,
      );
    }
    this.action = handler;
    const newRoute = new HttpRouting(
      "/default",
      [RequestMethod.GET],
      async (Request: HttpRequest, ResponseWriter: HttpResponse) => {},
    );
    RegistredRoutes.push(newRoute);
    return newRoute;
  }

  /**
   * Registers a new route with a matcher for URL query values
   *
   * @returns {Object}
   * @api private
   */
  private WithQueries(): this {
    this.queries = new URLSearchParams(this.path);
    return this;
  }
}
