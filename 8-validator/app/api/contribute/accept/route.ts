import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, res: Response) {
   
    try {
        const body = await req.json();
		const validationCount = body.validation + 1;
        const isValidated = validationCount >= 2;
		console.log(body)
        const updatedEntry = await prisma.contribution.updateMany({
            where: { id: body.id },
            data: {
                validation: validationCount,
                isValidated
            },
        });
		const updatedUser = await prisma.user.update({
            where: { id: body.userId },
            data: {
                score:{ increment: 1 },
            },
        });
		console.log(updatedEntry)
       return new NextResponse(JSON.stringify({ updatedEntry, updatedUser }), {});
    } catch (error) {
        return new NextResponse(null, {
            status: 500,
            statusText: 'Internal Server Error',
        });
    }
}