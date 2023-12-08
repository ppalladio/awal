import getCurrentUser from "@/app/actions/get/getCurrentUser";
import prisma from "@/lib/prisma";
import { useSession } from "next-auth/react";
import { NextResponse } from "next/server";

export async function POST(req:Request,res:Response) {
	try {
		const body = await req.json();
        console.log(body.userId);
		return new NextResponse(JSON.stringify(body), {})
	} catch (error) {
		return console.log(error);
		
	}

	return new NextResponse('Hello World', {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	})
	// const currentUser = await useSession()
	// console.log(currentUser)

	// const user = prisma.user.findFirst({
	// 	where:{
	// 		userId: currentUser?.user?.id
	// 	}
	// })

}