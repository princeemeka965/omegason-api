export function notFound(_req, res) {
  res.status(404).json({ error: 'That address was not found.' })
}

export function errorHandler(err, _req, res, _next) {
  const status = Number(err.status) || 500
  if (status >= 500) console.error(err)
  const message = status >= 500 ? 'Something went wrong.' : err.message
  res.status(status).json({ error: message })
}
