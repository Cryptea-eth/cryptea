export const currency: {
  [index: string]: {
    symbol: string;
    name: string;
    source?: string;
    base?: boolean;
  };
} = {
  USD: {
    symbol: "$",
    name: "US Dollar",
    base: true,
    source: "standard",
  },
  EUR: {
    symbol: "€",
    name: "Euro",
  },
  GBP: {
    symbol: "£",
    name: "British Pound",
  },
  JPY: {
    symbol: "¥",
    name: "Japanese Yen",
  },
  AUD: {
    symbol: "$",
    name: "Australian Dollar",
  },
  CAD: {
    symbol: "$",
    name: "Canadian Dollar",
  },
  CHF: {
    symbol: "Fr",
    name: "Swiss Franc",
  },
  CNY: {
    symbol: "¥",
    name: "Chinese Yuan",
    source: "standard",
  },
  HKD: {
    symbol: "$",
    name: "Hong Kong Dollar",
    source: "standard",
  },
  NZD: {
    symbol: "$",
    name: "New Zealand Dollar",
  },
  NGN: {
    symbol: "₦",
    name: "Nigerian Naira",
    source: "standard",
  },
  SEK: {
    symbol: "kr",
    name: "Swedish Krona",
    source: "standard",
  },
  SGD: {
    symbol: "$",
    name: "Singapore Dollar",
    source: "standard",
  },
  KRW: {
    symbol: "₩",
    name: "South Korean Won",
    source: "standard",
  },
  TRY: {
    symbol: "₺",
    name: "Turkish Lira",
    source: "standard",
  },
  RUB: {
    symbol: "₽",
    name: "Russian Ruble",
    source: "standard",
  },
  INR: {
    symbol: "₹",
    name: "Indian Rupee",
    source: "standard",
  },
  BRL: {
    symbol: "R$",
    name: "Brazilian Real",
    source: "standard",
  },
  ZAR: {
    symbol: "R",
    name: "South African Rand",
    source: "standard",
  },
  MXN: {
    symbol: "$",
    name: "Mexican Peso",
    source: "standard",
  },
  ILS: {
    symbol: "₪",
    name: "Israeli New Shekel",
    source: "standard",
  },
  PHP: {
    symbol: "₱",
    name: "Philippine Peso",
    source: "standard",
  },
  THB: {
    symbol: "฿",
    name: "Thai Baht",
    source: "standard",
  },
  IDR: {
    symbol: "Rp",
    name: "Indonesian Rupiah",
    source: "standard",
  },
  MYR: {
    symbol: "RM",
    name: "Malaysian Ringgit",
    source: "standard",
  },
  CZK: {
    symbol: "Kč",
    name: "Czech Koruna",
    source: "standard",
  },
  DKK: {
    symbol: "kr",
    name: "Danish Krone",
    source: "standard",
  },
  HUF: {
    symbol: "Ft",
    name: "Hungarian Forint",
    source: "standard",
  },
  NOK: {
    symbol: "kr",
    name: "Norwegian Krone",
    source: "standard",
  },
  PLN: {
    symbol: "zł",
    name: "Polish Zloty",
    source: "standard",
  },
  RON: {
    symbol: "lei",
    name: "Romanian Leu",
    source: "standard",
  },
  UAH: {
    symbol: "₴",
    source: "standard",
    name: "Ukrainian Hryvnia",
  },
  BGN: {
    symbol: "лв",
    name: "Bulgarian Lev",
    source: "standard",
  },
  ISK: {
    symbol: "kr",
    source: "standard",
    name: "Icelandic Króna",
  },
  PEN: {
    symbol: "S/.",
    source: "standard",
    name: "Peruvian Nuevo Sol",
  },
  PKR: {
    symbol: "₨",
    name: "Pakistani Rupee",
    source: "standard",
  },
  SYP: {
    symbol: "£",
    name: "Syrian Pound",
    source: "standard",
  },
  AED: {
    symbol: "د.إ",
    name: "United Arab Emirates Dirham",
    source: "standard",
  },
  CLP: {
    symbol: "$",
    name: "Chilean Peso",
    source: "standard",
  },
  COP: {
    symbol: "$",
    name: "Colombian Peso",
    source: "standard",
  },
  ARS: {
    symbol: "$",
    name: "Argentine Peso",
    source: "standard",
  },
  BOB: {
    symbol: "Bs",
    name: "Bolivian Boliviano",
    source: "standard",
  },
  DOP: {
    symbol: "RD$",
    name: "Dominican Peso",
    source: "standard",
  },
  KZT: {
    symbol: "₸",
    name: "Kazakhstani Tenge",
    source: "standard",
  },
  LBP: {
    symbol: "£",
    name: "Lebanese Pound",
    source: "standard",
  },

  SVC: {
    symbol: "$",
    name: "Salvadoran Colón",
    source: "standard",
  },
  SOS: {
    symbol: "S",
    name: "Somali Shilling",
    source: "standard",
  },

  BHD: {
    symbol: "BD",
    name: "Bahraini Dinar",
    source: "standard",
  },

  EGP: {
    symbol: "£",
    name: "Egyptian Pound",
  },

  HRK: {
    symbol: "kn",
    name: "Croatian Kuna",
  },

  KES: {
    symbol: "KSh",
    name: "Kenyan Shilling",
  },

  KWD: {
    symbol: "KD",
    name: "Kuwaiti Dinar",
  },

  MAD: {
    symbol: "MAD",
    name: "Moroccan Dirham",
  },

  MNT: {
    symbol: "₮",
    name: "Mongolian Tögrög",
  },

  OMR: {
    symbol: "OMR",
    name: "Omani Rial",
  },

  QAR: {
    symbol: "QR",
    name: "Qatari Riyal",
  },
  SAR: {
    symbol: "SR",
    name: "Saudi Riyal",
  },
  TWD: {
    symbol: "NT$",
    name: "New Taiwan Dollar",
  },

  UGX: {
    symbol: "USh",
    name: "Ugandan Shilling",
  },

  VND: {
    symbol: "₫",
    name: "Vietnamese Dong",
  },

  VES: {
    name: "Venezuelan Bolívar Soberano",
    symbol: "Bs",
  },

  CRC: {
    name: "Costa Rican Colón",
    symbol: "₡",
  },

  DZD: {
    name: "Algerian Dinar",
    symbol: "د.ج",
  },
};
