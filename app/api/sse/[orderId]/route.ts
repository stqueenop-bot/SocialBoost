// ============================================
// Next.js API Route: GET /api/sse/[orderId]
// Proxies SSE stream from Express backend
// ============================================

import { NextRequest } from 'next/server';
import { BACKEND_URL } from '@/lib/api-config';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    const { orderId } = await params;

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            try {
                const response = await fetch(
                    `${BACKEND_URL}/api/status/stream/${orderId}`,
                    {
                        headers: { Accept: 'text/event-stream' },
                    }
                );

                if (!response.body) {
                    controller.enqueue(encoder.encode('data: {"error":"No stream available"}\n\n'));
                    controller.close();
                    return;
                }

                const reader = response.body.getReader();

                const pump = async () => {
                    try {
                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) break;
                            controller.enqueue(value);
                        }
                    } catch {
                        // Stream closed
                    } finally {
                        controller.close();
                    }
                };

                pump();
            } catch (error) {
                console.error('[SSE Proxy] Error:', error);
                controller.enqueue(encoder.encode('data: {"error":"Failed to connect"}\n\n'));
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
        },
    });
}
