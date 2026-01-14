/**
 * Payzone Payment Gateway Configuration
 * Based on Payzone Paywall Integration
 */

export const payzoneConfig = {
  // Paywall URL (update with your actual paywall URL)
  paywallUrl:
    process.env.PAYZONE_PAYWALL_URL ||
    'https://paywall.payzone.ma',

  // Merchant Configuration
  merchant: {
    account:
      process.env
        .PAYZONE_MERCHANT_ACCOUNT || '',
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
    mode: 'DEEP_LINK',
    paymentMethod: 'CREDIT_CARD',
    showPaymentProfiles: true,

    // Callback URLs
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
