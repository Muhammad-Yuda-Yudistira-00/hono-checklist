# Task API Spec

## Create Task

Endpoint : POST /api/checklist/{code}/task

Request Body :

```json
{
  "title": "string",
  "level": "number",
  "type": "string"
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
    "status": "string",
    "level": "number",
    "type": "string"
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
      "status": "string",
      "level": "number",
      "type": "string"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "perPage": 10,
    "totalPages": 1,
    "totalItems": 1
  },
  "meta": {
    "totalInProgress": 1,
    "totalDone": 1
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
    "status": "string",
    "level": "number",
    "type": "string"
  }
}
```

## Update Task By Checklist Code

Endpoint : PATCH /api/checklist/{code}/task/{taskId}

Request Body :

- status : in_progress atau done
- level : 1,2,3
- type : regular atau daily

```json
{
  "order": "number",
  "title": "string",
  "status": "done",
  "level": "number",
  "type": "string"
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
    "status": "string",
    "level": "number",
    "type": "string"
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
