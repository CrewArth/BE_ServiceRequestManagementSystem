import swaggerUi from "swagger-ui-express";

const auth = [{ bearerAuth: [] }];
const responses = {
  "400": { description: "Invalid input" },
  "401": { description: "Authentication required" },
  "403": { description: "Forbidden" },
  "404": { description: "Not found" },
};
const fields = {
  type: "object",
  required: ["title", "description", "category", "priority"],
  properties: {
    title: { type: "string", minLength: 3, maxLength: 120 },
    description: { type: "string", minLength: 10, maxLength: 2000 },
    category: { type: "string", enum: ["IT", "MAINTENANCE", "GENERAL"] },
    priority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
  },
};
const body = (schema: object) => ({
  required: true,
  content: { "application/json": { schema } },
});

export const openApi = {
  openapi: "3.0.3",
  info: { title: "Service Request API", version: "1.0.0" },
  servers: [{ url: "http://localhost:4000" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
  },
  paths: {
    "/api/health": {
      get: {
        summary: "Database health",
        responses: {
          "200": { description: "Healthy" },
          "503": { description: "Unavailable" },
        },
      },
    },
    "/api/auth/register": {
      post: {
        summary: "Register employee",
        requestBody: body({
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
          },
        }),
        responses: { "201": { description: "Created" }, ...responses },
      },
    },
    "/api/auth/login": {
      post: {
        summary: "Sign in",
        requestBody: body({
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string" },
            password: { type: "string" },
          },
        }),
        responses: { "200": { description: "Token and user" }, ...responses },
      },
    },
    "/api/auth/me": {
      get: {
        summary: "Current user",
        security: auth,
        responses: { "200": { description: "User" }, ...responses },
      },
    },
    "/api/meta": {
      get: {
        summary: "Request options",
        security: auth,
        responses: { "200": { description: "Enums" }, ...responses },
      },
    },
    "/api/requests": {
      get: {
        summary: "List visible requests",
        security: auth,
        parameters: [
          {
            in: "query",
            name: "status",
            schema: {
              type: "string",
              enum: ["OPEN", "IN_PROGRESS", "RESOLVED"],
            },
          },
          {
            in: "query",
            name: "priority",
            schema: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
          },
        ],
        responses: { "200": { description: "Requests" }, ...responses },
      },
      post: {
        summary: "Create request",
        security: auth,
        requestBody: body(fields),
        responses: { "201": { description: "Created" }, ...responses },
      },
    },
    "/api/requests/{id}": {
      parameters: [
        { in: "path", name: "id", required: true, schema: { type: "string" } },
      ],
      get: {
        summary: "Request details",
        security: auth,
        responses: { "200": { description: "Request" }, ...responses },
      },
      patch: {
        summary: "Edit fields; employees require Open status",
        security: auth,
        requestBody: body({ ...fields, required: [] }),
        responses: { "200": { description: "Updated" }, ...responses },
      },
      delete: {
        summary: "Delete; employees require Open status",
        security: auth,
        responses: { "204": { description: "Deleted" }, ...responses },
      },
    },
    "/api/requests/{id}/status": {
      patch: {
        summary: "Admin status change",
        security: auth,
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: body({
          type: "object",
          required: ["status"],
          properties: {
            status: {
              type: "string",
              enum: ["OPEN", "IN_PROGRESS", "RESOLVED"],
            },
          },
        }),
        responses: { "200": { description: "Updated" }, ...responses },
      },
    },
    "/api/dashboard/summary": {
      get: {
        summary: "Scoped metrics",
        security: auth,
        responses: {
          "200": { description: "Six metrics and last overdue check" },
          ...responses,
        },
      },
    },
  },
};

export const swaggerServe = swaggerUi.serve;
export const swaggerPage = swaggerUi.setup(openApi);
