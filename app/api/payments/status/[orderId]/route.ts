// ============================================
// Next.js API Route: GET /api/payments/status/[orderId]
// BFF proxy: fetches payment status
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/api-config';
const API_AUTH_KEY = process.env.BACKEND_API_KEY || '';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        const { orderId } = await params;

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (API_AUTH_KEY) {
            headers['Authorization'] = `Bearer ${API_AUTH_KEY}`;
        }

        const response = await fetch(`${BACKEND_URL}/api/payments/status/${orderId}`, {
            method: 'GET',
            headers,
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('[API /payments/status/:orderId] Error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
