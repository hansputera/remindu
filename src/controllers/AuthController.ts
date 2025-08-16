import jwt from '@elysiajs/jwt';
import { Elysia, t } from "elysia";
import { EnvManager } from '../utils/EnvManager';
import { UserModel } from '../databases/model/User';
import { LoginBodyRequest, LoginSuccessResponse, RegisterBodyRequest } from '../types/Auth';
import { GeneralResponse } from '../types/General';

const AuthController = new Elysia({ prefix: '/auth' })
    .use(
      jwt({
        name: 'jwt',
        secret: EnvManager.getJWTSecret(),
        exp: EnvManager.getJWTExpired()
      })
    )
    .post("/login", async ({ jwt, body, set }) => {
      const { email, password } = body;
      const user = await UserModel.getByEmail(email);
      if (!user) {
        set.status = 400;
        return {
          status: 'error',
          message: 'Invalid credentials'
        };
      }
      
      const matchPassword = await Bun.password.verify(
        password,
        user.password,
        "bcrypt"
      );
      
      if (!matchPassword) {
        set.status = 400;
        return {
          status: 'error',
          message: 'Invalid credentials'
        };
      }
      
      //-- can add more data here
      const token = await jwt.sign({ 
        id: user.id 
      });
      
      return {
        status: 'success',
        message: 'Data found',
        token
      };
    }, 
    {
      body: LoginBodyRequest,
      response: {
        200: LoginSuccessResponse,
        400: GeneralResponse
      },
      error({ code, error }) {
        switch (code) {
          case 'VALIDATION':
            const fields = [
              { path: '/email', field: 'email', message: 'Invalid email.' },
              { path: '/email', field: 'email', message: 'Email is required.' },
              { path: '/password', field: 'password', message: 'Password is required.' },
              { path: '/password', field: 'password', message: 'Password must be at least 8 characters long.' }
            ];

            const [errors] = fields
                .filter(field => error.all.some(e => e.summary && e.path === field.path))
                .map(field => ({ field: field.field, message: field.message }));

            return {
              status: 'error',
              message: 'Invalid request.',
              errors
            }
        }
      },
      detail: {
        summary: 'Login',
        description: "Login user",
        tags: ['Auth'],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                    description: "User's email.",
                    examples: "john@example.com"
                  },
                  password: {
                    type: "string",
                    description: "User's password.",
                    examples: "12345678"
                  }
                },
                required: ["email", "password"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Login success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      description: "Indicates if the request was success or error.",
                      enum: ["success", "error"],
                      example: "success"
                    },
                    message: {
                      type: "string",
                      description: "Message indicating the result of the request.",
                      example: "User logged in successfully."
                    },
                    token: {
                      type: "string",
                      description: "JWT token for the user.",
                      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
                    }
                  },
                  required: ["status", "message", "token"]
                }
              }
            }
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      description: "Indicates if the request was success or error.",
                      enum: ["success", "error"],
                      example: "success"
                    },
                    message: {
                      type: "string",
                      description: "Message indicating the result of the request.",
                      example: "Invalid request."
                    },
                    errors: {
                      type: "array",
                      description: "Array of errors.",
                      items: {
                        type: "object",
                        properties: {
                          field: {
                            type: "string",
                            description: "Field name.",
                            example: "email"
                          },
                          message: {
                            type: "string",
                            description: "Error message.",
                            example: "Invalid email."
                          }
                        },
                        required: ["field", "message"]
                      }
                    }
                  },
                  required: ["success", "message"]
                }
              }
            }
          }
        }
      }
    })
    .post("/register", async ({ jwt, body, set }) => {
      const encryptPassword = await Bun.password.hash(body.password, {
        algorithm: "bcrypt",
        cost: 10
      });
      
      const findUser = await UserModel.getByEmail(body.email);
      if (findUser) {
        set.status = 400;
        return {
          status: "error",
          message: "User already exists."
        }
      }
      
      const registerUser = await UserModel.create({
        fullName: body.fullName,
        email: body.email,
        password: encryptPassword,
        phone: body.phone
      });
      
      //-- can add more data here
      const token = await jwt.sign({ 
        id: registerUser.id 
      });
      return {
        status: "success",
        message: "User registered successfully.",
        token
      }
    },
    {
      body: RegisterBodyRequest,
      response: {
        200: LoginSuccessResponse,
        400: GeneralResponse
      },
      error({ code, error }) {
        switch (code) {
          case 'VALIDATION':
            const fields = [
              { path: '/email', field: 'email', message: 'Email is required.' },
              { path: '/email', field: 'email', message: 'Invalid email.' },
              { path: '/password', field: 'password', message: 'Password is required.' },
              { path: '/password', field: 'password', message: 'Password must be at least 8 characters long.' },
              { path: '/phone', field: 'phone', message: 'Phone is required.' },
              { path: '/phone', field: 'phone', message: 'Phone max 20 characters long.' },
            ];

            const [errors] = fields
              .filter(field => error.all.some(e => e.summary && e.path === field.path))
              .map(field => ({ field: field.field, message: field.message }));

            return {
              success: false,
              message: "Invalid request.",
              errors
            }
        }
      },
      detail: {
        summary: "Register",
        description: "Register a new user.",
        tags: ["Auth"],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                    description: "User's email.",
                    examples: "john@example.com"
                  },
                  password: {
                    type: "string",
                    description: "User's password.",
                    examples: "12345678"
                  },
                  phone: {
                    type: "string",
                    maxLength: 20,
                    description: "User's phone.",
                    examples: "081234132"
                  },
                  fullName: {
                    type: "string",
                    description: "User's full name.",
                    examples: "John Doe"
                  },
                },
                required: ["email", "password", "phone"]
              }
            }
          }
        },
        responses: {
          200: {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      description: "Indicates if the request was success or error.",
                      enum: ["success", "error"],
                      example: "success"
                    },
                    message: {
                      type: "string",
                      description: "Message indicating the result of the request.",
                      example: "User registered successfully."
                    },
                    token: {
                      type: "string",
                      description: "JWT token for the user.",
                      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 example"
                    }
                  },
                  required: ["status", "message", "token"]
                }
              }
            }
          },
          400: {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      description: "Indicates if the request was success or error.",
                      enum: ["success", "error"],
                      example: "success"
                    },
                    message: {
                      type: "string",
                      description: "Message indicating the result of the request.",
                      example: "Invalid request."
                    },
                    errors: {
                      type: "array",
                      description: "Array of errors.",
                      items: {
                        type: "object",
                        properties: {
                          field: {
                            type: "string",
                            description: "Field name.",
                            example: "email"
                          },
                          message: {
                            type: "string",
                            description: "Error message.",
                            example: "Invalid email."
                          }
                        },
                        required: ["field", "message"]
                      }
                    }
                  },
                  required: ["success", "message"]
                }
              }
            }
          }
        }
      }
    });

export default AuthController;