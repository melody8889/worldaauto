const FORM_TARGET = "https://formsubmit.co/ajax/sales01@worldaauto.com";
const THANK_YOU_URL = "/thank-you.html";

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
  const matches = String(value || "").match(/https?:\/\/|www\.|\.ru\b|\.xyz\b|\.top\b/gi);
  return matches ? matches.length : 0;
}

function collectBody(req) {
  if (!req.body) {
    return {};
  }

  if (typeof req.body === "string") {
    return Object.fromEntries(new URLSearchParams(req.body));
  }

  return req.body;
}

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }

  return req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : "";
}

function isLikelySpam(fields) {
  const honeypot = normalize(fields.website);
  if (honeypot) {
    return "honeypot";
  }

  const elapsed = Number(fields.time_on_form || 0);
  if (!Number.isFinite(elapsed) || elapsed < 4) {
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

  // Only inspect visitor-entered fields. Metadata such as source_page is a
  // legitimate URL and must not count as promotional content.
  const combinedText = USER_CONTENT_FIELDS
    .map((key) => fields[key])
    .filter((value) => value !== undefined && value !== null)
    .join(" ");
  const normalizedText = lower(combinedText);

  if (countLinks(combinedText) > 1) {
    return "too_many_links";
  }

  const hasBlockedTerm = BLOCKED_TERMS.some((term) => normalizedText.includes(term));
  if (hasBlockedTerm) {
    return "blocked_term";
  }

  return "";
}

async function forwardInquiry(fields, req) {
  const payload = {};
  Object.entries(fields).forEach(([key, value]) => {
    if (key === "website" || key === "inquiry_token") {
      return;
    }

    payload[key] = normalize(value);
  });

  payload.client_ip = getClientIp(req);
  payload.server_checked = "yes";

  return fetch(FORM_TARGET, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).send("Method Not Allowed");
    return;
  }

  const fields = collectBody(req);
  const spamReason = isLikelySpam(fields);

  if (spamReason) {
    console.warn("Inquiry rejected:", spamReason);
    res.status(400).send("Inquiry rejected.");
    return;
  }

  try {
    const response = await forwardInquiry(fields, req);
    if (!response.ok) {
      const details = await response.text();
      console.error("Inquiry forwarding failed:", response.status, details);
      res.status(502).send("Inquiry service unavailable.");
      return;
    }

    res.writeHead(303, { Location: THANK_YOU_URL });
    res.end();
  } catch (error) {
    res.status(502).send("Inquiry service unavailable.");
  }
}
