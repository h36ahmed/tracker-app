import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { type WeeklyUpdateInfo } from "@/types";

export async function POST(request: NextRequest) {
  try {
    // Check for Bearer token authorization
    const authHeader = request.headers.get("authorization");
    const expectedToken = `Bearer ${process.env.SERVER_API_KEY}`;

    if (!authHeader || authHeader !== expectedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as WeeklyUpdateInfo;

    await handleWeeklyUpdate(body);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error processing Slack event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleWeeklyUpdate(update: WeeklyUpdateInfo) {
  const {
    user_id: user,
    user_name,
    channel_id: channel,
    profile_image_url,
    weekly_updates,
    project_score: score,
    timestamp,
  } = update;

  const scoreNumber = score ? Math.max(1, Math.min(5, parseInt(score))) : 5;

  try {
    // Find project by Slack channel ID
    const project = await prisma.project.findUnique({
      where: { slackChannelId: channel },
    });

    if (!project) {
      console.log(`No project found for channel ${channel}`);
      return;
    }

    const name = user_name ?? `User ${user}`;

    // Create or update user
    await prisma.user.upsert({
      where: { slackUserId: user },
      update: {},
      create: {
        slackUserId: user,
        name,
        avatar: profile_image_url,
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
        userName: name,
        text: weekly_updates,
        score: scoreNumber,
        createdAt,
      },
    });

    console.log(`Created update for project ${project.name}`);
  } catch (error) {
    console.error("Error handling weekly update:", error);
  }
}
