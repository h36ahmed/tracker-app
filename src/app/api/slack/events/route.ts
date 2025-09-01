import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SlackEvent } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle Slack URL verification challenge
    if (body.type === "url_verification") {
      return NextResponse.json({ challenge: body.challenge });
    }

    // Handle Slack events
    if (body.type === "event_callback") {
      const event: SlackEvent = body;

      // Only process message events
      if (
        event.event.type === "message" &&
        !event.event.text?.startsWith("<@")
      ) {
        await handleSlackMessage({
          channel: event.event.channel,
          user: event.event.user,
          text: event.event.text,
          timestamp: event.event.ts,
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error processing Slack event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleSlackMessage({
  channel,
  user,
  text,
  timestamp,
}: {
  channel: string;
  user: string;
  text: string;
  timestamp: string;
}) {
  try {
    // Find project by Slack channel ID
    const project = await prisma.project.findUnique({
      where: { slackChannelId: channel },
    });

    if (!project) {
      console.log(`No project found for channel ${channel}`);
      return;
    }

    // Create or update user
    await prisma.user.upsert({
      where: { slackUserId: user },
      update: {},
      create: {
        slackUserId: user,
        name: `User ${user}`, // In a real app, you'd fetch user info from Slack API
      },
    });

    // Create update
    const createdAt = isNaN(parseFloat(timestamp))
      ? new Date(timestamp) // ISO string format
      : new Date(parseFloat(timestamp) * 1000); // Unix timestamp in seconds

    await prisma.update.create({
      data: {
        projectId: project.id,
        userId: user,
        userName: `User ${user}`,
        text,
        createdAt,
      },
    });

    console.log(`Created update for project ${project.name}: ${text}`);
  } catch (error) {
    console.error("Error handling Slack message:", error);
  }
}
