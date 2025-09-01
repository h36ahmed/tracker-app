import { Suspense } from "react";
import { ProjectsList } from "@/components/projects-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { calculateHealthStatus } from "@/lib/utils";

async function getProjectStats() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        updates: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    const totalProjects = projects.length;
    let healthyProjects = 0;
    let atRiskProjects = 0;

    projects.forEach((project) => {
      const latestUpdate = project.updates[0];
      const healthStatus = calculateHealthStatus(
        latestUpdate?.createdAt || null,
        latestUpdate?.text,
        latestUpdate?.clientScore,
        latestUpdate?.projectScore
      );

      if (healthStatus === "GREEN") {
        healthyProjects++;
      } else if (healthStatus === "RED") {
        atRiskProjects++;
      }
    });

    return {
      totalProjects,
      healthyProjects,
      atRiskProjects,
    };
  } catch (error) {
    console.error("Failed to fetch project stats:", error);
    // Return fallback values in case of error
    return {
      totalProjects: 0,
      healthyProjects: 0,
      atRiskProjects: 0,
    };
  }
}

export default async function HomePage() {
  const stats = await getProjectStats();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <div className="h-4 w-4 text-muted-foreground">📊</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              Active client projects
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Healthy Projects
            </CardTitle>
            <div className="h-4 w-4 text-muted-foreground">🟢</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.healthyProjects}</div>
            <p className="text-xs text-muted-foreground">
              Updated in last 2 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">🔴</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.atRiskProjects}</div>
            <p className="text-xs text-muted-foreground">
              Need immediate attention
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projects Overview</CardTitle>
          <CardDescription>
            Monitor all client projects and their health status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading projects...</div>}>
            <ProjectsList />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
