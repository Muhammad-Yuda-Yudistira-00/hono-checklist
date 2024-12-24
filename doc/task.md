# Task API Spec

## Create Task

Endpoint : POST /api/checklist/{code}/task

Request Body :

```json
{
  "title": "string"
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
    "title": "string",
    "status": "string"
  }
}
```

## Get All Tasks in Checklist

Endpoint : GET /api/checklist/{code}/task

Response Body :

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Get list task success",
  "data": [
    {
      "id": "number",
      "title": "string",
      "status": "string"
    }
  ]
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
    "title": "string",
    "status": "string"
  }
}
```

## Update Task By Checklist Code

Endpoint : PUT /api/checklist/{code}/task/{taskId}

Request Body :

```json
{
  "title": "string",
  "status": "done" // in_progress | done
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
