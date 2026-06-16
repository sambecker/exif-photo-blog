'use server';

import { Resend } from 'resend';
import WelcomeEmail from './WelcomeEmail';
import SelectionEmail from './SelectionEmail';
import { getLockedPhotos } from '@/photo/db/query';
import { getServerSession } from '@/auth/server';

const resend = new Resend(process.env.RESEND_API_KEY );
const FROM_EMAIL =
  process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL || 'onboarding@resend.dev';

export async function sendWelcomeEmailAction(email: string) {
  if (!email) return;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Bienvenido a Polifonía Visual',
      react: WelcomeEmail(),
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception sending welcome email:', error);
    return { success: false, error };
  }
}

export async function sendSelectionEmailAction() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    // Ensure email is available for filtering
    throw new Error('Unauthorized');
  }

  const lockedPhotos = await getLockedPhotos();
  const userPhotos = lockedPhotos.filter(
    (p) => p.lockedBy === session.user.email,
  );

  if (userPhotos.length === 0) {
    throw new Error('No photos selected/locked found for this user.');
  }

  if (userPhotos.length === 0) {
    throw new Error('No photos selected/locked found for this user.');
  }

  // Map to the format needed for email
  const photosForEmail = userPhotos.map((p) => ({
    id: p.id,
    title: p.title || 'Untitled',
    url: p.url,
    urlHighRes: p.urlHighRes,
  }));

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: session.user.email,
      subject: 'Tus fotos seleccionadas - Polifonía Visual',
      react: SelectionEmail({ photos: photosForEmail }),
    });

    if (error) {
      console.error('Error sending selection email:', error);
      throw new Error(error.message);
    }

    return { success: true, count: userPhotos.length };
  } catch (error: any) {
    console.error('Exception sending selection email:', error);
    throw new Error(error.message || 'Failed to send email');
  }
}
