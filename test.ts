import {
  Application,
  HttpRequest,
  HttpResponse,
  RequestMethod,
} from "./lib/mod.ts";

const TimeOut = async function(Request: HttpRequest, ResponseWriter: HttpResponse) {
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      console.log("1")
      resolve("1");
    },1000);
  });}

const TimeOutFirst = async function(Request: HttpRequest, ResponseWriter: HttpResponse) {
  console.log("hello");
}


async function main(): Promise<void> {
  const app = new Application();
  const r = app.NewRoute({ maxRoutes:1 });
  r.WithMethods(RequestMethod.POST)
    .Path("/graphql")
    .HandleFunc(async function (Request: HttpRequest, ResponseWriter: HttpResponse): Promise<any> {
       console.log(await Request.GetBody());
    });

  app.ListenAndServe({ port: 8080 });
}

main().then(() => {
  console.log("Serveur listining");
});
