import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/actions/auth-actions';

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Polar OAuth configuration
    const clientId = process.env.POLAR_OAUTH_CLIENT_ID;
    const redirectUri = process.env.POLAR_OAUTH_REDIRECT_URI;
    
    if (!clientId || !redirectUri) {
      console.error('Missing Polar OAuth configuration');
      return NextResponse.json({ error: 'OAuth configuration missing' }, { status: 500 });
    }

    // Build authorization URL
    const authUrl = new URL('https://polar.sh/oauth2/authorize');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', 'openid email user:read products:read products:write');

    return NextResponse.redirect(authUrl.toString());
  } catch (error) {
    console.error('Error initiating Polar OAuth:', error);
    return NextResponse.json({ error: 'Failed to initiate OAuth' }, { status: 500 });
  }
} 