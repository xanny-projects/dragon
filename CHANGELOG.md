# Release Notes

## v1.1.6 🎃

- Move `httpMiddleware` to `middleware` folder.
- Move `httpRequest`, `httpResponse`, `httpMessage` to `http` folder.
- Move `httpRouting` to `router` folder.
- Add `utils` folder
- Fix documentation
- Fix testing

## v1.1.5 ⛄

- Remove `HttpStatus` interface.
- Rename `middleware` to `HttpMiddleware`.

## v1.1.4 🌘

- Fix `post` request keeps loading.
- Remove `match` method.
- Add `handleHttpRequest` to handle an HTTP request from the Deno server.
- Add `ResponseOutput` interface.
- Fix Documentation.


## v1.1.2 🕹

- Add `permanentRedirect` method to return a 301 status code
- New Dragon logo
- Fix Typo `examples`

## v1.1.1 🚣

- Add `expectsJson` method to quickly determine if the incoming request expects
  a JSON response.
- Add `prefers` method to determine which content type out of a given array of
  content types is most preferred by the request.


## v1.1.0 🧞

- Fix Documentation.
- Add `isHttpError` helper function
- Use `end` method instead of `send`

## v1.0.9 🧙‍♂️

- Fix typo.
- Add build-in middlewares:

  - `X-XSS-Protection`
  - `X-Frame-Options`
  - `CORSMethodMiddleware`

## v1.0.8 🎃

- Fix & Improve documentation.
- Update to Deno 1.6.2
- Update std to 0.82.0
- Rename protocol to schemes

## v1.0.6 💥

- Add Handling CORS Requests
- Redirect the client to another URL with optional response `status` defaulting
  to 302

## v1.0.4 🎄

- Return HttpStatus.NOTFOUND if no match
- Fix fallback routes documentation (use Template Literals)

## v1.0.2 💣

- Rename repository to Dragon.
- Fix documentation.
- Fix tests.

## v1.0.1 💨

- Export `HtppRouting` class.
- Add `multi-router` example.
- Refactor `params` and `route-middleware` example.

## v1.0 🧬

- Add `abort` method.
- Add `Fallback Routes` documentation section.

## v0.6-beta 🍄

- Fix: Not throw error if header already exists.
- Add `hello-world` example.
- Add `route-middleware` example .
- Imporve documentation.

## v0.4-beta 🌋

- Change API.
- Fix documentation.
- New `HttpRouting`, `HttpResponse`, `HttpError` methods.
- Rename `newRoute` method to `routes`.
- Move Interfaces and types to `types.d.ts`.

## v0.2-alpha 🤖

### Features

- Developer friendly, very expressive and help the developer in their daily use,
  without sacrificing performance and security.
- Lightweight and modular design allows for a flexible framework.
- Focus on high performance.
- Middleware support, incoming HTTP request can be handled by a chain of
  middlewares and the final action.
- Excellent and fluent documentation.