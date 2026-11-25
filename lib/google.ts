import { google } from 'googleapis';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function calendarForRequest(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.accessToken) throw new Error('UNAUTHENTICATED');
  const oauth = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
  oauth.setCredentials({ access_token: token.accessToken as string, refresh_token: token.refreshToken as string | undefined });
  return google.calendar({ version: 'v3', auth: oauth });
}
export function apiError(error: unknown) {
  const message = error instanceof Error ? error.message : 'Unexpected error';
  const status = message === 'UNAUTHENTICATED' ? 401 : 500;
  return Response.json({ error: status === 401 ? 'Please sign in with Google.' : message }, { status });
}
