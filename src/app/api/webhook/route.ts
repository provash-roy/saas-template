import prisma from "@/lib/prisma";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    const { id } = evt.data;
    const eventType = evt.type;

    console.log(`Received webhook ID ${id}, type ${eventType}`);
    console.log("Payload:", evt.data);

    if (eventType === "user.created") {
      const email = evt.data.email_addresses[0]?.email_address;

      if (!email) {
        return new Response("Email not found", { status: 400 });
      }

      await prisma.user.upsert({
        where: { id: evt.data.id },
        update: {},
        create: {
          id: evt.data.id,
          email: email,
        },
      });

      console.log("User saved to DB");
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
