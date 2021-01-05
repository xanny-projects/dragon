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

import { CORSOptions, Middleware, MiddlewareGroups } from "./types.d.ts";
import { HttpRouting } from "./httpRouting.ts";
import { HttpRequest } from "./httpRequest.ts";
import { HttpResponse } from "./httpResponse.ts";

// When a request is received by Dragon, each middleware that matches the request is run in the order it is initialized until there is a terminating action.
// So if an error occurs you must use return `MiddlewareState.Cancel`.
// If not use Next to handle the next middleware.
export enum MiddlewareState {
  Next,
  Cancel,
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
  public async resolveMiddlewareGroups(
    middlewareGroups: MiddlewareGroups[],
  ): Promise<void> {
    if (middlewareGroups.length > 0) {
      for (const middlewareG of middlewareGroups) {
        await this.resolveMiddlewares(middlewareG.handlers);
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
  public async resolveMiddlewares(middlewares: Middleware[]): Promise<void> {
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
  public async resolveGlobalMiddlewares(): Promise<void> {
    await this.resolveMiddlewares(HttpRouting.globalMiddlewares());
  }
}

/**
 * CORSMethodMiddleware automatically sets the Access-Control-Allow-Methods response header.
 * on requests for routes that have an OPTIONS method matcher to all the method matchers on
 * the route.
 *
 * @param {CORSOptions} cors
 * @returns {Middleware}
 * @api public
 */
export function CORSMethodMiddleware(cors: CORSOptions): Middleware {
  return async function (
    Request: HttpRequest,
    ResponseWriter: HttpResponse,
  ): Promise<MiddlewareState> {
    ResponseWriter.withHeader(
      "Access-Control-Allow-Origin",
      cors.origin || "0.0.0.0",
    )
      .withHeader("Access-Control-Allow-Headers", cors.headers.join(","));
    return MiddlewareState.Next;
  };
}
