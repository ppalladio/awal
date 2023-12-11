import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

export async function POST(req: Request, res: Response) {
    try {
        const body = await req.json();

        console.log(body);
        const existingUser = await prisma.user.findUnique({
            where: {
                id: body.userId,
            },
        });
        console.log(existingUser);
        if (!existingUser) {
            redirect('/signIn');
        }
        let updatedScore = existingUser.score + body.contributionPoint;
        console.log(updatedScore);
        if (body.src === body.tgt) {
        }
        // update contribution score
        const updatedUserScore = await prisma.user.updateMany({
            where: {
                id: body.userId,
            },
            data: {
                score: updatedScore,
            },
        });
        // check if languages are zgh or zgh-lad(ber)
        let srcVar =
            body.src === 'lad' || body.src === 'zgh' ? body.srcVar : null;
        let tgtVar =
            body.tgt === 'lad' || body.tgt === 'zgh' ? body.tgtVar : null;

        // create contribution entry
        const contribution = await prisma.contribution.create({
            data: {
                username: existingUser.username,
                userId: body.userId,
                src: body.src,
                tgt: body.tgt,
                src_text: body.src_text,
                tgt_text: body.tgt_text,
                srcVar,
                tgtVar,
                lad: body.lad,
                zgh: body.zgh,
            },
        });
        console.log(contribution);

        return new NextResponse(JSON.stringify(body), {});
    } catch (error) {
        return console.log(error);
    }
}
