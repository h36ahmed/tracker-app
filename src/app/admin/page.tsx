import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatRelativeTime } from "@/lib/utils";
import { Vertical } from "@/types";

async function getAdminStats() {
  const [totalProjects, totalUpdates, recentUpdates] = await Promise.all([
    prisma.project.count(),
    prisma.update.count(),
    prisma.update.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        project: true,
      },
    }),
  ]);

  const projectsByVertical = await prisma.project.groupBy({
    by: ["vertical"],
    _count: {
      vertical: true,
    },
  });

  return {
    totalProjects,
    totalUpdates,
    recentUpdates,
    projectsByVertical,
  };
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

export default async function AdminPage() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage projects and monitor system health
          </p>
        </div>
        <div className="flex gap-2">
          <Button>Add Project</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <div className="h-4 w-4 text-muted-foreground">📊</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">Active projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Updates</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">💬</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUpdates}</div>
            <p className="text-xs text-muted-foreground">All time updates</p>
          </CardContent>
        </Card>

        {stats.projectsByVertical.map((vertical) => (
          <Card key={vertical.vertical}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium capitalize">
                {vertical.vertical} Projects
              </CardTitle>
              <div className="h-4 w-4 text-muted-foreground">
                {getVerticalEmoji(vertical.vertical)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {vertical._count.vertical}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
            <CardDescription>
              Latest developer updates across all projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentUpdates.map((update) => (
                <div key={update.id} className="flex items-start space-x-4">
                  <div className="shrink-0">
                    <Badge variant="outline">
                      {getVerticalEmoji(update.project.vertical)}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {update.project.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {update.text}
                    </p>
                    <p className="text-xs text-gray-400">
                      {update.userName} • {formatRelativeTime(update.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
