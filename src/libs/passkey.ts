/**
 * Passkey/WebAuthn Integration Library
 *
 * This module handles passwordless authentication using WebAuthn/Passkeys
 * for secure, user-friendly authentication in the HealthAid application.
 *
 * TODO: Replace stubs with actual @simplewebauthn/browser and @simplewebauthn/server integration
 * Required environment variables:
 * - NEXT_PUBLIC_WEBAUTHN_RP_NAME
 * - NEXT_PUBLIC_WEBAUTHN_RP_ID
 * - WEBAUTHN_RP_ORIGIN
 */

// TODO: Uncomment when ready to integrate
// import { startRegistration, startAuthentication } from '@simplewebauthn/browser'
// import type {
//   RegistrationResponseJSON,
//   AuthenticationResponseJSON,
//   PublicKeyCredentialCreationOptionsJSON,
//   PublicKeyCredentialRequestOptionsJSON
// } from '@simplewebauthn/browser'

export interface PasskeyCredential {
  id: string
  publicKey: string
  counter: number
  deviceType: "singleDevice" | "multiDevice"
  backedUp: boolean
  transports?: AuthenticatorTransport[]
  createdAt: Date
  lastUsed: Date
}

export interface PasskeyUser {
  id: string
  email: string
  name: string
  credentials: PasskeyCredential[]
  createdAt: Date
}

export interface RegistrationOptions {
  challenge: string
  rp: {
    name: string
    id: string
  }
  user: {
    id: string
    name: string
    displayName: string
  }
  pubKeyCredParams: Array<{
    alg: number
    type: "public-key"
  }>
  timeout: number
  attestation: "none" | "indirect" | "direct"
  authenticatorSelection: {
    authenticatorAttachment?: "platform" | "cross-platform"
    userVerification: "required" | "preferred" | "discouraged"
    residentKey: "required" | "preferred" | "discouraged"
  }
}

/**
 * Check if WebAuthn is supported in the current browser
 */
export function isWebAuthnSupported(): boolean {
  return !!(window.PublicKeyCredential && (window.PublicKeyCredential as any).create)
}

/**
 * Check if platform authenticator (Face ID, Touch ID, Windows Hello) is available
 */
export async function isPlatformAuthenticatorAvailable(): Promise<boolean> {
  try {
    if (!isWebAuthnSupported()) {
      return false
    }

    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
  } catch (error) {
    console.error("Error checking platform authenticator availability:", error)
    return false
  }
}

/**
 * Generate registration options for passkey creation
 */
export async function generateRegistrationOptions(
  userId: string,
  userName: string,
  userDisplayName: string,
): Promise<RegistrationOptions> {
  try {
    // TODO: Replace with actual server-side generation
    // const options = await fetch('/api/auth/passkey/register/begin', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ userId, userName, userDisplayName })
    // }).then(res => res.json())
    // return options

    console.log(`Mock registration options for ${userName}`)

    // Mock registration options for development
    return {
      challenge: btoa(Math.random().toString()).slice(0, 32),
      rp: {
        name: process.env.NEXT_PUBLIC_WEBAUTHN_RP_NAME || "HealthAid",
        id: process.env.NEXT_PUBLIC_WEBAUTHN_RP_ID || "localhost",
      },
      user: {
        id: userId,
        name: userName,
        displayName: userDisplayName,
      },
      pubKeyCredParams: [
        { alg: -7, type: "public-key" }, // ES256
        { alg: -257, type: "public-key" }, // RS256
      ],
      timeout: 60000,
      attestation: "none",
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required",
        residentKey: "preferred",
      },
    }
  } catch (error) {
    console.error("Error generating registration options:", error)
    throw new Error("Failed to generate registration options")
  }
}

/**
 * Register a new passkey for the user
 */
export async function registerPasskey(
  userId: string,
  userName: string,
  userDisplayName: string,
): Promise<PasskeyCredential> {
  try {
    if (!isWebAuthnSupported()) {
      throw new Error("WebAuthn is not supported in this browser")
    }

    // Generate registration options
    const options = await generateRegistrationOptions(userId, userName, userDisplayName)

    // TODO: Replace with actual WebAuthn registration
    // const credential = await startRegistration(options)
    //
    // // Verify registration on server
    // const verification = await fetch('/api/auth/passkey/register/finish', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ userId, credential })
    // }).then(res => res.json())
    //
    // if (!verification.verified) {
    //   throw new Error('Passkey registration failed verification')
    // }
    //
    // return verification.credential

    console.log(`Mock passkey registration for ${userName}`)

    // Mock successful registration for development
    return {
      id: "passkey_" + Math.random().toString(36).substr(2, 9),
      publicKey: btoa(Math.random().toString()).slice(0, 64),
      counter: 0,
      deviceType: "singleDevice",
      backedUp: false,
      transports: ["internal"],
      createdAt: new Date(),
      lastUsed: new Date(),
    }
  } catch (error) {
    console.error("Error registering passkey:", error)
    throw new Error("Failed to register passkey")
  }
}

/**
 * Generate authentication options for passkey login
 */
