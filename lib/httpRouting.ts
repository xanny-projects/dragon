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

// Handler sets a handler for the route.
export interface HandlerCallable {
  Request: HttpRequest;
  ResponseWriter: HttpResponse;
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
   * The HTTP methods the route responds to.
   *
   * @var {Array<RequestMethod>}
   */
  public methods: RequestMethod[];

  /**
   * The route handler.
   *
   * @var {HandlerCallable}
   */
  public action: HandlerCallable;

  /**
   * Indicates whether the route is a fallback route.
   *
   * @var {boolean}
   */
  public isFallback: boolean = false;

  /**
   * Unique route name.
   *
   * @var {string}
   */
  public name: string = "<anonymous>";

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
  constructor(path: string, methods: RequestMethod[], action: HandlerCallable) {
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
    for (const parameter of this.parameters) {
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
    if(this.HasParameter(name)) {
      throw new HttpError(`Parameter ${name} already exists`);
    }
    this.parameters.push({ name,value });
    return this;
  }

}
