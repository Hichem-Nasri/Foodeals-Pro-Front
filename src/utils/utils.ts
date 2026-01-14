type Name = string | { firstName: string; lastName: string }

export const getFilterDate = (date: Date) => {
  return date
    .toISOString()
    .slice(0, 10)
    .split('-')
    .slice(0, 2)
    .join('-')
    .padStart(7, '0')
}

export const convertImage = (image: File | string) => {
  if (!image) return ''
  if (typeof image === 'string') return image
  return URL.createObjectURL(image)
}

const length = (value: [] | string) => value.length

export const mimeTypes: { [key: string]: string } = {
  '.txt': 'text/plain',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.zip': 'application/zip',
  '.mp4': 'video/mp4',
  '.mp3': 'audio/mpeg',
  // Add more as needed
}

export const getUriData = (data: any) => {
  if (!data) return ''
  const queryParams = Object.entries(data)
    .filter(
      ([_, value]) =>
        value !== undefined &&
        value !== '' &&
        value !== null &&
        length(value as any) !== 0
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`
    )
    .join('&')
  return queryParams
}

export function formatNumberWithSpaces(
  num: number,
  char: string = ' '
): string {
  if (typeof num !== 'number') {
    return ''
  }
  // Convert number to string
  const numStr = num.toString()

  // Use regex to format the number
  const formatted = numStr.replace(/\B(?=(\d{3})+(?!\d))/g, char)

  return formatted
}

export const optionsBank = [
  {
    key: 'BMCE',
    label: 'BMCE',
  },
  {
    key: 'CIH',
    label: 'CIH',
  },
  {
    key: 'BANK OF AFRICA',
    label: 'BANK OF AFRICA',
  },
  {
    key: 'ATTIJARI',
    label: 'ATTIJARI',
  },
  {
    key: 'CREDIT AGRICOLE',
    label: 'CREDIT AGRICOLE',
  },
  {
    key: 'BANQUE POPULAIRE',
    label: 'BANQUE POPULAIRE',
  },
  {
    key: 'SGMB',
    label: 'SGMB',
  },
  {
    key: 'BMCI',
    label: 'BMCI',
  },
]

export function capitalize(name: Name | string): string {
  if (!name) return ''
  if (typeof name === 'string') {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
  } else {
    const { firstName, lastName } = name
    return (
      firstName.charAt(0).toUpperCase() +
      firstName.slice(1) +
      ' ' +
      lastName.charAt(0).toUpperCase() +
      lastName.slice(1)
    )
  }
}
// a function taht capitalize a string
export function capitalizeStr(str: string, divider = ' '): string {
  return str
    .toLowerCase()
    .split(divider)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function AddZeroInfrontOfNumber(num: number) {
  return String(num).padStart(2, '0')
}
export function formatDate(
  date: Date,
  typeMonth: '2-digit' | 'numeric' | 'long' | 'short' | 'narrow' = 'short'
): string {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: typeMonth,
    year: 'numeric',
  }
  return date.toLocaleDateString('en-US', options).replace(',', '')
}

export const countryCodes = [
  { label: 'Morocco', key: '+212' },
  { label: 'Afghanistan', key: '+93' },
  { label: 'Albania', key: '+355' },
  { label: 'Algeria', key: '+213' },
  { label: 'American Samoa', key: '+1-684' },
  { label: 'Andorra', key: '+376' },
  { label: 'Angola', key: '+244' },
  { label: 'Anguilla', key: '+1-264' },
  { label: 'Antarctica', key: '+672' },
  { label: 'Antigua and Barbuda', key: '+1-268' },
  { label: 'Argentina', key: '+54' },
  { label: 'Armenia', key: '+374' },
  { label: 'Aruba', key: '+297' },
  { label: 'Australia', key: '+61' },
  { label: 'Austria', key: '+43' },
  { label: 'Azerbaijan', key: '+994' },
  { label: 'Bahamas', key: '+1-242' },
  { label: 'Bahrain', key: '+973' },
  { label: 'Bangladesh', key: '+880' },
  { label: 'Barbados', key: '+1-246' },
  { label: 'Belarus', key: '+375' },
  { label: 'Belgium', key: '+32' },
  { label: 'Belize', key: '+501' },
  { label: 'Benin', key: '+229' },
  { label: 'Bermuda', key: '+1-441' },
  { label: 'Bhutan', key: '+975' },
  { label: 'Bolivia', key: '+591' },
  { label: 'Bosnia and Herzegovina', key: '+387' },
  { label: 'Botswana', key: '+267' },
  { label: 'Brazil', key: '+55' },
  { label: 'British Indian Ocean Territory', key: '+246' },
  { label: 'British Virgin Islands', key: '+1-284' },
  { label: 'Brunei', key: '+673' },
  { label: 'Bulgaria', key: '+359' },
  { label: 'Burkina Faso', key: '+226' },
  { label: 'Burundi', key: '+257' },
]

export const countries = [
  { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸' },
  { name: 'China', code: 'CN', dialCode: '+86', flag: '🇨🇳' },
  { name: 'Indonesia', code: 'ID', dialCode: '+62', flag: '🇮🇩' },
  { name: 'Pakistan', code: 'PK', dialCode: '+92', flag: '🇵🇰' },
  { name: 'Brazil', code: 'BR', dialCode: '+55', flag: '🇧🇷' },
  { name: 'Nigeria', code: 'NG', dialCode: '+234', flag: '🇳🇬' },
  { name: 'Bangladesh', code: 'BD', dialCode: '+880', flag: '🇧🇩' },
  { name: 'Russia', code: 'RU', dialCode: '+7', flag: '🇷🇺' },
  { name: 'Mexico', code: 'MX', dialCode: '+52', flag: '🇲🇽' },
  { name: 'Japan', code: 'JP', dialCode: '+81', flag: '🇯🇵' },
  { name: 'Ethiopia', code: 'ET', dialCode: '+251', flag: '🇪🇹' },
  { name: 'Philippines', code: 'PH', dialCode: '+63', flag: '🇵🇭' },
  { name: 'Egypt', code: 'EG', dialCode: '+20', flag: '🇪🇬' },
  { name: 'Vietnam', code: 'VN', dialCode: '+84', flag: '🇻🇳' },
  { name: 'DR Congo', code: 'CD', dialCode: '+243', flag: '🇨🇩' },
  { name: 'Turkey', code: 'TR', dialCode: '+90', flag: '🇹🇷' },
  { name: 'Iran', code: 'IR', dialCode: '+98', flag: '🇮🇷' },
  { name: 'Germany', code: 'DE', dialCode: '+49', flag: '🇩🇪' },
  { name: 'Thailand', code: 'TH', dialCode: '+66', flag: '🇹🇭' },
  { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧' },
  { name: 'France', code: 'FR', dialCode: '+33', flag: '🇫🇷' },
  { name: 'Italy', code: 'IT', dialCode: '+39', flag: '🇮🇹' },
  { name: 'South Africa', code: 'ZA', dialCode: '+27', flag: '🇿🇦' },
  { name: 'Tanzania', code: 'TZ', dialCode: '+255', flag: '🇹🇿' },
  { name: 'Myanmar', code: 'MM', dialCode: '+95', flag: '🇲🇲' },
  { name: 'Kenya', code: 'KE', dialCode: '+254', flag: '🇰🇪' },
  { name: 'South Korea', code: 'KR', dialCode: '+82', flag: '🇰🇷' },
  { name: 'Colombia', code: 'CO', dialCode: '+57', flag: '🇨🇴' },
  { name: 'Spain', code: 'ES', dialCode: '+34', flag: '🇪🇸' },
  { name: 'Uganda', code: 'UG', dialCode: '+256', flag: '🇺🇬' },
  { name: 'Argentina', code: 'AR', dialCode: '+54', flag: '🇦🇷' },
  { name: 'Algeria', code: 'DZ', dialCode: '+213', flag: '🇩🇿' },
  { name: 'Sudan', code: 'SD', dialCode: '+249', flag: '🇸🇩' },
  { name: 'Ukraine', code: 'UA', dialCode: '+380', flag: '🇺🇦' },
  { name: 'Iraq', code: 'IQ', dialCode: '+964', flag: '🇮🇶' },
  { name: 'Afghanistan', code: 'AF', dialCode: '+93', flag: '🇦🇫' },
  { name: 'Poland', code: 'PL', dialCode: '+48', flag: '🇵🇱' },
  { name: 'Canada', code: 'CA', dialCode: '+1', flag: '🇨🇦' },
  { name: 'Morocco', code: 'MA', dialCode: '+212', flag: '🇲🇦' },
  { name: 'Saudi Arabia', code: 'SA', dialCode: '+966', flag: '🇸🇦' },
  { name: 'Uzbekistan', code: 'UZ', dialCode: '+998', flag: '🇺🇿' },
  { name: 'Peru', code: 'PE', dialCode: '+51', flag: '🇵🇪' },
  { name: 'Angola', code: 'AO', dialCode: '+244', flag: '🇦🇴' },
  { name: 'Malaysia', code: 'MY', dialCode: '+60', flag: '🇲🇾' },
  { name: 'Mozambique', code: 'MZ', dialCode: '+258', flag: '🇲🇿' },
  { name: 'Ghana', code: 'GH', dialCode: '+233', flag: '🇬🇭' },
  { name: 'Yemen', code: 'YE', dialCode: '+967', flag: '🇾🇪' },
  { name: 'Nepal', code: 'NP', dialCode: '+977', flag: '🇳🇵' },
  { name: 'Venezuela', code: 'VE', dialCode: '+58', flag: '🇻🇪' },
  { name: 'Madagascar', code: 'MG', dialCode: '+261', flag: '🇲🇬' },
  { name: 'Cameroon', code: 'CM', dialCode: '+237', flag: '🇨🇲' },
  { name: "Côte d'Ivoire", code: 'CI', dialCode: '+225', flag: '🇨🇮' },
  { name: 'North Korea', code: 'KP', dialCode: '+850', flag: '🇰🇵' },
  { name: 'Australia', code: 'AU', dialCode: '+61', flag: '🇦🇺' },
  { name: 'Niger', code: 'NE', dialCode: '+227', flag: '🇳🇪' },
  { name: 'Sri Lanka', code: 'LK', dialCode: '+94', flag: '🇱🇰' },
  { name: 'Burkina Faso', code: 'BF', dialCode: '+226', flag: '🇧🇫' },
  { name: 'Mali', code: 'ML', dialCode: '+223', flag: '🇲🇱' },
  { name: 'Romania', code: 'RO', dialCode: '+40', flag: '🇷🇴' },
  { name: 'Malawi', code: 'MW', dialCode: '+265', flag: '🇲🇼' },
  { name: 'Chile', code: 'CL', dialCode: '+56', flag: '🇨🇱' },
  { name: 'Kazakhstan', code: 'KZ', dialCode: '+7', flag: '🇰🇿' },
  { name: 'Zambia', code: 'ZM', dialCode: '+260', flag: '🇿🇲' },
  { name: 'Guatemala', code: 'GT', dialCode: '+502', flag: '🇬🇹' },
  { name: 'Ecuador', code: 'EC', dialCode: '+593', flag: '🇪🇨' },
  { name: 'Syria', code: 'SY', dialCode: '+963', flag: '🇸🇾' },
  { name: 'Netherlands', code: 'NL', dialCode: '+31', flag: '🇳🇱' },
  { name: 'Senegal', code: 'SN', dialCode: '+221', flag: '🇸🇳' },
  { name: 'Cambodia', code: 'KH', dialCode: '+855', flag: '🇰🇭' },
  { name: 'Chad', code: 'TD', dialCode: '+235', flag: '🇹🇩' },
  { name: 'Somalia', code: 'SO', dialCode: '+252', flag: '🇸🇴' },
  { name: 'Zimbabwe', code: 'ZW', dialCode: '+263', flag: '🇿🇼' },
  { name: 'Guinea', code: 'GN', dialCode: '+224', flag: '🇬🇳' },
  { name: 'Rwanda', code: 'RW', dialCode: '+250', flag: '🇷🇼' },
  { name: 'Benin', code: 'BJ', dialCode: '+229', flag: '🇧🇯' },
  { name: 'Burundi', code: 'BI', dialCode: '+257', flag: '🇧🇮' },
  { name: 'Tunisia', code: 'TN', dialCode: '+216', flag: '🇹🇳' },
  { name: 'Belgium', code: 'BE', dialCode: '+32', flag: '🇧🇪' },
  { name: 'Cuba', code: 'CU', dialCode: '+53', flag: '🇨🇺' },
  { name: 'Bolivia', code: 'BO', dialCode: '+591', flag: '🇧🇴' },
  { name: 'Haiti', code: 'HT', dialCode: '+509', flag: '🇭🇹' },
  { name: 'South Sudan', code: 'SS', dialCode: '+211', flag: '🇸🇸' },
  { name: 'Dominican Republic', code: 'DO', dialCode: '+1-809', flag: '🇩🇴' },
  { name: 'Czech Republic', code: 'CZ', dialCode: '+420', flag: '🇨🇿' },
  { name: 'Greece', code: 'GR', dialCode: '+30', flag: '🇬🇷' },
  { name: 'Portugal', code: 'PT', dialCode: '+351', flag: '🇵🇹' },
  { name: 'Azerbaijan', code: 'AZ', dialCode: '+994', flag: '🇦🇿' },
  { name: 'Sweden', code: 'SE', dialCode: '+46', flag: '🇸🇪' },
  { name: 'Honduras', code: 'HN', dialCode: '+504', flag: '🇭🇳' },
  { name: 'United Arab Emirates', code: 'AE', dialCode: '+971', flag: '🇦🇪' },
  { name: 'Hungary', code: 'HU', dialCode: '+36', flag: '🇭🇺' },
  { name: 'Belarus', code: 'BY', dialCode: '+375', flag: '🇧🇾' },
  { name: 'Tajikistan', code: 'TJ', dialCode: '+992', flag: '🇹🇯' },
  { name: 'Austria', code: 'AT', dialCode: '+43', flag: '🇦🇹' },
  { name: 'Serbia', code: 'RS', dialCode: '+381', flag: '🇷🇸' },
  { name: 'Switzerland', code: 'CH', dialCode: '+41', flag: '🇨🇭' },
  { name: 'Israel', code: 'IL', dialCode: '+972', flag: '🇮🇱' },
  { name: 'Papua New Guinea', code: 'PG', dialCode: '+675', flag: '🇵🇬' },
  { name: 'Jordan', code: 'JO', dialCode: '+962', flag: '🇯🇴' },
  { name: 'Togo', code: 'TG', dialCode: '+228', flag: '🇹🇬' },
  { name: 'Sierra Leone', code: 'SL', dialCode: '+232', flag: '🇸🇱' },
  { name: 'Hong Kong', code: 'HK', dialCode: '+852', flag: '🇭🇰' },
  { name: 'Laos', code: 'LA', dialCode: '+856', flag: '🇱🇦' },
  { name: 'Paraguay', code: 'PY', dialCode: '+595', flag: '🇵🇾' },
  { name: 'Bulgaria', code: 'BG', dialCode: '+359', flag: '🇧🇬' },
  { name: 'Lebanon', code: 'LB', dialCode: '+961', flag: '🇱🇧' },
  { name: 'Libya', code: 'LY', dialCode: '+218', flag: '🇱🇾' },
  { name: 'Nicaragua', code: 'NI', dialCode: '+505', flag: '🇳🇮' },
  { name: 'El Salvador', code: 'SV', dialCode: '+503', flag: '🇸🇻' },
  { name: 'Kyrgyzstan', code: 'KG', dialCode: '+996', flag: '🇰🇬' },
  { name: 'Turkmenistan', code: 'TM', dialCode: '+993', flag: '🇹🇲' },
  { name: 'Singapore', code: 'SG', dialCode: '+65', flag: '🇸🇬' },
  { name: 'Denmark', code: 'DK', dialCode: '+45', flag: '🇩🇰' },
  { name: 'Finland', code: 'FI', dialCode: '+358', flag: '🇫🇮' },
  { name: 'Slovakia', code: 'SK', dialCode: '+421', flag: '🇸🇰' },
  { name: 'Congo', code: 'CG', dialCode: '+242', flag: '🇨🇬' },
  { name: 'Norway', code: 'NO', dialCode: '+47', flag: '🇳🇴' },
  { name: 'Costa Rica', code: 'CR', dialCode: '+506', flag: '🇨🇷' },
  { name: 'New Zealand', code: 'NZ', dialCode: '+64', flag: '🇳🇿' },
  { name: 'Palestine', code: 'PS', dialCode: '+970', flag: '🇵🇸' },
  { name: 'Ireland', code: 'IE', dialCode: '+353', flag: '🇮🇪' },
  { name: 'Oman', code: 'OM', dialCode: '+968', flag: '🇴🇲' },
  { name: 'Liberia', code: 'LR', dialCode: '+231', flag: '🇱🇷' },
  { name: 'Kuwait', code: 'KW', dialCode: '+965', flag: '🇰🇼' },
  { name: 'Panama', code: 'PA', dialCode: '+507', flag: '🇵🇦' },
  { name: 'Croatia', code: 'HR', dialCode: '+385', flag: '🇭🇷' },
  { name: 'Mauritania', code: 'MR', dialCode: '+222', flag: '🇲🇷' },
  { name: 'Georgia', code: 'GE', dialCode: '+995', flag: '🇬🇪' },
  { name: 'Uruguay', code: 'UY', dialCode: '+598', flag: '🇺🇾' },
  { name: 'Eritrea', code: 'ER', dialCode: '+291', flag: '🇪🇷' },
  { name: 'Mongolia', code: 'MN', dialCode: '+976', flag: '🇲🇳' },
  {
    name: 'Bosnia and Herzegovina',
    code: 'BA',
    dialCode: '+387',
    flag: '🇧🇦',
  },
  { name: 'Puerto Rico', code: 'PR', dialCode: '+1-787', flag: '🇵🇷' },
  { name: 'Moldova', code: 'MD', dialCode: '+373', flag: '🇲🇩' },
  { name: 'Albania', code: 'AL', dialCode: '+355', flag: '🇦🇱' },
  { name: 'Armenia', code: 'AM', dialCode: '+374', flag: '🇦🇲' },
  { name: 'Jamaica', code: 'JM', dialCode: '+1-876', flag: '🇯🇲' },
  { name: 'Qatar', code: 'QA', dialCode: '+974', flag: '🇶🇦' },
  { name: 'Lithuania', code: 'LT', dialCode: '+370', flag: '🇱🇹' },
  { name: 'Namibia', code: 'NA', dialCode: '+264', flag: '🇳🇦' },
].sort((a, b) => a.code.localeCompare(b.code))
