export const response = (
  c: {
    status(status: number): void
    json: (arg0: { status: boolean; statusCode: number; message: string; data?: {} }) => void
  },
  status = 200,
  message = 'Success',
  data: boolean | {} | any[] = {}
) => {
  c.status(status)

  if (typeof data === 'boolean') {
    return c.json({
      status: data,
      statusCode: status,
      message: message,
      data: data
    })
  }

  if (typeof data === 'object' && 'data' in data) {
    const dataObject = data as { data: {} }

    return c.json({
      status: true,
      statusCode: status,
      message: message,
      ...dataObject
    })
  }

  return c.json({
    status: true,
    statusCode: status,
    message: message,
    data
  })
}
