# Release Notes

## v0.2-alpha 🤖

### Features

- Developer friendly, very expressive and help the developer in their daily use, without sacrificing performance and security.
- Lightweight and modular design allows for a flexible framework.
- Focus on high performance.
- Middleware support, incoming HTTP request can be handled by a chain of middlewares and the final action.
- Excellent and fluent documentation.

## v0.4-beta 🌋

- Change API.
- Fix documentation.
- New `HttpRouting`, `HttpResponse`, `HttpError` methods.
- Rename `newRoute` method to `routes`.
- Move Interfaces and types to `types.d.ts`.

## v0.6-beta 🍄

- Fix: Not throw error if header already exists.
- Add `hello-world` example.
- Add `route-middleware` example .
- Imporve documentation.

## v1.0 🧬

- Add `abort` method.
- Add `Fallback Routes` documentation section.

## v1.0.1 💨

- Export `HtppRouting` class.
- Add `multi-router` example.
- Refactor `params` and `route-middleware` example.

## v1.0.2 💣

- Rename repository to Dragon.
- Fix documentation.
- Fix tests.

## v1.0.4 🎄

- Return HttpStatus.NOTFOUND if no match
- Fix fallback routes documentation (use Template Literals)

## v1.0.6 💥

- Add Handling CORS Requests
- Redirect the client to another URL with optional response `status` defaulting to 302

## v1.0.8 🎃

- Fix & Improve documentation.
- Update to Deno 1.6.2
- Update std to 0.82.0
- Rename protocol to schemes