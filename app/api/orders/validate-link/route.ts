// ============================================
// Next.js API Route: POST /api/orders/validate-link
// BFF proxy: validates Instagram link type
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/api-config';
const API_AUTH_KEY = process.env.BACKEND_API_KEY || '';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (API_AUTH_KEY) {
            headers['Authorization'] = `Bearer ${API_AUTH_KEY}`;
        }

        const response = await fetch(`${BACKEND_URL}/api/orders/validate-link`, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('[API /orders/validate-link] Error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
