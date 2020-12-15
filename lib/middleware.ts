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
import { HandlerFunc, HttpRouting } from "./httpRouting.ts";

// When a request is received by Xanny, each middleware that matches the request is run in the order it is initialized until there is a terminating action.
// So if an error occurs you must use return `MiddlewareState.Cancel`.
// If not use Next to handle the next middleware.
export enum MiddlewareState {
  Next,
  Cancel,
} // Middleware interface is anything with Next function.

export interface Middleware extends HandlerFunc {} // Groups of middleware.

export interface MiddlewareGroups {
  name: string;
  handlers: Middleware[];
}

/* Initialize and Expose `MiddlewareResolver` class */
export class MiddlewareResolver {
  /**
   * Construct a new, instance of the {@code MiddlewareResolver} object.
   *
   * @param {HttpRequest} request
   * @param {HttpResponse} response
   * @returns {void}
   */
  constructor(
    private readonly request: HttpRequest,
    private readonly response: HttpResponse,
  ) {}

  /**
   * Resolve middleware groups.
   *
   * @param {MiddlewareGroups[]} middlewareGroups
   * @returns {void}
   * @api public
   */
  public async ResolveMiddlewareGroups(
    middlewareGroups: MiddlewareGroups[],
  ): Promise<void> {
    if (middlewareGroups.length > 0) {
      for (const middlewareG of middlewareGroups) {
        await this.ResolveMiddlewares(middlewareG.handlers);
      }
    }
  }

  /**
   * Resolve simple middlewares.
   *
   * @param {Middleware[]} middlewares
   * @returns {void}
   * @api public
   */
  public async ResolveMiddlewares(middlewares: Middleware[]): Promise<void> {
    if (middlewares.length > 0) {
      for (const middleware of middlewares) {
        const currentMiddleware = await middleware(this.request, this.response);
        if (
          currentMiddleware === MiddlewareState.Cancel ||
          currentMiddleware !== MiddlewareState.Next
        ) {
          break;
        }
      }
    }
  }

  /**
   * Resolve global middlewares.
   *
   * @returns {void}
   * @api public
   */
  public async ResolveGlobalMiddlewares(): Promise<void> {
    await this.ResolveMiddlewares(HttpRouting.globalMiddleware);
  }
}
