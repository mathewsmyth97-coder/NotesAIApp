import 'server-only'

import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12

function getEncryptionKey() {
  const secret = process.env.OPENROUTER_KEY_ENCRYPTION_SECRET

  if (!secret || secret.length < 32) {
    throw new Error(
      'OPENROUTER_KEY_ENCRYPTION_SECRET must be configured with at least 32 characters.',
    )
  }

  return createHash('sha256').update(secret).digest()
}

export function encryptSecret(value: string) {
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv(ALGORITHM, getEncryptionKey(), iv)
  const encrypted = Buffer.concat([
    cipher.update(value, 'utf8'),
    cipher.final(),
  ])
  const tag = cipher.getAuthTag()

  return [
    'v1',
    iv.toString('base64url'),
    tag.toString('base64url'),
    encrypted.toString('base64url'),
  ].join(':')
}

export function decryptSecret(value: string) {
  const [version, iv, tag, encrypted] = value.split(':')

  if (version !== 'v1' || !iv || !tag || !encrypted) {
    throw new Error('Unsupported encrypted secret format.')
  }

  const decipher = createDecipheriv(
    ALGORITHM,
    getEncryptionKey(),
    Buffer.from(iv, 'base64url'),
  )

  decipher.setAuthTag(Buffer.from(tag, 'base64url'))

  return Buffer.concat([
    decipher.update(Buffer.from(encrypted, 'base64url')),
    decipher.final(),
  ]).toString('utf8')
}
