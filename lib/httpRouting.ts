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

import { HttpRequest } from "./httpRequest.ts";
import { HttpResponse } from "./httpResponse.ts";
import {
  HandlerFunc,
  Middleware,
  MiddlewareGroups,
  RoutingOptions,
} from "./types.d.ts";

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
  OPTIONS = "OPTIONS",
  HEAD = "HEAD",
}

/**
 * Register list of routes.
 *
 * @var {HttpRouting}
 * @api public
 */
export const RegistredRoutes: HttpRouting[] = [];

/**
 * Routing Options.
 *
 * @var {RouteOptions}
 * @api public
 */
export let RouteOptions: RoutingOptions = {};

/* Initialize and Expose `HttpRouting` class */
export class HttpRouting {
  /**
   * The Path the route responds to.
   *
   * @var {string}
   */
  private _path: string | RegExp;

  public get path(): string | RegExp {
    return this._path;
  }

  /**
   * The Original path for given request.
   *
   * @var {string}
   */
  private _originalUrl!: string;

  /**
   * The HTTP methods the route responds to.
   *
   * @var {Array<RequestMethod>}
   */
  private _methods: RequestMethod[];

  /**
   * The route handler.
   *
   * @var {HandlerFunc}
   */
  private _action: HandlerFunc;

  public get action(): HandlerFunc {
    return this._action;
  }

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
  private _middleware: Middleware[] = [];

  /**
   * All of the middleware groups.
   *
   * @var {MiddlewareGroups[]}
   */
  private _middlewareGroups: MiddlewareGroups[] = [];

  /**
   * Register global middleware.
   *
   * @var {Middleware[]}
   */
  private static _globalMiddleware: Middleware[] = [];

  /**
  * Construct a new, instance of the {@code Routing} object.
  *
  * @param {string | RegExp} path
  * @param {RequestMethod[]} methods
  * @param {HandlerCallable} action
  * @returns {void}
  */
  constructor(
    path: string | RegExp,
    methods: RequestMethod[],
    action: HandlerFunc,
  ) {
    this._path = path;
    this._action = action;
    this._methods = methods;
  }

  /**
   * Register a new middlware.
   *
   * @param {Middleware} middleware
   * @returns {Object}
   * @api public
   */
  public withMiddleware(middleware: Middleware): this {
    this._middleware.push(middleware);
    return this;
  }

  /**
   * Return registred middlewares.
   *
   * @returns {Middleware[]}
   * @api public
   */
  public middlewares(): Middleware[] {
    return this._middleware;
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
  public static withGlobalMiddleware(middleware: Middleware): void {
    this._globalMiddleware.push(middleware);
  }

  /**
   * Return registred global middlwares.
   *
   * @static
   * @returns {Middleware[]}
   * @api public
   */
  public static globalMiddlewares(): Middleware[] {
    return this._globalMiddleware;
  }

  /**
   * Set a name to the given route.
   *
   * @param {string} name
   * @returns {Object}
   * @api public
   */
  public withName(name: string): this {
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
  public withMethods(...methods: RequestMethod[]): this {
    // Push "HEAD" if the method is GET.
    if (
      methods.includes(RequestMethod.GET) &&
      !methods.includes(RequestMethod.HEAD)
    ) {
      methods.push(RequestMethod.HEAD);
    }
    this._methods = [...this._methods, ...methods];
    return this;
  }

  /**
   * Returns registred methods.
   *
   * @returns {RequestMethod[]}
   * @api public
   */
  public methods(): RequestMethod[] {
    return this._methods;
  }

  /**
   * Get an handler for the route.
   *
   * @returns {HandlerCallable}
   * @api public
   */
  public async handler(): Promise<HandlerFunc> {
    return await this._action;
  }

  /**
   * Check if a middlewareGroup with the given name exists.
   *
   * @param {string} name
   * @returns {boolean}
   * @api public
   */
  public hasMiddlewareGroups(name: string): boolean {
    for (var middleware of this._middlewareGroups) {
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
  public middlewareGroups(): MiddlewareGroups[] {
    return this._middlewareGroups;
  }

  /**
   * Register a group of middleware.
   *
   * @param {string} name
   * @param {Middleware[]} middlewares
   * @returns {Object}
   * @api public
   */
  public withMiddlewareGroups(name: string, middlewares: Middleware[]): this {
    this._middlewareGroups.push({
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
  public hasPath(path: string): boolean {
    // remove query if exists.
    const cleanPath = path.replace(/\?.+/i, "");
    return typeof this.path === "string"
      ? this._path === cleanPath
      : new RegExp(this._path).test(cleanPath);
  }

  /**
   * Check if a route with the given name exists.
   *
   * @returns {boolean}
   * @api public
   */
  public hasName(): boolean {
    return this.name !== "<anonymous>";
  }

  /**
   * Check if route has given method.
   *
   * @param {string} verb
   * @returns {boolean}
   * @api public
   */
  public hasMethod(verb: string): boolean {
    return this._methods.includes(verb as RequestMethod);
  }

  /**
   * Register new path value. Use regex named group is you need to register params.
   *
   * Example:
   *
   *    Path("/xaany");
   *    Path(/xanny/);
   *    Path(/xanny\/(?<id>[0-9]+)/u);
   *
   * @param {string} value
   * @returns {Object}
   * @api public
   */
  public Path(value: string | RegExp): HttpRouting {
    const route = new HttpRouting(
      value,
      [],
      async (Request: HttpRequest, ResponseWriter: HttpResponse) => {},
    );
    return route;
  }

  /**
   * Return original url.
   *
   * @returns {string}
   */
  public originalURL(): string {
    return this._originalUrl;
  }

  /**
   * HandleFunc registers a new route with a matcher for the URL path.
   *
   * @param {HandlerFunc} handler
   * @returns {HttpRouting}
   * @api public
   */
  public handleFunc(handler: HandlerFunc): HttpRouting {
    this._action = handler;
    RegistredRoutes.push(this);
    return this;
  }
}
