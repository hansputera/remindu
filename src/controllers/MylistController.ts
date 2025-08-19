import { Elysia, t } from 'elysia';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { GeneralResponse, ParamId, WaitingTypeEnum } from '../types/General';
import { MyListModel } from '../databases/model/Mylist';
import { MyListAllResponse, MyListReminderBodyRequest, MyListResponse, MyListStatusRequest, ReminderBody } from '../types/MyList';

const MylistController = new Elysia()
    .group('/mylist', (app) => app
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
      .get('/', async ({ userId }) => {
        const lists = await MyListModel.getByUserId(userId as number);
        const transformList = [];
        for (const list of lists) {
          transformList.push({
            id: list.id,
            title: list.title,
            image: list.image,
            episode: list.episode,
            status: list.status,
            waitingType: list.waitingType,
            onEpisode: list.onEpisode,
            onDate: list.onDate,
            createdAt: list.createdAt,
            updatedAt: list.updatedAt,
          });
        }
        
        return {
          status: 'success',
          message: "Successfully retrieved lists.",
          data: transformList
        }
      }, {
        response: {
          200: MyListAllResponse
        },
        detail: {
          summary: "Get All List",
          description: "Get all list data.",
          tags: ["MyList"],
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
                        example: "MyList status changed successfully."
                      },
                      data: {
                        description: "Lists of data.",
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: {
                              type: "number",
                              description: "List ID.",
                              example: 1
                            },
                            title: {
                              type: "string",
                              description: "List title.",
                              example: "One Piece"
                            },
                            image: {
                              type: "string",
                              description: "List image.",
                              example: "https://example.com/image.jpg"
                            },
                            episode: {
                              type: "number",
                              description: "List episode.",
                              example: 100
                            },
                            status: {
                              type: "string",
                              enum: ["active", "inactive"],
                              description: "List status.",
                              example: "active"
                            },
                            waitingType: {
                              type: "string",
                              enum: ["date", "episode", "disabled"],
                              description: "Waiting type.",
                              example: "disabled"
                            },
                            onEpisode: {
                              type: "number",
                              description: "Waiting on episode.",
                              example: 100
                            },
                            onDate: {
                              type: "string",
                              format: "date",
                              description: "Waiting on date.",
                              example: "2025-08-25T00:00:00.000Z"
                            },
                            createdAt: {
                              type: "string",
                              format: "date-time",
                              description: "List created at.",
                              example: "2023-05-28T10:00:00.000Z"
                            },
                            updatedAt: {
                              type: "string",
                              format: "date-time",
                              description: "List updated at.",
                              example: "2023-05-28T10:00:00.000Z"
                            }
                          }
                        }
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
            }
          }
        }
      })
      .get('/get/:id', async ({ params, userId, set }) => {
        const { id } = params;
        const list = await MyListModel.getById(id, userId as number);
        return {
          status: 'success',
          message: "Successfully retrieved list.",
          data: list
        }
      }, {
        params: ParamId,
        response: {
          200: MyListResponse
        },
        detail: {
          summary: "Get List",
          description: "Get list data.",
          tags: ["MyList"],
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
                        example: "Successfully retrieved list."
                      },
                      data: {
                        type: "object",
                        properties: {
                          id: {
                            type: "number",
                            description: "List ID.",
                            example: 1
                          },
                          title: {
                            type: "string",
                            description: "List title.",
                            example: "One Piece"
                          },
                          image: {
                            type: "string",
                            description: "List image.",
                            example: "https://example.com/image.jpg"
                          },
                          episode: {
                            type: "number",
                            description: "List episode.",
                            example: 100
                          },
                          status: {
                            type: "string",
                            enum: ["active", "inactive"],
                            description: "List status.",
                            example: "active"
                          },
                          waitingType: {
                            type: "string",
                            enum: ["date", "episode", "disabled"],
                            description: "Waiting type.",
                            example: "disabled"
                          },
                          onEpisode: {
                            type: "number",
                            description: "Waiting on episode.",
                            example: 100
                          },
                          onDate: {
                            type: "string",
                            format: "date",
                            description: "Waiting on date.",
                            example: "2025-05-28"
                          },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            description: "List created at.",
                            example: "2023-05-28T10:00:00.000Z"
                          },
                          updatedAt: {
                            type: "string",
                            format: "date-time",
                            description: "List updated at.",
                            example: "2023-05-28T10:00:00.000Z"
                          }
                        }
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
      .put('/status/:id', async ({ params, body, userId, set }) => {
        const { id } = params;
        const { status } = body;
        
        const result = await MyListModel.updateById(id, userId as number, { status });
        if (result < 1) {
          set.status = 422;
          return {
            status: 'error',
            message: 'Error updating status'
          };
        }
        
        return {
          status: 'success',
          message: "Status changed successfully."
        }
      }, {
        params: ParamId,
        body: MyListStatusRequest,
        response: {
          200: GeneralResponse,
          422: GeneralResponse,
        },
        error({ code, error }) {
          switch (code) {
            case 'VALIDATION':
              const fields = [
                { path: '/status', field: 'status', message: 'Status is required.' },
                { path: '/status', field: 'status', message: 'Invalid Status' },
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
          summary: "Update Status",
          description: "Change Mylist status.",
          tags: ["MyList"],
          security: [{ JwtAuth: [] }],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      enum: ["active", "inactive"],
                      description: "List status.",
                      examples: "active"
                    }
                  },
                  required: ["status"]
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
                        example: "MyList status changed successfully."
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
                        example: "Error updating status"
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
      .put('/reminder/:id', async ({ params, body, userId, set }) => {
        const { id } = params;
        const { waitingType, onEpisode, onDate } = body;
        let updateData: ReminderBody = { 
          waitingType,
          onEpisode: null,
          onDate: null,
        };
        
        switch (waitingType) {
          case WaitingTypeEnum.EPISODE: {
            if (onEpisode === undefined) {
              set.status = 422;
              return {
                status: 'error',
                message: 'Invalid request.',
                error: 'Episode is required'
              };
            }
            
            updateData.onEpisode = onEpisode;
            break;
          }
          case WaitingTypeEnum.DATE: {
            if (onDate === undefined || onDate === null) {
              set.status = 422;
              return {
                status: 'error',
                message: 'Invalid request.',
                error: 'Date is required'
              };
            }
            
            updateData.onDate = new Date(onDate);
            break;
          }
        }
         
        const result = await MyListModel.updateById(
          id, 
          userId as number, 
          updateData
        );
        if (result < 1) {
          set.status = 422;
          return {
            status: 'error',
            message: 'Error updating reminder'
          };
        }
        
        return {
          status: 'success',
          message: "Reminder changed successfully."
        }
      }, {
        params: ParamId,
        body: MyListReminderBodyRequest,
        response: {
          200: GeneralResponse,
          422: GeneralResponse,
        },
        error({ code, error }) {
          switch (code) {
            case 'VALIDATION':
              const fields = [
                { path: '/waitingType', field: 'waitingType', message: 'Waiting type is required.' },
                { path: '/waitingType', field: 'waitingType', message: 'Invalid waiting type' },
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
          summary: "Update Reminder",
          description: "Change Mylist reminder.",
          tags: ["MyList"],
          security: [{ JwtAuth: [] }],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    waitingType: {
                      type: "string",
                      enum: ["episode", "date"],
                      description: "waiting type on reminder.",
                      examples: "episode"
                    },
                    onEpisode: {
                      type: "number",
                      description: "episode on reminder.",
                      examples: 1
                    },
                    onDate: {
                      type: "string",
                      format: "date",
                      description: "date on reminder.",
                      examples: "2025-05-28"
                    }
                  },
                  required: ["waitingType"]
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
                        example: "MyList reminder updated successfully."
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
                        example: "Error updating reminder"
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
    
export default MylistController;