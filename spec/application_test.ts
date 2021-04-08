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

import { assertEquals } from "../deps.ts";
import { Application } from "../lib/application.ts";
import { RegistredRoutes } from "../lib/router/mod.ts";

// Simulate Application  injection.
const application = new Application();

Deno.test({
  name: "should init route with default `/` path",
  fn(): void {
    application.routes({ maxRoutes: 1 });
    assertEquals(RegistredRoutes.length, 0);
  },
});
