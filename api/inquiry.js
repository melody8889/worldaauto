const THANK_YOU_URL = "/thank-you.html";
const INQUIRY_RECIPIENT =
  process.env.INQUIRY_RECIPIENT || "sales01@worldaauto.com";

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
  // Customer submissions must never be blocked by client-side anti-bot rules.
  return "";
}

async function forwardInquiry(fields, req) {
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

  return fetch(
    `https://formsubmit.co/${encodeURIComponent(INQUIRY_RECIPIENT)}`,
    {
      method: "POST",
      headers: {
        Accept: "text/html,application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        ...Object.fromEntries(
          Object.entries(fields).map(([key, value]) => [key, normalize(value)])
        ),
        _subject: subject,
        _replyto: normalize(fields.email),
        _template: "table",
        _captcha: "false"
      }).toString()
    }
  );
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
  try {
    const response = await forwardInquiry(fields, req);

    if (!response.ok) {
      const details = await response.text();

      console.error(
        "Inquiry forwarding failed:",
        response.status,
        details
      );

      // Do not show the thank-you page when the mail provider rejected the
      // message. A successful page here makes failed inquiries look delivered.
      res.status(502).json({
        ok: false,
        error: "Inquiry service unavailable. Please try again or contact us on WhatsApp."
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
