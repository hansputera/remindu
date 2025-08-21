import { Elysia, t } from 'elysia';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { UserInfoRequest, UserSuccessResponse } from '../types/User';
import { User, UserModel } from '../databases/model/User';
import { GeneralResponse } from '../types/General';


const UserController = new Elysia()
    .group('/user', (app) => app
      .use(AuthMiddleware)
      .onBeforeHandle(async ({ authorized, set }) => {
        if (!authorized) {
          set.status = 401;
          return {
            status: 'error',
            message: "Unauthorized."
          }
        }
      })
      .get("/get", async ({ user }) => {
        const userData = user as User;
        return {
          status: 'success',
          message: "Successfully retrieved user.",
          data: {
            fullName: userData.fullName,
            phone: userData.phone,
            email: userData.email
          }
        }
      }, {
        response: {
          200: UserSuccessResponse,
          401: GeneralResponse,
        },
        detail: {
          summary: "Get User",
          description: "Get an existing user.",
          tags: ["Users"],
          security: [{ JwtAuth: [] }],
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
                        example: "Successfully retrieved user."
                      },
                      data: {
                        description: "User data.",
                        type: "object",
                        properties: {
                          id: {
                            type: "number",
                            description: "User ID.",
                            example: 1
                          },
                          fullName: {
                            type: "string",
                            description: "User full name.",
                            example: "John Doe"
                          },
                          phone: {
                            type: "string",
                            description: "User full name.",
                            example: "John Doe"
                          },
                          email: {
                            type: "string",
                            description: "User email.",
                            example: "john@example.com"
                          },
                        }
                      }
                    },
                    required: ["status", "message", "data"]
                  }
                }
              }
            },
            401: {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "string",
                        description: "Indicates if the request was success or error.",
                        enum: ["success", "error"],
                        example: "error"
                      },
                      message: {
                        type: "string",
                        description: "Message indicating the result of the request.",
                        example: "Forbidden."
                      }
                    },
                    required: ["status", "message"]
                  }
                }
              }
            }
          }
        }
      })
      .put("/password", async ({ body, user, set }) => {
        const { newPassword, oldPassword } = body;
        const userData = user as User;
        
        const matchPassword = await Bun.password.verify(
          oldPassword,
          userData.password,
          "bcrypt"
        );
        
        if (!matchPassword) {
          set.status = 401;
          return {
            status: 'error',
            message: 'Invalid credentials'
          };
        }
        
        const hashedPassword = await Bun.password.hash(newPassword, "bcrypt");
        const result = await UserModel.updatePassword(userData.id, hashedPassword);
        if (result < 1) {
          set.status = 422;
          return {
            status: 'error',
            message: 'Error updating password'
          };
        }
        
        return {
          status: 'success',
          message: "Password changed successfully."
        }
      }, {
        body: t.Object({
          newPassword: t.String({ minLength: 8 }),
          oldPassword: t.String({ minLength: 8 }),
        }),
        error({ code, error }) {
          switch (code) {
            case 'VALIDATION':
              const fields = [
                { path: '/oldPassword', field: 'newPassword', message: 'Old Password is required.' },
                { path: '/oldPassword', field: 'newPassword', message: 'Old Password must be at least 8 characters long.' },
                { path: '/newPassword', field: 'newPassword', message: 'New Password is required.' },
                { path: '/newPassword', field: 'newPassword', message: 'New Password must be at least 8 characters long.' },
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
        response: {
          200: GeneralResponse,
          401: GeneralResponse,
          422: GeneralResponse,
        },
        detail: {
          summary: "Change Password",
          description: "Change user password.",
          tags: ["Users"],
          security: [{ JwtAuth: [] }],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    newPassword: {
                      type: "string",
                      description: "User's password.",
                      examples: "12345678"
                    },
                    oldPassword: {
                      type: "string",
                      description: "User's password.",
                      examples: "12345678"
                    }
                  },
                  required: ["newPassword", "oldPassword"]
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
                        example: "Password changed successfully."
                      }
                    },
                    required: ["status", "message"]
                  }
                }
              }
            },
            401: {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "string",
                        description: "Indicates if the request was success or error.",
                        enum: ["success", "error"],
                        example: "error"
                      },
                      message: {
                        type: "string",
                        description: "Message indicating the result of the request.",
                        example: "Forbidden."
                      }
                    },
                    required: ["status", "message"]
                  }
                }
              }
            },
            422: {
              description: "Unprocessable Entity",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "string",
                        description: "Indicates if the request was success or error.",
                        enum: ["success", "error"],
                        example: "error"
                      },
                      message: {
                        type: "string",
                        description: "Message indicating the result of the request.",
                        example: "Error updating password"
                      }
                    },
                    required: ["status", "message"]
                  }
                }
              }
            }
          }
        }
      })
      .put("/email", async ({ body, userId, set }) => {
        const { email } = body;    
        const result = await UserModel.updateEmail(userId as number, email);
        if (result < 1) {
          set.status = 422;
          return {
            status: 'error',
            message: 'Error updating email'
          };
        }
        
        return {
          status: 'success',
          message: "Email changed successfully."
        }
      }, {
        body: t.Object({
          email: t.String({ format: 'email' }),
        }),
        error({ code, error }) {
          switch (code) {
            case 'VALIDATION':
              const fields = [
                { path: '/email', field: 'email', message: 'Email is required.' },
                { path: '/email', field: 'email', message: 'Invalid email.' },
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
        response: {
          200: GeneralResponse,
          401: GeneralResponse,
          422: GeneralResponse,
        },
        detail: {
          summary: "Change Email",
          description: "Change user email.",
          tags: ["Users"],
          security: [{ JwtAuth: [] }],
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
                    }
                  },
                  required: ["email"]
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
                        example: "Email changed successfully."
                      }
                    },
                    required: ["status", "message"]
                  }
                }
              }
            },
            401: {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "string",
                        description: "Indicates if the request was success or error.",
                        enum: ["success", "error"],
                        example: "error"
                      },
                      message: {
                        type: "string",
                        description: "Message indicating the result of the request.",
                        example: "Forbidden."
                      }
                    },
                    required: ["status", "message"]
                  }
                }
              }
            },
            422: {
              description: "Unprocessable Entity",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "string",
                        description: "Indicates if the request was success or error.",
                        enum: ["success", "error"],
                        example: "error"
                      },
                      message: {
                        type: "string",
                        description: "Message indicating the result of the request.",
                        example: "Error updating email"
                      }
                    },
                    required: ["status", "message"]
                  }
                }
              }
            }
          }
        }
      })
      .put("/info", async ({ body, userId, set }) => {
        const { phone, fullName } = body;
        const result = await UserModel.updateNameAndPhone(userId as number, fullName, phone);
        if (result < 1) {
          set.status = 422;
          return {
            status: 'error',
            message: 'Error updating info'
          };
        }
        
        return {
          status: 'success',
          message: "Info changed successfully."
        }
      }, {
        body: UserInfoRequest,
        error({ code, error }) {
          switch (code) {
            case 'VALIDATION':
              const fields = [
                { path: '/phone', field: 'phone', message: 'Phone is required.' },
                { path: '/phone', field: 'phone', message: 'Phone max 20 characters long.' },
                { path: '/fullName', field: 'fullName', message: 'Full Name is required.' },
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
        response: {
          200: GeneralResponse,
          401: GeneralResponse,
          422: GeneralResponse,
        },
        detail: {
          summary: "Change Info",
          description: "Change user info.",
          tags: ["Users"],
          security: [{ JwtAuth: [] }],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    fullName: {
                      type: "string",
                      description: "User's full name.",
                      examples: "John Doe"
                    },
                    phone: {
                      type: "string",
                      description: "User's phone.",
                      examples: "081234132"
                    }
                  },
                  required: ["fullName", "phone"]
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
                        example: "Info changed successfully."
                      }
                    },
                    required: ["status", "message"]
                  }
                }
              }
            },
            401: {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "string",
                        description: "Indicates if the request was success or error.",
                        enum: ["success", "error"],
                        example: "error"
                      },
                      message: {
                        type: "string",
                        description: "Message indicating the result of the request.",
                        example: "Forbidden."
                      }
                    },
                    required: ["status", "message"]
                  }
                }
              }
            },
            422: {
              description: "Unprocessable Entity",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "string",
                        description: "Indicates if the request was success or error.",
                        enum: ["success", "error"],
                        example: "error"
                      },
                      message: {
                        type: "string",
                        description: "Message indicating the result of the request.",
                        example: "Error updating info"
                      }
                    },
                    required: ["status", "message"]
                  }
                }
              }
            }
          }
        }
      })
    );
    
export default UserController;