import { NextResponse } from "next/server";
import { publishedTreatments } from "@/content/treatments";
import { onlyDigits, validateContact, type ContactPayload } from "@/lib/contact";

/**
 * Recebe o formulário de contato e encaminha para o webhook configurado em
 * CONTACT_WEBHOOK_URL (Zapier, Make, n8n, CRM...). Os dados não são
 * armazenados pelo site.
 */
export async function POST(request: Request) {
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json({ ok: false, error: "Webhook não configurado." }, { status: 501 });
  }

  let body: Partial<ContactPayload> & { website?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requisição inválida." }, { status: 400 });
  }

  // Honeypot anti-spam: campo invisível que pessoas não preenchem.
  if (body.website) return NextResponse.json({ ok: true });

  const payload: ContactPayload = {
    name: String(body.name ?? "").slice(0, 80),
    phone: String(body.phone ?? "").slice(0, 20),
    treatment: String(body.treatment ?? "").slice(0, 60),
    message: String(body.message ?? "").slice(0, 600),
    consent: body.consent === true,
  };

  const errors = validateContact(payload);
  const validTreatment =
    payload.treatment === "nao-sei" || publishedTreatments.some((t) => t.slug === payload.treatment);
  if (Object.keys(errors).length > 0 || !validTreatment) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        phone: onlyDigits(payload.phone),
        source: "site",
        consentAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error(`Webhook respondeu ${response.status}`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] falha ao encaminhar:", error);
    return NextResponse.json({ ok: false, error: "Não foi possível enviar agora." }, { status: 502 });
  }
}
