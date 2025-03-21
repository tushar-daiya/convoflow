import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const redirect_uri = `${process.env.FRONTEND_URL}/api/auth/callback/dropbox`;
  const scope =
    "account_info.read files.content.read files.metadata.read file_requests.read";
  const url = `https://www.dropbox.com/oauth2/authorize?client_id=${process.env.AUTH_DROPBOX_ID}&response_type=code&redirect_uri=${redirect_uri}&scope=${scope}&token_access_type=offline`;
  return NextResponse.redirect(url);
}
