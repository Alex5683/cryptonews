import { NextResponse } from 'next/server';

export async function GET() {
  const adminSecret = process.env.ADMIN_SECRET;
  return NextResponse.json({
    adminSecretDefined: !!adminSecret,
    adminSecretLength: adminSecret ? adminSecret.length : 0,
  });
}
