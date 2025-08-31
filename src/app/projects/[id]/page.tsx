import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import {
  calculateHealthStatus,
  formatRelativeTime,
  getDaysSinceUpdate,
} from "@/lib/utils";
import { HealthStatus } from "@/types";

type Params = {
  id: string;
};

interface ProjectPageProps {
  params: Promise<Params>;
}

async function getProject(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      updates: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!project) {
    return null;
  }

  const latestUpdate = project.updates[0];
  const healthStatus = calculateHealthStatus(
    latestUpdate?.createdAt || null,
    latestUpdate?.text
  );
  const daysSinceLastUpdate = getDaysSinceUpdate(
    latestUpdate?.createdAt || null
  );

  return {
    ...project,
    latestUpdate,
    healthStatus,
    daysSinceLastUpdate,
  };
}

function getHealthBadgeVariant(status: HealthStatus) {
  switch (status) {
    case "GREEN":
      return "success";
    case "YELLOW":
      return "warning";
    case "RED":
      return "danger";
    default:
      return "secondary";
  }
}

function getVerticalEmoji(vertical: string) {
  switch (vertical) {
    case "CRYPTO":
      return "₿";
    case "APP":
      return "📱";
    case "COMMERCE":
      return "🛒";
    default:
      return "📊";
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <span>{getVerticalEmoji(project.vertical)}</span>
                  {project.name}
                </CardTitle>
                <Badge variant={getHealthBadgeVariant(project.healthStatus)}>
                  {project.healthStatus}
                </Badge>
              </div>
              <CardDescription>
                {project.description ||
                  `${project.vertical.toLowerCase()} project`}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Updates</CardTitle>
              <CardDescription>
                Latest developer updates from Slack
              </CardDescription>
            </CardHeader>
            <CardContent>
              {project.updates.length > 0 ? (
                <div className="space-y-4">
                  {project.updates.map((update) => (
                    <div
                      key={update.id}
                      className="border-l-2 border-muted pl-4 pb-4 last:pb-0"
                    >
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <User className="h-4 w-4" />
                        <span>
                          {update.userName || `User ${update.userId}`}
                        </span>
                        <Calendar className="h-4 w-4 ml-2" />
                        <span>{formatRelativeTime(update.createdAt)}</span>
                      </div>
                      <p className="text-sm">{update.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No updates yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium">Status</div>
                <Badge
                  variant={getHealthBadgeVariant(project.healthStatus)}
                  className="mt-1"
                >
                  {project.healthStatus}
                </Badge>
              </div>
              <div>
                <div className="text-sm font-medium">Last Update</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {project.latestUpdate
                    ? formatRelativeTime(project.latestUpdate.createdAt)
                    : "No updates"}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Days Since Update</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {project.daysSinceLastUpdate === Infinity
                    ? "Never"
                    : `${project.daysSinceLastUpdate} days`}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium">Vertical</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {project.vertical.toLowerCase()}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Slack Channel</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {project.slackChannelId}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Created</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {formatRelativeTime(project.createdAt)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
