import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/actions/auth-actions';
import { db } from '@/db/drizzle';
import { user } from '@/db/schemas/auth-schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 OAuth callback started');
    
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    console.log('📝 OAuth callback params:', { 
      hasCode: !!code, 
      hasState: !!state, 
      error 
    });

    // Handle OAuth errors
    if (error) {
      console.error('❌ OAuth error:', error);
      return NextResponse.redirect(new URL('/dashboard?error=oauth_failed', request.url));
    }

    if (!code || !state) {
      console.error('❌ Missing code or state');
      return NextResponse.redirect(new URL('/dashboard?error=missing_params', request.url));
    }

    // Verify user session and state
    const session = await getSession();
    console.log('👤 Session check:', { 
      hasSession: !!session, 
      sessionUserId: session?.user?.id,
      stateParam: state 
    });
    
    if (!session || session.user.id !== state) {
      console.error('❌ Invalid session or state mismatch');
      return NextResponse.redirect(new URL('/dashboard?error=invalid_state', request.url));
    }

    console.log('🔑 Exchanging code for token...');
    
    // Exchange code for access token (using sandbox endpoint)
    const tokenResponse = await fetch('https://sandbox-api.polar.sh/v1/oauth2/token', {
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
      console.error('❌ Token exchange failed:', errorText);
      return NextResponse.redirect(new URL('/dashboard?error=token_exchange_failed', request.url));
    }

    const tokenData = await tokenResponse.json();
    console.log('✅ Token exchange successful');
    
    const { access_token, refresh_token, expires_in, id_token } = tokenData;

    console.log('👤 Getting user info from Polar...');
    
    // Get user info from Polar (using sandbox endpoint)
    const userInfoResponse = await fetch('https://sandbox-api.polar.sh/v1/oauth2/userinfo', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      console.error('❌ Failed to get user info from Polar');
      return NextResponse.redirect(new URL('/dashboard?error=userinfo_failed', request.url));
    }

    const polarUserInfo = await userInfoResponse.json();
    console.log('✅ Got user info:', { sub: polarUserInfo.sub });

    console.log('💾 Updating database...');
    
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

    console.log('✅ Database updated successfully');
    console.log('🎉 OAuth flow completed successfully');

    // Redirect back to dashboard with success
    return NextResponse.redirect(new URL('/dashboard?connected=true', request.url));
  } catch (error) {
    console.error('💥 OAuth callback error:', error);
    return NextResponse.redirect(new URL('/dashboard?error=callback_failed', request.url));
  }
} 