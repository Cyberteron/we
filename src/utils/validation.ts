// Email and Phone validation utilities to prevent disposable / temp mails and fake contact details

// Comprehensive list of disposable / temporary email domains and keywords
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'guerrillamail.com',
  'guerrillamailblock.com',
  'guerrillamail.info',
  'guerrillamail.biz',
  'guerrillamail.org',
  'sharklasers.com',
  'grr.la',
  'tempmail.com',
  'temp-mail.org',
  'temp-mail.io',
  'tempmailo.com',
  'tempail.com',
  'tempmailaddress.com',
  '10minutemail.com',
  '10minutemail.net',
  '10mail.org',
  'yopmail.com',
  'yopmail.fr',
  'yopmail.net',
  'cool.fr.nf',
  'jetable.fr.nf',
  'dispostable.com',
  'trashmail.com',
  'trashmail.net',
  'trashmail.me',
  'trashmail.de',
  'trash-mail.com',
  'getairmail.com',
  'fakeinbox.com',
  'fakemailgenerator.com',
  'fakemailgenerator.net',
  'fakemail.net',
  'maildrop.cc',
  'throwawaymail.com',
  'mohmal.com',
  'inboxkitten.com',
  'inboxbear.com',
  'burnermail.io',
  'burnermail.com',
  'crazymailing.com',
  'generator.email',
  'emailfake.com',
  'emailondeck.com',
  'tmail.ws',
  'tmpmail.org',
  'tmpmail.net',
  'armyspy.com',
  'cuvox.de',
  'dayrep.com',
  'fleckens.hu',
  'gustr.com',
  'jourrapide.com',
  'rhyta.com',
  'superrito.com',
  'teleworm.us',
  'tinypm.com',
  'nada.ltd',
  'getnada.com',
  'dropmail.me',
  'mailnesia.com',
  'mailcatch.com',
  'mytemp.email',
  'mytrashmail.com',
  'mailsac.com',
  'mailnull.com',
  'spamgourmet.com',
  'mintemail.com',
  'kasmail.com',
  'incognitomail.com',
  'disposablemail.com',
  'trashcanmail.com',
  'mailpoof.com',
  'mytempemail.com',
  'spambox.us',
  'mailscrap.com',
  'zillamail.com',
  'crazymail.com',
  'anonymbox.com',
  'luxusmail.org',
  'disposable.email'
]);

const DUMMY_EMAILS = new Set([
  'test@test.com',
  'test@gmail.com',
  'asdf@asdf.com',
  'asdf@gmail.com',
  'admin@admin.com',
  'user@user.com',
  'fake@fake.com',
  'sample@sample.com',
  'abc@abc.com',
  'xyz@xyz.com',
  '123@123.com',
  'example@example.com'
]);

/**
 * Checks if an email is from a temporary / disposable email provider.
 */
export const isDisposableEmail = (email: string): boolean => {
  if (!email || !email.includes('@')) return false;
  const parts = email.trim().toLowerCase().split('@');
  if (parts.length !== 2) return false;
  const domain = parts[1];

  if (DISPOSABLE_DOMAINS.has(domain)) return true;

  // Pattern detection for disposable indicators in domain
  const disposablePattern = /(tempmail|throwaway|dispostable|guerrilla|fakeinbox|trashmail|10minute|mytemp|burnermail|fakemail)/i;
  if (disposablePattern.test(domain)) return true;

  return false;
};

/**
 * Validates whether an email address is syntactically sound and not a disposable / temp address.
 */
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  const clean = (email || '').trim().toLowerCase();
  if (!clean) {
    return { isValid: false, error: 'Email address is required.' };
  }

  // Basic RFC 5322 regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(clean)) {
    return { isValid: false, error: 'Please enter a valid email format (e.g., name@company.com).' };
  }

  // Reject dummy test emails
  if (DUMMY_EMAILS.has(clean)) {
    return { isValid: false, error: 'Please enter a genuine, reachable email address.' };
  }

  // Reject disposable domains
  if (isDisposableEmail(clean)) {
    return {
      isValid: false,
      error: 'Temporary / disposable emails are not accepted. Please use your genuine work or personal email.'
    };
  }

  return { isValid: true };
};

/**
 * Validates whether a phone number is genuine (at least 10 digits, not a dummy repeating or sequential pattern).
 */
export const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
  const raw = (phone || '').trim();
  if (!raw) {
    return { isValid: false, error: 'Contact phone number is required.' };
  }

  const digits = raw.replace(/\D/g, '');

  if (digits.length < 10) {
    return { isValid: false, error: 'Please enter a complete phone number (minimum 10 digits).' };
  }

  if (digits.length > 15) {
    return { isValid: false, error: 'Phone number exceeds maximum length (max 15 digits).' };
  }

  // Reject all repeating digits like 0000000000, 1111111111, 9999999999
  if (/^(\d)\1+$/.test(digits)) {
    return { isValid: false, error: 'Please enter a genuine phone number, not repeated digits.' };
  }

  // Reject simple dummy sequences
  const dummySequences = [
    '0123456789',
    '1234567890',
    '9876543210',
    '8765432109',
    '1234512345',
    '1234567891',
    '0000012345',
    '1231231234'
  ];

  if (dummySequences.some((seq) => digits.includes(seq))) {
    return { isValid: false, error: 'Please enter a genuine phone number, not a placeholder sequence.' };
  }

  // For 10-digit Indian numbers, genuine mobile numbers start with 6, 7, 8, or 9
  if (digits.length === 10 && !/^[6-9]/.test(digits)) {
    return {
      isValid: false,
      error: '10-digit mobile numbers must start with 6, 7, 8, or 9 (or include country code, e.g., +91).'
    };
  }

  return { isValid: true };
};
