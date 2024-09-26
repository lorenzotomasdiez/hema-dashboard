import { db } from "@/lib/db/index";
import { faker } from '@faker-js/faker';

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return new Response("Error not allowed", { status: 403 });
  }
  try {
    const numberOfClients = 15;

    for (let i = 0; i < numberOfClients; i++) {
      await db.client.create({
        data: {
          name: faker.person.fullName(),           
          phone: faker.phone.number(),           
          address: faker.location.streetAddress()
        }
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (error) {
    console.error("Error creating clients:", error);
    return new Response("Error creating clients", { status: 500 });
  }
}