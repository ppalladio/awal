import getCurrentUser from "@/app/actions/get/getCurrentUser";

export async function POST(req:Request) {
	
	const user =await getCurrentUser()
	console.log(req)

}