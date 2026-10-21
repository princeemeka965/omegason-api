// Signed admin uploads. The cloud name is public; the key and secret stay on the server.
import { createHash } from 'node:crypto'
import { config } from '../config.js'
import { ApiError } from '../errors.js'

const FOLDER = 'omegason'
const TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

function sign(params) {
  const serialized = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&')
  return createHash('sha1').update(serialized + config.cloudinaryApiSecret).digest('hex')
}

export async function uploadImage(buffer, mime) {
  if (!config.cloudinaryCloudName || !config.cloudinaryApiKey || !config.cloudinaryApiSecret) {
    throw new ApiError(424, 'Add the Cloudinary API key and secret to the API environment, then try again.')
  }
  const extension = TYPES[mime]
  if (!extension) throw new ApiError(400, 'Choose a JPEG, PNG, WebP, or GIF.')
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) throw new ApiError(400, 'Choose an image file.')

  const timestamp = Math.floor(Date.now() / 1000)
  const params = { folder: FOLDER, timestamp }
  const body = new FormData()
  body.append('file', new Blob([buffer], { type: mime }), `upload.${extension}`)
  body.append('api_key', config.cloudinaryApiKey)
  body.append('timestamp', String(timestamp))
  body.append('signature', sign(params))
  body.append('folder', FOLDER)

  let response
  try {
    response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudinaryCloudName}/image/upload`, {
      method: 'POST',
      body,
    })
  } catch (err) {
    console.error(err)
    throw new ApiError(424, 'The image could not be uploaded. Check the connection, then try again.')
  }
  const payload = await response.json().catch(() => ({}))
  if (!response.ok || !payload.secure_url) {
    console.error(payload?.error || payload)
    throw new ApiError(424, 'The image could not be uploaded. Check the Cloudinary keys, then try again.')
  }
  return { url: payload.secure_url }
}
