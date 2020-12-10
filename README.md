# Xanny

<p align="left">
  
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
const app = new Application({ maxRoutes:2 });

const r = app.NewRoute();

r.WithMethods(RequestMethod.GET)
    .Path("/hello")
    .HandleFunc(function (Request: HttpRequest, ResponseWriter: HttpResponse) {
      console.log("Hello Xanny");
    })
    .Path("/demo")
    .HandleFunc(function (Request: HttpRequest, ResponseWriter: HttpResponse) {
      console.log("Hello Xanny Demo");
    });

app.ListenAndServe({ port: 8080 });    
```

Here we register two routes mapping URL path to handler. if an incoming request URL matches one of the paths, the corresponding handler is called passingWe believe development must be an enjoyable and creative experience to be truly fulfilling
(`HttpRequest`, `HttpResponse`) as parameters.

## Contributing

We appreciate your help 👋!

We encourage you to contribute to Xanny! Please check out the  [guidelines](/CONTRIBUTING) about how to proceed. [Join us!]()

## Sponsors

We would like to extend our thanks to the following sponsors for funding xanny development. If you are interested in becoming a sponsor, please visit the Xanny [Open collective page]().

## Code of Conduct

In order to ensure that the Xanny community is welcoming to all, please review and abide by the [Code of Conduct](/CODE_OF_CONDUCT).

## Security Issues

If you discover a security vulnerability in Xanny, please see [Security Policies and Procedures](/SECURITY).

## People 

- The original author of Xanny is [Yasser A.Idrissi
](https://github.com/getspooky).

- [List of all contributors](https://github.com/xanny-projects/xanny/graphs/contributors)

## License

The Xanny framework is open-sourced software licensed under the [Apache-2.0 License](https://www.apache.org/licenses/LICENSE-2.0).


