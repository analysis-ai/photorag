import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ErrorObject = {
  formErrors: string[];
  fieldErrors: {
    [key: string]: string[];
  };
};

// Function to format Zod errors
export function formatZodErrors(
  errors: ErrorObject,
  list = false
): string | string[] {
  const messages: string[] = [];

  // Add form-level errors
  messages.push(...errors.formErrors);

  // Add field-level errors
  for (const [field, fieldErrors] of Object.entries(errors.fieldErrors)) {
    fieldErrors.forEach((error) => {
      messages.push(`${field} - ${error}`);
    });
  }

  if (list) {
    // return a list of errors
    return messages;
  }

  // Join all messages with a newline
  return messages.join('\n');
}

export const getURL = (path: string = '') => {
  // Check if NEXT_PUBLIC_SITE_URL is set and non-empty. Set this to your site URL in production env.
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL &&
    process.env.NEXT_PUBLIC_SITE_URL.trim() !== ''
      ? process.env.NEXT_PUBLIC_SITE_URL
      : // If not set, check for NEXT_PUBLIC_VERCEL_URL, which is automatically set by Vercel.
        process?.env?.NEXT_PUBLIC_VERCEL_URL &&
          process.env.NEXT_PUBLIC_VERCEL_URL.trim() !== ''
        ? process.env.NEXT_PUBLIC_VERCEL_URL
        : // If neither is set, default to localhost for local development.
          'http://localhost:3000/';

  // Trim the URL and remove trailing slash if exists.
  url = url.replace(/\/+$/, '');
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`;
  // Ensure path starts without a slash to avoid double slashes in the final URL.
  path = path.replace(/^\/+/, '');

  // Concatenate the URL and the path.
  return path ? `${url}/${path}` : url;
};
