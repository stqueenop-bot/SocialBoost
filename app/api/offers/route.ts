// ============================================
// Next.js API Route: GET /api/offers?service=xxx
// BFF proxy: Frontend → Next.js → Express backend
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/api-config';

export async function GET(request: NextRequest) {
    try {
        const service = request.nextUrl.searchParams.get('service');

        if (!service) {
            return NextResponse.json(
                { success: false, message: 'service query param required' },
                { status: 400 }
            );
        }

        const response = await fetch(
            `${BACKEND_URL}/api/offers?service=${encodeURIComponent(service)}`,
            {
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store',
            }
        );

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('[API /offers] Error:', error);
        return NextResponse.json(
            { success: true, data: null },
            { status: 200 }
        );
    }
}
