import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const BATCH_SIZE = 50;
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { subject, body, fromName, recipients } = await req.json();

    if (!subject || !body || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const from = `${fromName} <${process.env.RESEND_FROM_EMAIL}>`;

    const validRecipients =
      process.env.NODE_ENV === "development"
        ? [process.env.RESEND_TEST_EMAIL!]
        : recipients.filter(isValidEmail);

    const skipped = recipients.length - validRecipients.length;

    if (validRecipients.length === 0) {
      return NextResponse.json({ error: "No valid email addresses to send to." }, { status: 400 });
    }

    const recipientBatches: string[][] = [];
    for (let i = 0; i < validRecipients.length; i += BATCH_SIZE) {
      recipientBatches.push(validRecipients.slice(i, i + BATCH_SIZE));
    }

    const responses = await Promise.all(
      recipientBatches.map((batch) =>
        resend.emails.send({
          from,
          to: batch,
          subject,
          html: body,
          headers: {
            "List-Unsubscribe": `<mailto:unsubscribe@${process.env.RESEND_DOMAIN}>`,
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      id: responses[0]?.data?.id,
      batches: recipientBatches.length,
      sent: validRecipients.length,
      skipped,
    });
  } catch (error) {
    console.error("[newsletter/send]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error." },
      { status: 500 }
    );
  }
}