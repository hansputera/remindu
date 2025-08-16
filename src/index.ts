import swagger from '@elysiajs/swagger';
import { Elysia } from "elysia";
import { EnvManager } from './utils/EnvManager';
import AuthController from './controllers/AuthController';
import UserController from './controllers/UserController';

const port: number = EnvManager.getPort();
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
  .get("/", () => {
    return {
      message: "Hello Elysia"
    }
  })
  .group('/api', (app) => 
    app
      .use(AuthController)
      .use(UserController)
  )
  .listen(port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
