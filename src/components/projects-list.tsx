import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { calculateHealthStatus, formatRelativeTime, getDaysSinceUpdate } from '@/lib/utils'
import { ProjectHealth, HealthStatus } from '@/types'

async function getProjectsWithHealth(): Promise<ProjectHealth[]> {
  const projects = await prisma.project.findMany({
    include: {
      updates: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  })

  return projects.map(project => {
    const latestUpdate = project.updates[0]
    const healthStatus = calculateHealthStatus(
      latestUpdate?.createdAt || null,
      latestUpdate?.text
    )
    const daysSinceLastUpdate = getDaysSinceUpdate(latestUpdate?.createdAt || null)

    return {
      ...project,
      latestUpdate,
      healthStatus,
      daysSinceLastUpdate,
    }
  })
}

function getHealthBadgeVariant(status: HealthStatus) {
  switch (status) {
    case 'GREEN':
      return 'success'
    case 'YELLOW':
      return 'warning'
    case 'RED':
      return 'danger'
    default:
      return 'secondary'
  }
}

function getVerticalEmoji(vertical: string) {
  switch (vertical) {
    case 'CRYPTO':
      return '₿'
    case 'APP':
      return '📱'
    case 'COMMERCE':
      return '🛒'
    default:
      return '📊'
  }
}

export async function ProjectsList() {
  const projects = await getProjectsWithHealth()

  if (projects.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No projects found. Add some projects to get started.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Link key={project.id} href={`/projects/${project.id}`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>{getVerticalEmoji(project.vertical)}</span>
                  {project.name}
                </CardTitle>
                <Badge variant={getHealthBadgeVariant(project.healthStatus)}>
                  {project.healthStatus}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  <strong>Vertical:</strong> {project.vertical.toLowerCase()}
                </div>
                {project.latestUpdate ? (
                  <div className="space-y-1">
                    <div className="text-sm">
                      <strong>Last Update:</strong>{' '}
                      {formatRelativeTime(project.latestUpdate.createdAt)}
                    </div>
                    <div className="text-sm text-muted-foreground line-clamp-2">
                      {project.latestUpdate.text}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No updates yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

