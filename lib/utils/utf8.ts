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

export const decoder = new TextDecoder();

/** Shorthand for new TextDecoder().decode() */
export function decode(input?: Uint8Array): string {
  return decoder.decode(input);
}

export const encoder = new TextEncoder();

/** Shorthand for new TextEncoder().encode() */
export function encode(input?: string): Uint8Array {
  return encoder.encode(input);
}
