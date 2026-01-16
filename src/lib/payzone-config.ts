/**
 * Payzone Payment Gateway Configuration
 * Based on Payzone Paywall Integration
 */

export const payzoneConfig = {
  // API base URL (for direct API integration)
  baseUrl:
    process.env.PAYZONE_API_BASE_URL ||
    process.env.PAYZONE_BASE_URL ||
    'https://api.payzone.ma',
  endpoints: {
    initPayment: '/payments/init',
    verifyPayment: '/payments/verify',
    paymentStatus: '/payments/status',
    refund: '/payments/refund',
  },

  // Paywall URL (update with your actual paywall URL)
  paywallUrl:
    process.env.PAYZONE_PAYWALL_URL ||
    'https://paywall.payzone.ma',

  // Merchant Configuration
  merchant: {
    account:
      process.env
        .PAYZONE_MERCHANT_ACCOUNT || '',
    id:
      process.env.PAYZONE_MERCHANT_ID ||
      process.env
        .PAYZONE_MERCHANT_ACCOUNT ||
      '',
    apiKey:
      process.env.PAYZONE_API_KEY ||
      process.env
        .PAYZONE_MERCHANT_API_KEY ||
      '',
    secretKey:
      process.env.PAYZONE_SECRET_KEY ||
      '',
  },

  // Payment Configuration
  payment: {
    currency: 'MAD',
    skin: 'vps-1-vue', // Payzone skin/theme
    customerCountry: 'MA',
    customerLocale: 'en_US', // en_US, fr_FR, ar_MA
    language:
      process.env.PAYZONE_LANGUAGE ||
      'en',
    mode: 'DEEP_LINK',
    paymentMethod: 'CREDIT_CARD',
    showPaymentProfiles: true,

    // Callback URLs
    callbackUrl:
      process.env.NEXT_PUBLIC_APP_URL +
      '/api/payments/callback',
    returnUrl:
      process.env.NEXT_PUBLIC_APP_URL +
      '/payments/redirect',
    cancelUrl:
      process.env.NEXT_PUBLIC_APP_URL +
      '/payments/cancel',
    errorUrl:
      process.env.NEXT_PUBLIC_APP_URL +
      '/payments/error',
    flowCompletionUrl:
      process.env.NEXT_PUBLIC_APP_URL +
      '/payments/redirect',
  },

  // Security
  security: {
    hashAlgorithm: 'sha256',
  },
} as const

export type PayzoneConfig =
  typeof payzoneConfig

/**
 * Validate Payzone configuration
 * @throws Error if configuration is invalid
 */
export function validatePayzoneConfig(): void {
  const { merchant } = payzoneConfig

  if (!merchant.account) {
    throw new Error(
      'PAYZONE_MERCHANT_ACCOUNT is not configured. Please add it to your .env file.'
    )
  }

  if (!merchant.secretKey) {
    throw new Error(
      'PAYZONE_SECRET_KEY is not configured. Please add it to your .env file.'
    )
  }

  if (
    !process.env.NEXT_PUBLIC_APP_URL
  ) {
    throw new Error(
      'NEXT_PUBLIC_APP_URL is not configured. Please add it to your .env file.'
    )
  }
}

/**
 * Get environment-specific configuration
 */
export function getPayzoneEnv() {
  return {
    merchantAccount:
      payzoneConfig.merchant.account,
    secretKey:
      payzoneConfig.merchant.secretKey,
    paywallUrl:
      payzoneConfig.paywallUrl,
    appUrl:
      process.env.NEXT_PUBLIC_APP_URL,
  }
}
