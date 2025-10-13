import { isSpoofedBot } from "@arcjet/inspect";
import { NextResponse } from "next/server";
import { arcjetAPI } from "@/lib/arcjet";

export async function POST(req: Request) {
  const decision = await arcjetAPI.protect(req, {
    requested: 5,
  });

  console.log("Arcjet decision", decision);

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit && decision.reason.isRateLimit()) {
      return NextResponse.json(
        { error: "Too Many Requests", reason: decision.reason },
        { status: 429 }
      );
    } else if (decision.reason.isBot && decision.reason.isBot()) {
      return NextResponse.json(
        { error: "No bots allowed", reason: decision.reason },
        { status: 403 }
      );
    } else if (decision.reason.isEmail && decision.reason.isEmail()) {
      return NextResponse.json(
        { error: "Invalid email", reason: decision.reason },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { error: "Forbidden", reason: decision.reason },
        { status: 403 }
      );
    }
  }

  // IP hosting kontrolü
  if (decision.ip.isHosting && decision.ip.isHosting()) {
    return NextResponse.json(
      { error: "Forbidden (hosting IP)", reason: decision.reason },
      { status: 403 }
    );
  }

  // Spoofed bot kontrolü
  if (decision.results.some(isSpoofedBot)) {
    return NextResponse.json(
      { error: "Forbidden (spoofed bot)", reason: decision.reason },
      { status: 403 }
    );
  }

  return NextResponse.json({ message: "Hello world" });
}


export async function GET(req: Request) {
  const decision = await arcjetAPI.protect(req, { 
    requested: 5 
  }); // Deduct 5 tokens from the bucket

  for (const result of decision.results) {
    console.log("Rule Result", result);
  }
  console.log("Arcjet decision", decision);

  if (decision.isDenied()) {
    return NextResponse.json(
      { error: "Too Many Requests", reason: decision.reason },
      { status: 429 },
    );
  }

  return NextResponse.json({ message: "Hello world" });
}