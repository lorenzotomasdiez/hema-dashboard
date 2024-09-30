import { db } from "@/lib/db/index";
import { faker } from '@faker-js/faker';
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { companyId: string } }) {
  // if (process.env.NODE_ENV !== "development") {
  //   return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  // }
  if (!params.companyId) return NextResponse.json({ error: "No companyId provided" }, { status: 400 });
  try {
    const numberOfClients = 15;

    for (let i = 0; i < numberOfClients; i++) {
      await db.client.create({
        data: {
          name: faker.person.fullName(),
          phone: faker.phone.number(),
          address: faker.location.streetAddress(),
          companyId: params.companyId
        }
      });
    }
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error creating clients:", error);
    return NextResponse.json({ error: "Error creating clients" }, { status: 500 });
  }
}