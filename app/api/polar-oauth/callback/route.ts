import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/actions/auth-actions';
import { db } from '@/db/drizzle';
import { user } from '@/db/schemas/auth-schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect('/dashboard?error=oauth_failed');
    }

    if (!code || !state) {
      return NextResponse.redirect('/dashboard?error=missing_params');
    }

    // Verify user session and state
    const session = await getSession();
    if (!session || session.user.id !== state) {
      return NextResponse.redirect('/dashboard?error=invalid_state');
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://api.polar.sh/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: process.env.POLAR_OAUTH_CLIENT_ID!,
        client_secret: process.env.POLAR_OAUTH_CLIENT_SECRET!,
        redirect_uri: process.env.POLAR_OAUTH_REDIRECT_URI!,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      return NextResponse.redirect('/dashboard?error=token_exchange_failed');
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_in, id_token } = tokenData;

    // Get user info from Polar
    const userInfoResponse = await fetch('https://api.polar.sh/v1/oauth2/userinfo', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      console.error('Failed to get user info from Polar');
      return NextResponse.redirect('/dashboard?error=userinfo_failed');
    }

    const polarUserInfo = await userInfoResponse.json();

    // Update user with Polar OAuth data
    const expiresAt = new Date(Date.now() + expires_in * 1000);
    
    await db.update(user)
      .set({
        polarUserId: polarUserInfo.sub, // Polar user ID
        polarAccessToken: access_token,
        polarRefreshToken: refresh_token,
        polarTokenExpiresAt: expiresAt,
        polarConnectedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id));

    // Redirect back to dashboard with success
    return NextResponse.redirect('/dashboard?connected=true');
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect('/dashboard?error=callback_failed');
  }
} 