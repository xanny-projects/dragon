# Xanny

<p align="left">

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/xanny-projects/xanny/ci)
![GitHub issues](https://img.shields.io/github/issues/xanny-projects/xanny)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/xanny-projects/xanny)

</p>

<img align="right" src="https://avatars2.githubusercontent.com/u/75166135?s=150&v=4" height="150px">

Xanny is a _simple_, _fast_ and _low_ **HTTP** router and **URL** marcher for building **Deno** servers. If you need performance and good productivity, you will love it.

### Features

- Developer friendly, very expressive and help the developer in their daily use, without sacrificing performance and security.
- Lightweight and modular design allows for a flexible framework.
- Focus on high performance.
- Middleware support, incoming HTTP request can be handled by a chain of middlewares and the final action.
- Excellent and fluent documentation.

## Getting Started

Let's start registering a couple of URL paths and handlers:

```ts
import { Application, RequestMethod, HttpRequest, HttpResponse } from "https://deno.land/x/xanny@v1.0.0/lib/mod.ts";

const app = new Application();

const r = app.NewRoute({ maxRoutes:2 });

r.WithMethods(RequestMethod.GET)
    .Path("/hello")
    .HandleFunc(async function (Request: HttpRequest, ResponseWriter: HttpResponse) {
      ResponseWriter.WithBody("Hello Xanny").Return();
    })
    .Path("/demo")
    .HandleFunc(async function (Request: HttpRequest, ResponseWriter: HttpResponse) {
      ResponseWriter.WithBody("Hello Xanny Demo").Return();
    });

app.ListenAndServe({ port: 8080 });
```

Here we register two routes mapping URL path to handler. if an incoming request URL matches one of the paths, the corresponding handler is called passingWe believe development must be an enjoyable and creative experience to be truly fulfilling
(`HttpRequest`, `HttpResponse`) as parameters.

## Documentation

Get started with Xanny, learn the fundamentals and explore advanced topics.

### Table of content

* [Installation](#install)
* [Configuration](#configuration)
* [Routing](#routing)
* [Requests](#Request-Object)
* [Headers](#Request-Headers-&-Attaching-Headers-To-Responses)
* [Responses](#Response-Object)
* [Cookies](#Cookies)
* [Middlewares](#Middlewares)
* [Full Example](#Full-Example)

### Installation

Assuming you’ve already installed **Deno**, create a directory to hold your application, and make that your working directory.

```sh
$ mkdir xanny-app
$ cd xanny-app
```

Creates an Xanny application. The `Application` class exported from xanny module and sets up the application with various options.

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

Xanny provides a very simple and expressive method of defining routes and behavior without complicated routing configuration files:

```ts
const r = app.NewRoute();
  r.WithMethods(RequestMethod.GET)
  .Path("/hello")
  .HandleFunc(function (Request: HttpRequest, ResponseWriter: HttpResponse) {
    ResponseWriter.WithBody("Hello Xanny").Return();
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
const r = app.NewRoute();
  r.WithMethods(RequestMethod.GET);
  r.WithMethods(RequestMethod.POST);
  r.WithMethods(RequestMethod.PUT);
  r.WithMethods(RequestMethod.DELETE);
  r.WithMethods(RequestMethod.PATCH);
```

Sometimes you may need to register a route that responds to multiple HTTP verbs.

```ts
const r = app.NewRoute();
  r.WithMethods(RequestMethod.GET, RequestMethod.POST);
```

#### 3- Route Parameters

Sometimes you will need to capture segments of the URI within your route.
For example, you may need to capture a user's ID from the URL. You may do so by defining route parameters:

```ts
const r = app.NewRoute();
  r.WithMethods(RequestMethod.GET)
   .Path(/user\/(?<id>[0-9]{1,})/u)
   .HandleFunc(async function (Request: HttpRequest, ResponseWriter: HttpResponse): Promise<any> {
       const { id:userID } = await Request.GetParams();
       ResponseWriter.WithBody(`User with id ${userID}`).Return();
    });
```

You may define as many route parameters as required by your route.

> 🚨 Xanny uses regex named group in order to match parameters.

#### 4- Named Routes

Named routes allow to get handler. You may specify a `WithName` for a route by chaining the name method onto the route definition:

```ts
const r = app.NewRoute();
  r.WithMethods(RequestMethod.GET)
   .Path("/user/profile")
   .WithName("profile")
   .HandleFunc(async function (Request: HttpRequest, ResponseWriter: HttpResponse): Promise<any> {
       //
    });
```

### Request Object

The `HttpRequest` class provides an object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on.

The following table specifies some of the methods associated with request object.

| Index         | Methods                       | Description                                                    |
|:-------------:| :-----------------------------| :--------------------------------------------------------------|
| 1             | *GetMethod*                   | Returns the HTTP verb for the request.                         |
| 2             | *Url*                         | Returns the full URL for incoming request.                     |
| 4             | *UrlQuery*                    | Returns the full URL for incoming request.                     |
| 5             | *UrlQuery*                    | Returns the full URL for incoming request (with query string). |
| 6             | *GetPath*                     | Returns the request's path information                         |
| 7             | *IsXHR*                       | Check if the request was an `_XMLHttpRequest_`.                |
| 8             | *HostName*                    | Returns the `Host` header field to a hostname.                 |
| 9             | *IsIpv4*                      | Value must be valid IPv4.                                      |
| 10            | *IsIpv6*                      | Value must be valid IPv6.                                      |
| 11            | *ContentLength*               | Indicates the size of the entity-body, in bytes, sent to the recipient.                                      |
| 12            | *GetBody*                     | It contains key-value pairs of data submitted in the request body                                            |
| 13            | *GetBodyWithoutParser*        | Get the body of the message without parsing.                    |
| 14            | *GetContentType*              | Returns the media type of the resource.                         |
| 15            | *GetContentType*              | Returns the media type of the resource.                         |
| 16            | *GetProtocol*                 | Returns `http` or `https` when requested with TLS.              |
| 17            | *GetQueryParams*              | Returns an array of object containing a property for each query string parameter in the route.   |
| 18            | *GetQueryParam*               | Returns specific query param.                                   |
| 19            | *Secure*                      | Verify if the request is secure `HTTPS`.                        |
| 20            | *GetParams*                   | An object containing properties mapped to the named route `parameters` For example, if you have the route /user/:name, then the "name" property is available as `const {name} = GetParams();` This object defaults to {}.                     |
| 22            | *Secure*           | Verify if the request is secure `HTTPS`.                        |

### Request Headers & Attaching Headers To Responses

The Headers interface allows you to perform various actions on HTTP request and response headers. These actions include retrieving, setting, adding to, and removing headers from the list of the request's headers.

You may retrieve a request header from the `HttpRequest` and `HttpResponse` instance using the `GetHeader`
or `GetHeaders` method. If the header is not present on the request, null will be returned.

```ts
const HandlerFun = async function(Request: HttpRequest, ResponseWriter: HttpResponse) {
  // Retrieves a message header value by the name.
  const v1 = Request.GetHeader('X-Header-Name');
  // Retrieves all message header values.
  const v2 = Request.GetHeaders();
}
```

The `HasHeader` method may be used to determine if the request contains a given header:

```ts
if (Request.HasHeader('X-Header-Name')) {
    //
}
```

The `RemoveHeader` method is used to remove given header if exists :

```ts
Request.RemoveHeader('X-Header-Name');
```

The `WithHeader` method is used to add a series of headers to the response before sending it back to the user.

```ts
Request.WithHeader('X-Header-One', 'Header Value')
       .WithHeader('X-Header-One', 'Header Value')
       .Return();
```

> 💬 Keep in mind that most response methods are chainable, allowing for the fluent construction of response instances.

### Response Object

All routes should return a response to be sent back to the user's browser. Xanny provides several different ways to return responses.

Let's see some methods of response object.

| Index         | Methods              | Description                                                    |
|:-------------:| :-----------------| :-----------------------------------------------------------------|
| 1             | *GetStatusCode*     | Set the response status code. The status code is a 3-digit integer result code of the server's attempt.|
| 2             | *WithStatus*        | Set an instance with the specified status code.                 |
| 3             | *WithContentLength* | Set Content-Length field to `n`.                                |
| 4             | *WithLastModified*  | Set the Last-Modified date using a `string` or a `Date`.        |
| 5             | *Html*              | Renders a view and sends the rendered HTML string to the client.|
| 6             | *Json*              | Returns the response in JSON format ,as well as set the `Content-Type` header to `application/json` |
| 7             | *IsRedirectStatus* | Determines if a HTTP `Status` is a `RedirectStatus` (3XX).       |
| 8             | *WithBody*         | Set the response body. |

### Cookies

Cookies are small piece of information i.e. sent from a website and stored in user's web browser when user browses that website. Every time the user loads that website back, the browser sends that stored data back to website or server, to recognize user.

Let's define a new route in your xanny app like set a new cookie:

```ts
const r = app.NewRoute();
  r.WithMethods(RequestMethod.GET)
   .Path("/demo")
   .HandleFunc(async function (Request: HttpRequest, ResponseWriter:  HttpResponse): Promise<any> {
       ResponseWriter.WithCookie("id=a3fWa; Max-Age=2592000").Return();
    });
```

### Middlewares

Middleware provide a convenient mechanism for inspecting and filtering HTTP requests entering your application. Middleware functions are always invoked in the order in which they are added.

Middleware is commonly used to perform tasks like body parsing for URL-encoded or JSON requests, cookie parsing for basic cookie handling.

#### 1- Assigning Middleware To Routes

If you would like to assign middleware to specific routes, you shoud use `WithMiddleware` methods:

```ts
const middleware = async function(Request: HttpRequest, ResponseWriter: HttpResponse) {
  console.log(Request.GetMethod());
  return MiddlewareState.Next;
}

const r = app.NewRoute();
  r.WithMethods(RequestMethod.GET)
  .Path("/middleware/example")
  .WithMiddleware(middleware)
  .HandleFunc(async function (Request: HttpRequest, ResponseWriter: HttpResponse): Promise<any> {
    //
  });
```

> 💬 To pass the request deeper into the application, you must call the `MiddlewareState.Next` on the other hand  you can use `MiddlewareState.Cancel` to terminate the middleware.

#### 2- Middleware Groups

Sometimes you may want to group several middleware under a single key to make them easier to assign to routes.
You may accomplish this using the `WithMiddlewareGroups`:

```ts

const StartSession = async function(Request: HttpRequest, ResponseWriter: HttpResponse) {
  //
  return MiddlewareState.Next;
}

const VerifyCsrfToken = async function(Request: HttpRequest, ResponseWriter: HttpResponse) {
  //
  return MiddlewareState.Next;
}

const r = app.NewRoute();
  r.WithMethods(RequestMethod.GET)
  .Path("/grouped/middlewares/example")
  .WithMiddlewareGroups("web", [StartSession,VerifyCsrfToken])
  .HandleFunc(async function (Request: HttpRequest, ResponseWriter: HttpResponse): Promise<any> {
    //
  });
```

#### 3- Global Middleware

If you want a middleware to run during every HTTP request to your application, you should use `GlobalMiddleware` methods:

```ts

const middleware = async function(Request: HttpRequest, ResponseWriter: HttpResponse) {
  //
  return MiddlewareState.Next;
}

const r = app.NewRoute();
  r.WithMethods(RequestMethod.GET)
  .Path("/global/middlewares/example")
  .GlobalMiddleware(middleware)
  .HandleFunc(async function (Request: HttpRequest, ResponseWriter: HttpResponse): Promise<any> {
    //
  });
```

### Full Examples

Here's a complete, runnable example of a small xanny based server:

```ts
import {
  Application,
  HttpRequest,
  HttpResponse,
  RequestMethod
} from "./lib/mod.ts";

async function main(args: string[]): Promise<void> {
  const app = new Application();
  const r = app.NewRoute({ maxRoutes:1 });
  r.WithMethods(RequestMethod.GET)
   .Path("/xanny")
   .WithName("")
   .HandleFunc(async function (Request: HttpRequest, ResponseWriter: HttpResponse): Promise<any> {
      //
   });

 app.ListenAndServe({ port: 4200 });

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
| **Xanny**     | **1.0.0**     | **✓**   | **416k requests in 40.21s, 37.1 MB read**  |

This is a synthetic, `hello world` benchmark that aims to evaluate the framework overhead. The overhead that each framework has on your application depends on your application, you should **always** benchmark if performance matters to you.

## Contributing

We appreciate your help 👋!

We encourage you to contribute to Xanny! Please check out the  [guidelines](/CONTRIBUTING) about how to proceed.

## Sponsors

We would like to extend our thanks to the following sponsors for funding xanny development. If you are interested in becoming a sponsor, please visit the Xanny [Open collective page](opencollective.com/xanny-projects).

## Code of Conduct

In order to ensure that the Xanny community is welcoming to all, please review and abide by the [Code of Conduct](/CODE_OF_CONDUCT).

## Security Issues

If you discover a security vulnerability in Xanny, please see [Security Policies and Procedures](/SECURITY).

## Changelog

Detailed changes for each release are documented in the [release notes](/CHANGELOG).

## People

- The original author of Xanny is [Yasser A.Idrissi](https://github.com/getspooky).

- [List of all contributors](https://github.com/xanny-projects/xanny/graphs/contributors)

## License

The Xanny framework is open-sourced software licensed under the [Apache-2.0 License](https://www.apache.org/licenses/LICENSE-2.0).


