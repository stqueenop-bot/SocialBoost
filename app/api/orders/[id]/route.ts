// ============================================
// Next.js API Route: GET /api/orders/[id]
// BFF proxy: fetches single order status
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/api-config';
const API_AUTH_KEY = process.env.BACKEND_API_KEY || '';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (API_AUTH_KEY) {
            headers['Authorization'] = `Bearer ${API_AUTH_KEY}`;
        }

        const response = await fetch(`${BACKEND_URL}/api/orders/${id}`, {
            method: 'GET',
            headers,
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('[API /orders/:id] Error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
