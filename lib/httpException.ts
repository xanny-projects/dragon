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
   * Best practice is to use the `HttpStatus` enum imported from `denoland`.
   */
   constructor(public readonly message:string, public readonly status:number = 500) {
     super();
   }

   /**
    * Return error message.
    *
    * @returns {string}
    * @api public
    */
   public GetMessage():string {
    return this.message;
   }

   /**
    * Return error status.
    *
    * @returns {number}
    * @api public
    */
   public GetStatus(): number {
     return this.status;
   }

}
