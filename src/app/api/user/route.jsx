
import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {

    const {email , name } = await req.json();

    const user = await db.select().from(usersTable).where(eq(usersTable.email , email))

    if(user.length === 0) {
        const newUser = await db.insert(usersTable).values({
            name,
            email,
        }).returning(usersTable);
        
        console.log(newUser)

        return NextResponse.json(newUser)
    }

    return NextResponse.json(user[0]);
}