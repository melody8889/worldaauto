const THANK_YOU_URL = "/thank-you.html";
const INQUIRY_RECIPIENT =
  process.env.INQUIRY_RECIPIENT || "sales01@worldaauto.com";
const RESEND_FROM =
  process.env.RESEND_FROM || "Worlda Global Auto <onboarding@resend.dev>";

const BLOCKED_TERMS = [
  "casino",
  "crypto",
  "forex",
  "loan",
  "porn",
  "seo service",
  "telegram bot",
  "viagra"
];

const USER_CONTENT_FIELDS = [
  "name",
  "company_name",
  "email",
  "whatsapp",
  "destination_country",
  "destination_port",
  "target_model",
  "model_year",
  "fuel_type",
  "quantity",
  "purchase_timeline",
  "message"
];

function normalize(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function lower(value) {
  return normalize(value).toLowerCase();
}

function countLinks(value) {
  const matches = String(value || "").match(
    /https?:\/\/|www\.|\.ru\b|\.xyz\b|\.top\b/gi
  );

  return matches ? matches.length : 0;
}

function collectBody(req) {
  if (!req.body) {
    return {};
  }

  if (typeof req.body === "string") {
    return Object.fromEntries(new URLSearchParams(req.body));
  }

  if (typeof req.body === "object") {
    return req.body;
  }

  return {};
}

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];

  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }

  return req.socket && req.socket.remoteAddress
    ? req.socket.remoteAddress
    : "";
}

function isLikelySpam(fields) {
  const honeypot = normalize(fields.website);

  if (honeypot) {
    return "honeypot";
  }

  // The time field is only a signal. Older pages, browsers with scripts
  // disabled, and legitimate quick submissions do not always send it.
  // Treat an explicitly invalid value as suspicious, but do not reject a
  // normal form post just because the client-side timer was unavailable.
  const rawElapsed = normalize(fields.time_on_form);
  const elapsed = Number(rawElapsed);

  if (rawElapsed && (!Number.isFinite(elapsed) || elapsed < 1)) {
    return "too_fast";
  }

  const email = lower(fields.email);
  const whatsapp = lower(fields.whatsapp);

  if (!email && !whatsapp) {
    return "missing_contact";
  }

  const requiredFields = [
    "name",
    "destination_country",
    "target_model",
    "model_year",
    "quantity",
    "purchase_timeline"
  ];

  if (requiredFields.some((field) => !normalize(fields[field]))) {
    return "missing_required_field";
  }

  const modelYear = Number(fields.model_year);

  if (!Number.isInteger(modelYear) || modelYear < 1990 || modelYear > 2100) {
    return "bad_model_year";
  }

  const quantity = normalize(fields.quantity);

  if (quantity && !/[0-9]/.test(quantity)) {
    return "bad_quantity";
  }

  const combinedText = USER_CONTENT_FIELDS
    .map((key) => fields[key])
    .filter((value) => value !== undefined && value !== null)
    .join(" ");

  const normalizedText = lower(combinedText);

  if (countLinks(combinedText) > 1) {
    return "too_many_links";
  }

  const hasBlockedTerm = BLOCKED_TERMS.some((term) =>
    normalizedText.includes(term)
  );

  if (hasBlockedTerm) {
    return "blocked_term";
  }

  return "";
}

async function forwardInquiry(fields, req) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY");
  }

  const subject = [
    "New vehicle inquiry",
    normalize(fields.target_model),
    normalize(fields.destination_country)
  ].filter(Boolean).join(" - ");

  const rows = Object.entries({
    ...fields,
    client_ip: getClientIp(req),
    server_checked: "yes"
  })
    .filter(([key]) => key !== "website" && key !== "inquiry_token")
    .map(([key, value]) =>
      `<tr><th align="left">${key}</th><td>${escapeHtml(normalize(value))}</td></tr>`
    )
    .join("");

  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: [INQUIRY_RECIPIENT],
      reply_to: normalize(fields.email) || undefined,
      subject,
      html: `<h2>${escapeHtml(subject)}</h2><table border="1" cellpadding="8" cellspacing="0">${rows}</table>`
    })
  });
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[character]));
}

export default async function handler(req, res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") {
    res.setHeader("Allow", "POST, OPTIONS");
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ ok: false, error: "Method Not Allowed" });
    return;
  }

  const fields = collectBody(req);
  const spamReason = isLikelySpam(fields);

  if (spamReason) {
    console.warn("Inquiry rejected:", spamReason);
    res.status(400).json({
      ok: false,
      error: "Inquiry rejected.",
      reason: spamReason
    });
    return;
  }

  try {
    const response = await forwardInquiry(fields, req);

    if (!response.ok) {
      const details = await response.text();

      console.error(
        "Inquiry forwarding failed:",
        response.status,
        details
      );

      res.status(502).json({
        ok: false,
        error: "Inquiry service unavailable.",
        upstreamStatus: response.status
      });
      return;
    }

    res.writeHead(303, {
      Location: THANK_YOU_URL
    });

    res.end();
  } catch (error) {
    console.error("Inquiry forwarding error:", error);

    res.status(502).json({ ok: false, error: "Inquiry service unavailable." });
  }
}
