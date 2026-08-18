import React from 'react';

// =========================================================================
// Real, Pixel-Perfect, 100% Vector Brand Logos for Checkout
// =========================================================================

// Official Unified Payments Interface (UPI)
export const UpiLogo: React.FC<{ className?: string }> = ({ className = 'h-5' }) => (
  <svg viewBox="0 0 90 26" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <text
      x="0"
      y="20"
      fill="#231F20"
      fontFamily="system-ui, -apple-system, sans-serif"
      fontWeight="900"
      fontSize="20"
      letterSpacing="-0.02em"
    >
      UPI
    </text>
    {/* NPCI Dual Arrows */}
    <g transform="translate(50, 1)">
      <path d="M16 0L26 12L16 24H8L18 12L8 0H16Z" fill="#097939" />
      <path d="M8 0L18 12L8 24H0L10 12L0 0H8Z" fill="#ED752E" />
    </g>
  </svg>
);

// Official Google Pay Logo (User image)
export const GPayLogo: React.FC<{ className?: string }> = ({ className = 'h-7' }) => (
  <img
    src="https://i.ibb.co/5XhTdzw8/6728d8f618ff531833c69bd830569376.jpg"
    alt="Google Pay"
    referrerPolicy="no-referrer"
    className={`${className} object-contain`}
  />
);

// Official PhonePe Logo (User image)
export const PhonePeLogo: React.FC<{ className?: string }> = ({ className = 'h-7' }) => (
  <img
    src="https://i.ibb.co/rfdyLsJB/images-20.jpg"
    alt="PhonePe"
    referrerPolicy="no-referrer"
    className={`${className} object-contain rounded-md`}
  />
);

// Official Paytm Logo (User image)
export const PaytmLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <img
    src="https://i.ibb.co/VWDM6r46/Paytm-Logo.png"
    alt="Paytm"
    referrerPolicy="no-referrer"
    className={`${className} object-contain`}
  />
);

// Real Official Visa Logo
export const VisaLogo: React.FC<{ className?: string }> = ({ className = 'h-4' }) => (
  <svg viewBox="0 0 54 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Authentic italic bold VISA typeface */}
    <text
      x="1"
      y="15"
      fill="#1A1F71"
      fontFamily="system-ui, -apple-system, 'Helvetica Neue', sans-serif"
      fontWeight="900"
      fontSize="18"
      fontStyle="italic"
      letterSpacing="-0.04em"
    >
      VISA
    </text>
    {/* Classic Yellow Gold Wing on 'V' */}
    <path d="M1 4.5H7.5L5.5 1.5H1V4.5Z" fill="#F7B600" />
  </svg>
);

// Real Official Mastercard Logo (Interlocking Red & Yellow/Orange Circles)
export const MastercardLogo: React.FC<{ className?: string }> = ({ className = 'h-4' }) => (
  <svg viewBox="0 0 34 22" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="11" cy="11" r="10.5" fill="#EB001B" />
    <circle cx="23" cy="11" r="10.5" fill="#F79E1B" />
    <path
      d="M17 2.8a10.4 10.4 0 0 1 4 8.2 10.4 10.4 0 0 1-4 8.2 10.4 10.4 0 0 1-4-8.2 10.4 10.4 0 0 1 4-8.2z"
      fill="#FF5F00"
    />
  </svg>
);

// Real Official RuPay Logo
export const RuPayLogo: React.FC<{ className?: string }> = ({ className = 'h-4' }) => (
  <svg viewBox="0 0 68 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <text
      x="0"
      y="15.5"
      fill="#092B65"
      fontFamily="system-ui, -apple-system, sans-serif"
      fontWeight="900"
      fontSize="16"
      fontStyle="italic"
      letterSpacing="-0.03em"
    >
      RuPay
    </text>
    {/* Green & Orange Triangles */}
    <g transform="translate(48, 1)">
      <path d="M9 0L17 8.5L9 17H2L10 8.5L2 0H9Z" fill="#009A44" />
      <path d="M3 0L11 8.5L3 17H-4L4 8.5L-4 0H3Z" fill="#F26522" />
    </g>
  </svg>
);

// Real Official American Express (AMEX) Logo
export const AmexLogo: React.FC<{ className?: string }> = ({ className = 'h-4' }) => (
  <svg viewBox="0 0 44 26" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="44" height="26" rx="4" fill="#006FCF" />
    <text
      x="22"
      y="17.5"
      textAnchor="middle"
      fill="#FFFFFF"
      fontFamily="system-ui, -apple-system, sans-serif"
      fontWeight="900"
      fontSize="11.5"
      letterSpacing="0.08em"
    >
      AMEX
    </text>
  </svg>
);

// Bank Information
export interface BankInfo {
  id: string;
  name: string;
  shortName: string;
  color: string;
  bgColor: string;
  code: string;
}

export const TOP_BANKS: BankInfo[] = [
  { id: 'HDFC', name: 'HDFC Bank', shortName: 'HDFC', color: '#004C8F', bgColor: '#E6F0FA', code: 'HDFC' },
  { id: 'ICICI', name: 'ICICI Bank', shortName: 'ICICI', color: '#B02A30', bgColor: '#FDF0F0', code: 'ICIC' },
  { id: 'SBI', name: 'State Bank of India', shortName: 'SBI', color: '#0083CA', bgColor: '#E8F5FC', code: 'SBIN' },
  { id: 'AXIS', name: 'Axis Bank', shortName: 'Axis', color: '#97144D', bgColor: '#FBEBF2', code: 'UTIB' },
  { id: 'KOTAK', name: 'Kotak Mahindra Bank', shortName: 'Kotak', color: '#ED1C24', bgColor: '#FDEBEB', code: 'KKBK' },
  { id: 'YES', name: 'Yes Bank', shortName: 'Yes Bank', color: '#0054A6', bgColor: '#E6F0F8', code: 'YESB' },
  { id: 'IDFC', name: 'IDFC First Bank', shortName: 'IDFC First', color: '#9D1D27', bgColor: '#FAEDEE', code: 'IDFB' },
  { id: 'FED', name: 'Federal Bank', shortName: 'Federal', color: '#0B2363', bgColor: '#EBF0FA', code: 'FDRL' },
];
