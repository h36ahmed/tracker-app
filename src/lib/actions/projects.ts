"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Vertical } from "@/types";

export interface CreateProjectFormData {
  name: string;
  slackChannelId: string;
  vertical: Vertical;
  description?: string;
}

export interface ActionResult {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export async function createProject(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    // Extract and validate form data
    const name = formData.get("name") as string;
    const slackChannelId = formData.get("slackChannelId") as string;
    const vertical = formData.get("vertical") as Vertical;
    const description = formData.get("description") as string;

    // Basic validation
    const errors: Record<string, string[]> = {};

    if (!name || name.trim().length === 0) {
      errors.name = ["Project name is required"];
    }

    if (!slackChannelId || slackChannelId.trim().length === 0) {
      errors.slackChannelId = ["Slack Channel ID is required"];
    }

    if (!vertical || !["CRYPTO", "APP", "COMMERCE"].includes(vertical)) {
      errors.vertical = ["Please select a valid vertical"];
    }

    // Check if slack channel ID already exists
    if (slackChannelId) {
      const existingProject = await prisma.project.findUnique({
        where: { slackChannelId: slackChannelId.trim() },
      });

      if (existingProject) {
        errors.slackChannelId = ["This Slack Channel ID is already in use"];
      }
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Please fix the errors below",
        errors,
      };
    }

    // Create the project
    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        slackChannelId: slackChannelId.trim(),
        vertical,
        description: description?.trim() || null,
      },
    });

    // Revalidate the admin page to show the new project
    revalidatePath("/admin");
    revalidatePath("/");

    return {
      success: true,
      message: `Project "${project.name}" created successfully!`,
    };
  } catch (error) {
    console.error("Failed to create project:", error);
    return {
      success: false,
      message: "Failed to create project. Please try again.",
    };
  }
}

export async function deleteProject(projectId: string): Promise<ActionResult> {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return {
        success: false,
        message: "Project not found",
      };
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    revalidatePath("/admin");
    revalidatePath("/");

    return {
      success: true,
      message: `Project "${project.name}" deleted successfully`,
    };
  } catch (error) {
    console.error("Failed to delete project:", error);
    return {
      success: false,
      message: "Failed to delete project. Please try again.",
    };
  }
}
