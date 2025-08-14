import swagger from '@elysiajs/swagger';
import { Elysia } from "elysia";

const port = Bun.env.APP_PORT || 3000;
const app = new Elysia()
  .use(
    swagger({
      path: '/docs',
      specPath: '/docs/openapi-spec.json',
      scalarConfig: {
        spec: {
          url: '/docs/openapi-spec.json'
        }
      },
      provider: 'scalar',
      documentation: {
        info: {
          title: 'remindU API documentation',
          version: '0.0.1'
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT'
            }
          }
        }
      }
    })
  )
  .get("/", () => "Hello Elysia")
  .get("/test", () => {
    return {
      message: "json response",
      custom_field: "custom value",
    };
  })
  .listen(port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
