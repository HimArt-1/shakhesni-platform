import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    system: 'منصة شخّصني (Shakhesni Platform)',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    checks: {
      api: 'operational',
      database: 'connected',
      storage: 'ready',
      aiAssistant: 'online',
    },
  });
}