export async function generateAuthenticationOptions(userId?: string): Promise<any> {
  try {
    // TODO: Replace with actual server-side generation
    // const options = await fetch('/api/auth/passkey/authenticate/begin', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ userId })
    // }).then(res => res.json())
    // return options

    console.log(`Mock authentication options for user ${userId || "any"}`)

    // Mock authentication options for development
    return {
      challenge: btoa(Math.random().toString()).slice(0, 32),
      timeout: 60000,
      rpId: process.env.NEXT_PUBLIC_WEBAUTHN_RP_ID || "localhost",
      userVerification: "required",
    }
  } catch (error) {
    console.error("Error generating authentication options:", error)
    throw new Error("Failed to generate authentication options")
  }
}

/**
 * Authenticate user with passkey
 */
export async function authenticateWithPasskey(userId?: string): Promise<PasskeyUser> {
  try {
    if (!isWebAuthnSupported()) {
      throw new Error("WebAuthn is not supported in this browser")
    }

    // Generate authentication options
    const options = await generateAuthenticationOptions(userId)

    // TODO: Replace with actual WebAuthn authentication
    // const credential = await startAuthentication(options)
    //
    // // Verify authentication on server
    // const verification = await fetch('/api/auth/passkey/authenticate/finish', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ credential })
    // }).then(res => res.json())
    //
    // if (!verification.verified) {
    //   throw new Error('Passkey authentication failed verification')
    // }
    //
    // return verification.user

    console.log(`Mock passkey authentication for user ${userId || "any"}`)

    // Mock successful authentication for development
    return {
      id: userId || "user_" + Math.random().toString(36).substr(2, 9),
      email: "user@example.com",
      name: "John Doe",
      credentials: [
        {
          id: "passkey_123",
          publicKey: btoa(Math.random().toString()).slice(0, 64),
          counter: 5,
          deviceType: "singleDevice",
          backedUp: false,
          transports: ["internal"],
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          lastUsed: new Date(),
        },
      ],
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    }
  } catch (error) {
    console.error("Error authenticating with passkey:", error)
    throw new Error("Failed to authenticate with passkey")
  }
}

/**
 * Get user's registered passkeys
 */
export async function getUserPasskeys(userId: string): Promise<PasskeyCredential[]> {
  try {
    // TODO: Replace with actual server call
    // const credentials = await fetch(`/api/auth/passkey/credentials/${userId}`)
    //   .then(res => res.json())
    // return credentials

    console.log(`Mock passkey retrieval for user ${userId}`)

    // Mock credentials for development
    return [
      {
        id: "passkey_123",
        publicKey: btoa(Math.random().toString()).slice(0, 64),
        counter: 5,
        deviceType: "singleDevice",
        backedUp: false,
        transports: ["internal"],
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        lastUsed: new Date(),
      },
    ]
  } catch (error) {
    console.error("Error getting user passkeys:", error)
    throw new Error("Failed to get user passkeys")
  }
}

/**
 * Delete a passkey credential
 */
export async function deletePasskey(userId: string, credentialId: string): Promise<boolean> {
  try {
    // TODO: Replace with actual server call
    // const result = await fetch(`/api/auth/passkey/credentials/${credentialId}`, {
    //   method: 'DELETE',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ userId })
    // }).then(res => res.json())
    // return result.success

    console.log(`Mock passkey deletion: ${credentialId} for user ${userId}`)
    return true
  } catch (error) {
    console.error("Error deleting passkey:", error)
    return false
  }
}

/**
 * Update passkey metadata (name, last used, etc.)
 */
export async function updatePasskeyMetadata(
  userId: string,
  credentialId: string,
  metadata: Partial<Pick<PasskeyCredential, "lastUsed" | "counter">>,
): Promise<boolean> {
  try {
    // TODO: Replace with actual server call
    // const result = await fetch(`/api/auth/passkey/credentials/${credentialId}`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ userId, metadata })
    // }).then(res => res.json())
    // return result.success

    console.log(`Mock passkey metadata update: ${credentialId} for user ${userId}`, metadata)
    return true
  } catch (error) {
    console.error("Error updating passkey metadata:", error)
    return false
  }
}

/**
 * Check if user has any registered passkeys
 */
export async function hasRegisteredPasskeys(userId: string): Promise<boolean> {
  try {
    const credentials = await getUserPasskeys(userId)
    return credentials.length > 0
  } catch (error) {
    console.error("Error checking for registered passkeys:", error)
    return false
  }
}

/**
 * Get passkey registration status and recommendations
 */
export async function getPasskeyStatus(): Promise<{
  supported: boolean
  platformAvailable: boolean
  recommendation: string
}> {
  const supported = isWebAuthnSupported()
  const platformAvailable = supported ? await isPlatformAuthenticatorAvailable() : false

  let recommendation = ""
  if (!supported) {
    recommendation = "Your browser does not support passkeys. Please use a modern browser."
  } else if (!platformAvailable) {
    recommendation = "Platform authenticator not available. You can still use security keys."
  } else {
    recommendation = "Your device supports passkeys! Set up Face ID, Touch ID, or Windows Hello for secure access."
  }

  return {
    supported,
    platformAvailable,
    recommendation,
  }
}
