# Dragon

<p align="left">

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/xanny-projects/dragon/ci)
![GitHub issues](https://img.shields.io/github/issues/xanny-projects/dragon)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/xanny-projects/dragon)

</p>

<img align="right" src="https://drive.google.com/uc?id=19el9wu52mdjLqTweWQ-zqVuclyShVuR8" height="170px">

Dragon is a _simple_, _fast_ and _low_ **HTTP** router and **URL** matcher for building **Deno** servers. If you need performance and good productivity, you will love it.

### Features

- Developer friendly, very expressive and help the developer in their daily use, without sacrificing performance and security.
- Lightweight and modular design allows for a flexible framework.
- Focus on high performance.
- Middleware support, incoming HTTP request can be handled by a chain of middlewares and the final action.
- Excellent and fluent documentation.

## Getting Started

Let's start registering a couple of URL paths and handlers:

```ts
import { Application, RequestMethod, HttpRequest, HttpResponse } from "https://deno.land/x/dragon@1.0.1/lib/mod.ts";

const app = new Application();

const r = app.routes({ maxRoutes:2 });

r.Path("/hello")
 .withMethods(RequestMethod.GET)
 .handleFunc(async function (Request: HttpRequest, ResponseWriter: HttpResponse) {
      ResponseWriter.withBody("Hello Dragon").send();
  });

r.Path("/demo")
 .HandleFunc(async function (Request: HttpRequest, ResponseWriter: HttpResponse) {
    ResponseWriter.withBody("Hello Dragon Demo").send();
  });

app.listenAndServe({ port: 8080 });
```

Here we register two routes mapping URL path to handler. if an incoming request URL matches one of the paths, the corresponding handler is called passingWe believe development must be an enjoyable and creative experience to be truly fulfilling
(`HttpRequest`, `HttpResponse`) as parameters.

## Documentation

Get started with Dragon, learn the fundamentals and explore advanced topics.

### Table of content

* [Installation](#installation)
* [Routing](#routing)
* [Requests](#request-object)
* [Headers](#headers)
* [Responses](#response-object)
* [Cookies](#cookies)
* [Middlewares](#middlewares)
* [Full Example](#full-examples)

### Installation

Assuming you’ve already installed **Deno**, create a directory to hold your application, and make that your working directory.

```sh
$ mkdir Dragon-app
$ cd Dragon-app
```

Creates an Dragon application. The `Application` class exported from Dragon module and sets up the application with various options.

```ts
const app = new Application();
```

The following table describes the properties of the optional options object.

| Index         | Property            | Type       | Default            |
|:-------------:| :-------------------| :----------| :------------------|
| 1             | *proxy*             | Boolean    | false              |
| 2             | *proxyIpHeader*     | string     | X-Forwarded-For    |
| 3             | *hostname*          | string     | 0.0.0.0            |
| 4             | *port*              | number     | 4200               |
| 5             | *certFile*          | string     | null               |
| 6             | *keyFile*           | string     | null               |
| 7             | *secure*            | boolean    | true               |

### Routing

Routing is made from the word route. It is used to determine the specific behavior of an application. It specifies how an application responds to a client request to a particular route, URI or path and a specific HTTP request method (`GET`, `POST`, etc.). It can handle different types of HTTP requests.

#### 1- Basic Routing

Dragon provides a very simple and expressive method of defining routes and behavior without complicated routing configuration files:

```ts
const r = app.routes();
  r.Path("/hello")
  .withMethods(RequestMethod.GET)
  .handleFunc(async function (Request: HttpRequest, ResponseWriter: HttpResponse) {
    ResponseWriter.withBody("Hello Dragon").send();
  });
```

The optional options parameter specifies the behavior of the router.

| Index         | Description                   | Type       | Default            |
|:-------------:| :-----------------------------| :----------| :------------------|
| 1             | *maxParamLength*              | number     | false              |
| 2             | *notFoundHandler*             | Function   | undefined          |
| 3             | *maxRoutes*                   | number     | undefined          |

#### 2- Available Router Methods

The router allows you to register routes that respond to any HTTP verb:

```ts
const r = app.routes();
  r.withMethods(RequestMethod.GET);
  r.withMethods(RequestMethod.POST);
  r.withMethods(RequestMethod.PUT);
  r.withMethods(RequestMethod.DELETE);
  r.withMethods(RequestMethod.PATCH);
```

Sometimes you may need to register a route that responds to multiple HTTP verbs.

```ts
const r = app.routes();
  r.withMethods(RequestMethod.GET, RequestMethod.POST);
```

#### 3- Route Parameters

Sometimes you will need to capture segments of the URI within your route.
For example, you may need to capture a user's ID from the URL. You may do so by defining route parameters:

```ts
const r = app.routes();
  r.Path(/user\/(?<id>[0-9]{1,})/u)
  .withMethods(RequestMethod.GET)
  .handleFunc(async function (Request: HttpRequest, ResponseWriter: HttpResponse): Promise<any> {
    const { id:userID } = await Request.params();
    ResponseWriter.withBody(`User with id ${userID}`).send();
  });
```

You may define as many route parameters as required by your route.

> 🚨 Dragon uses regex named group in order to match parameters.

#### 4- Named Routes

Named routes allow to get handler. You may specify a `withName` for a route by chaining the name method onto the route definition:

```ts
const r = app.routes();
  r.Path("/user/profile")
  .withMethods(RequestMethod.GET)
  .withName("profile")
  .handleFunc(async function (Request: HttpRequest, ResponseWriter: HttpResponse): Promise<any> {
    //
  });
```

#### 5- Fallback Routes

Using `notFoundHandler` option. you may define a route that will be executed when no other route matches the incoming request:

```ts

const fallback = async function(Request: HttpRequest, ResponseWriter: HttpResponse) {
  ResponseWriter.html`🤦 Page Not Found`.send();
  return MiddlewareState.Cancel;
}

const r = app.routes({
  notFoundHandler: fallback
});
```

### Request Object

The `HttpRequest` class provides an object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on.

The following table specifies some of the methods associated with request object.

| Index         | Methods                       | Description                                                    |
|:-------------:| :-----------------------------| :--------------------------------------------------------------|
| 1             | *method*                   | Returns the HTTP verb for the request.                         |
| 2             | *url*                         | Returns the full URL for incoming request.                     |
| 4             | *urlQuery*                    | Returns the full URL for incoming request.                     |
| 5             | *urlQuery*                    | Returns the full URL for incoming request (with query string). |
| 6             | *path*                     | Returns the request's path information                         |
| 7             | *isXHR*                       | Check if the request was an `_XMLHttpRequest_`.                |
| 8             | *hostName*                    | Returns the `Host` header field to a hostname.                 |
| 9             | *isIpv4*                      | Value must be valid IPv4.                                      |
| 10            | *isIpv6*                      | Value must be valid IPv6.                                      |
| 11            | *contentLength*               | Indicates the size of the entity-body, in bytes, sent to the recipient.                                      |
| 12            | *body*                     | It contains key-value pairs of data submitted in the request body                                            |
| 13            | *bodyWithoutParser*        | Get the body of the message without parsing.                    |
| 14            | *contentType*              | Returns the media type of the resource.                         |
| 15            | *contentType*              | Returns the media type of the resource.                         |
| 16            | *protocol*                 | Returns `http` or `https` when requested with TLS.              |
| 17            | *queryParams*              | Returns an array of object containing a property for each query string parameter in the route.   |
| 18            | *queryParam*               | Returns specific query param.                                   |
| 19            | *secure*                      | Verify if the request is secure `HTTPS`.                        |
| 20            | *params*                   | An object containing properties mapped to the named route `parameters` For example, if you have the route /user/:name, then the "name" property is available as `const {name} = GetParams();` This object defaults to {}.                     |
| 22            | *Secure*           | Verify if the request is secure `HTTPS`.                        |

### Headers

The Headers interface allows you to perform various actions on HTTP request and response headers. These actions include retrieving, setting, adding to, and removing headers from the list of the request's headers.

You may retrieve a request header from the `HttpRequest` and `HttpResponse` instance using the `header`
or `headers` method. If the header is not present on the request, null will be returned.

```ts
const HandlerFun = async function(Request: HttpRequest, ResponseWriter: HttpResponse) {
  // Retrieves a message header value by the name.
  const v1 = Request.header('X-Header-Name');
  // Retrieves all message header values.
  const v2 = Request.headers();
}
```

The `hasHeader` method may be used to determine if the request contains a given header:

```ts
if (Request.hasHeader('X-Header-Name')) {
    //
}
```

The `delHeader` method is used to remove given header if exists :

```ts
Request.delHeader('X-Header-Name');
```

The `withHeader` method is used to add a series of headers to the response before sending it back to the user.

```ts
Request.withHeader('X-Header-One', 'Header Value')
       .withHeader('X-Header-One', 'Header Value')
       .send();
```

> 💬 Keep in mind that most response methods are chainable, allowing for the fluent construction of response instances.

### Response Object

All routes should return a response to be sent back to the user's browser. Dragon provides several different ways to return responses.

Let's see some methods of response object.

| Index         | Methods              | Description                                                    |
|:-------------:| :-----------------| :-----------------------------------------------------------------|
| 1             | *statusCode*     | Set the response status code. The status code is a 3-digit integer result code of the server's attempt.|
| 2             | *withStatus*        | Set an instance with the specified status code.                 |
| 3             | *withContentLength* | Set Content-Length field to `n`.                                |
| 4             | *withLastModified*  | Set the Last-Modified date using a `string` or a `Date`.        |
| 5             | *html*              | Renders a view and sends the rendered HTML string to the client.|
| 6             | *json*              | Returns the response in JSON format ,as well as set the `Content-Type` header to `application/json` |
| 7             | *isRedirectStatus* | Determines if a HTTP `Status` is a `RedirectStatus` (3XX).       |
| 8             | *abort*            | Rise an HTTP error from the server. |
| 9             | *withBody*         | Set the response body. |

### Cookies

Cookies are small piece of information i.e. sent from a website and stored in user's web browser when user browses that website. Every time the user loads that website back, the browser sends that stored data back to website or server, to recognize user.

Let's define a new route in your Dragon app like set a new cookie:

```ts
const r = app.routes();
  r.Path("/demo")
   .withMethods(RequestMethod.GET)
   .handleFunc(async function (Request: HttpRequest, ResponseWriter:  HttpResponse): Promise<any> {
       ResponseWriter.withCookie("id=a3fWa; Max-Age=2592000").send();
    });
```

### Middlewares

Middleware provide a convenient mechanism for inspecting and filtering HTTP requests entering your application.

> 💬 Middleware functions are always invoked in the order in which they are added.

Middleware is commonly used to perform tasks like body parsing for URL-encoded or JSON requests, cookie parsing for basic cookie handling.

#### 1- Assigning Middleware To Routes

If you would like to assign middleware to specific routes, you shoud use `withMiddleware` methods:

```ts
const middleware = async function(Request: HttpRequest, ResponseWriter: HttpResponse) {
  console.log(Request.method());
  return MiddlewareState.Next;
}

const r = app.routes();
  r.Path("/middleware/example")
  .withMethods(RequestMethod.GET)
  .withMiddleware(middleware)
  .handleFunc(async function (Request: HttpRequest, ResponseWriter: HttpResponse): Promise<any> {
    //
  });
```

> 💬 To pass the request deeper into the application, you must call the `MiddlewareState.Next` on the other hand  you can use `MiddlewareState.Cancel` to terminate the middleware.

#### 2- Middleware Groups

Sometimes you may want to group several middleware under a single key to make them easier to assign to routes.
You may accomplish this using the `withMiddlewareGroups`:

```ts

const StartSession = async function(Request: HttpRequest, ResponseWriter: HttpResponse) {
  //
  return MiddlewareState.Next;
}

const VerifyCsrfToken = async function(Request: HttpRequest, ResponseWriter: HttpResponse) {
  //
  return MiddlewareState.Next;
}

const r = app.routes();
  r.Path("/grouped/middlewares/example")
  .withMethods(RequestMethod.GET)
  .withMiddlewareGroups("web", [StartSession,VerifyCsrfToken])
  .handleFunc(async function (Request: HttpRequest, ResponseWriter: HttpResponse): Promise<any> {
    //
  });
```

#### 3- Global Middleware

If you want a middleware to run during every HTTP request to your application, you should use `globalMiddleware` methods:

```ts

const middleware = async function(Request: HttpRequest, ResponseWriter: HttpResponse) {
  //
  return MiddlewareState.Next;
}

const r = app.routes();
  r.Path("/global/middlewares/example")
  .withMethods(RequestMethod.GET)
  .globalMiddleware(middleware)
  .handleFunc(async function (Request: HttpRequest, ResponseWriter: HttpResponse): Promise<any> {
    //
  });
```

### Full Examples

Here's a complete, runnable example of a small Dragon based server:

```ts
import {
  Application,
  HttpRequest,
  HttpResponse,
  RequestMethod
} from "./lib/mod.ts";

async function main(args: string[]): Promise<void> {
  const app = new Application();
  const r = app.routes({ maxRoutes:1 });
  r.Path("/Dragon")
   .withMethods(RequestMethod.GET)
   .withName("root")
   .handleFunc(async function (Request: HttpRequest, ResponseWriter: HttpResponse): Promise<any> {
      //
   });

app.listenAndServe({ port: 8080 });

}

main(Deno.args).then(() => {
  console.log("Serveur listining");
});

```

## Benchmarks

**Machine**: 7,6 GiB, Intel® Core™ i5-3210M CPU @ 2.50GHz × 4 , Intel® Ivybridge Mobile, 320,1 GB.

**method**: `autocannon -c 100 -d 40 -p 10 localhost:8080` , taking the second average

| Framework     | Version       | Router? | Results                                    |
| ------------- |:-------------:| :------:| ------------------------------------------:|
| Express       | 4.17.1        | ✓       | 166k requests in 40.08s, 39.5 MB read      |
| Fastify       | 3.9.1         | ✓       | 1081k requests in 40.07s ,189 MB read      |
| Oak           | 4.0.0         | ✓       | 243k requests in 40.12s, 27 MB read        |
| **Dragon**     | **1.0.0**     | **✓**   | **416k requests in 40.21s, 37.1 MB read**  |

This is a synthetic, `hello world` benchmark that aims to evaluate the framework overhead. The overhead that each framework has on your application depends on your application, you should **always** benchmark if performance matters to you.

## Contributing

We appreciate your help 👋!

We encourage you to contribute to Dragon! Please check out the  [guidelines](/CONTRIBUTING) about how to proceed.

## Sponsors

We would like to extend our thanks to the following sponsors for funding Dragon development. If you are interested in becoming a sponsor, please visit the Dragon [Open collective page](opencollective.com/Dragon-projects).

## Code of Conduct

In order to ensure that the Dragon community is welcoming to all, please review and abide by the [Code of Conduct](/CODE_OF_CONDUCT).

## Security Issues

If you discover a security vulnerability in Dragon, please see [Security Policies and Procedures](/SECURITY).

## Changelog

Detailed changes for each release are documented in the [release notes](/CHANGELOG).

## People

- The original author of Dragon is [Yasser A.Idrissi](https://github.com/getspooky).

- [List of all contributors](https://github.com/Dragon-projects/Dragon/graphs/contributors)

## License

The Dragon framework is open-sourced software licensed under the [Apache-2.0 License](https://www.apache.org/licenses/LICENSE-2.0).


