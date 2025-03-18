# Task API Spec

## Create Task

Endpoint : POST /api/checklist/{code}/task

Request Body :

```json
{
  "title": "string",
  "parentId": "number"
}
```

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Create task success",
  "data": {
    "id": "number",
    "order": "number",
    "title": "string",
    "status": "string"
  }
}
```

## Get All Tasks in Checklist

Endpoint : GET /api/checklist/{code}/task

Query Parameter :

- page : number, default 1
- per_page : number, default 10

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Get list task success",
  "data": [
    {
      "id": "number",
      "order": "number",
      "title": "string",
      "status": "string"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "perPage": 10,
    "totalPages": 1,
    "totalItems": 1
  }
}
```

## Get Task By Checklist Code

Endpoint : GET /api/checklist/{code}/task/{taskId}

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Get task success",
  "data": {
    "id": "number",
    "order": "number",
    "title": "string",
    "status": "string"
  }
}
```

## Update Task By Checklist Code

Endpoint : PATCH /api/checklist/{code}/task/{taskId}

Request Body :

- status : in_progress atau done

```json
{
  "order": "number",
  "title": "string",
  "status": "done"
}
```

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Update task success",
  "data": {
    "id": "number",
    "order": "number",
    "title": "string",
    "status": "string"
  }
}
```

## Remove Task By Checklist Code

Endpoint : DELETE /api/checklist/{code}/task/{taskId}

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Remove task success"
}
```
