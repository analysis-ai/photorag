'use server';

import { formatZodErrors, getURL } from '@/lib/utils';

import { EmailClient } from '@azure/communication-email';
import { EmailRegister } from '@/models';
import { RegisterEmailSchema } from '@/app/actions/schema';

const client = new EmailClient(process.env.AZURE_EMAIL_CONN_STRING || '');

export const action = async (
  prevState: { message: string | string[] },
  formData: FormData
) => {
  const formObject = Object.fromEntries(formData);

  const parsed = RegisterEmailSchema.safeParse(formObject);

  if (parsed.error) {
    const list = true;
    const errorMessages = formatZodErrors(parsed.error.flatten(), list);

    return {
      ...prevState,
      message: errorMessages
    };
  }

  const { email, name } = parsed.data;

  const {
    status,
    message: recordMessage,
    data
  } = await EmailRegister.addNewSubscriber(email, name);

  if (status === 'success') {
    const message = {
      senderAddress: 'hi@photomuse.ai',
      content: {
        subject: 'Welcome to PhotoMuse - Get Ready for Something Amazing!',
        plainText: `
Hi ${name},

Thank you for signing up to be notified when PhotoMuse is ready! We're thrilled to have you on board.

PhotoMuse is designed to make managing and enjoying your photo collection easier and more inspiring than ever before. Whether you're a casual photographer or a seasoned pro, we think you'll love what we've got in store.

We'll be in touch soon with more updates, but in the meantime, feel free to reach out if you have any questions or suggestions.

To make sure you get our emails, can you please copy and paste this link to confirm your subscription?

${getURL()}/confirm-subscription?token=${data?.token}

Best regards,
Daniel and The PhotoMuse Team
hi@photomuse.ai
        `
      },
      recipients: {
        to: [
          {
            address: email,
            displayName: name
          }
        ],
        bcc: [
          {
            address: 'daniel@anny.ai',
            displayName: 'Daniel Wise'
          }
        ]
      }
    };

    await client.beginSend(message);

    return { ...prevState, message: 'Thank you for signing up!' };
  } else if (status === 'error') {
    return { ...prevState, message: `Error: ${recordMessage}` };
  } else if (status === 'duplicate') {
    return { ...prevState, message: `Duplicate: ${recordMessage}` };
  } else {
    return { ...prevState, message: 'An unknown error occurred' };
  }
};
