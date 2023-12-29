import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

import { NextResponse } from 'next/server';
import { parse } from 'url';

export async function GET(req: Request, res: Response) {
    try {
        const { query } = parse(req.url, true);
        const src = Array.isArray(query.src) ? query.src[0] : query.src;
        const tgt = Array.isArray(query.tgt) ? query.tgt[0] : query.tgt;

        console.log(src);
        console.log(tgt);
        if (!src || !tgt) {
            return new NextResponse(null, {
                status: 400,
                statusText: 'Language pair not valid',
            });
        }
        const randomEntry = await prisma.contribution.findFirst({
            where: {
                src: src,
                tgt: tgt,
                isValidated: false,
            },
        });
        console.log(randomEntry);
        if (!randomEntry) {
            return new NextResponse(null, {
                status: 400,
                statusText: 'No more entries for validation',
            });
        }
        return new NextResponse(JSON.stringify(randomEntry), {
            status: 200,
        });
    } catch (error) {
        console.log(error);
        return new NextResponse(null, {
            status: 500,
            statusText: 'Internal Server Error',
        });
    }
}

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
   
        // check if languages are zgh or zgh-ber
        let srcVar =
            body.src === 'ber' || body.src === 'zgh' ? body.srcVar : null;
        let tgtVar =
            body.tgt === 'ber' || body.tgt === 'zgh' ? body.tgtVar : null;

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
                isValidated: false,
                validation: 0,
            },
        });
        const updatedUser = await prisma.user.findUnique({
            where: {
                id: body.userId,
            },
        });
        console.log(contribution);
        console.log(updatedUser);
        return new NextResponse(JSON.stringify(updatedUser), {});
    } catch (error) {
        return console.log(error);
    }
}
