import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, res: Response) {
    try {
        const body = await req.json();
        console.log(body);
        const updatedUser = await prisma.user.update({
            where: { id: body.userId },
            data: {
                score: { increment: 1 },
            },
        });
        return new NextResponse(JSON.stringify({ updatedUser }), {});
    } catch (error) {
        return new NextResponse(null, {
            status: 500,
            statusText: 'Internal Server Error',
        });
    }
}
