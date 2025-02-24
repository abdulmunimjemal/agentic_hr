// src/components/jobs-grid.tsx

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import { getJobs } from '@/actions/get-jobs'
import { ArrowUpRight } from 'lucide-react'

interface Job {
  job_id: number
  title: string
  description: string
  postDate: string
}

export default async function JobsGrid() {
  try {
    const jobs = await getJobs()

    if (!jobs?.length) {
      return (
        <div className="border-2 border-dashed border-primary/20 rounded-xl p-8 text-center">
          <div className="text-2xl text-primary/50 mb-4">🚀</div>
          <h3 className="text-xl font-semibold text-primary mb-2">
            No open positions
          </h3>
          <p className="text-primary/60">
            Check back later or subscribe to job alerts
          </p>
        </div>
      )
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job: Job) => (
          <Link
            key={job.job_id}
            href={`/jobs/${job.job_id}/apply`}
            className="group transition-all"
          >
            <Card className="h-full p-6 border-2 border-transparent group-hover:border-secondary/20 group-hover:shadow-lg transition-all">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className="border-secondary/30 text-secondary">
                      {'Engineering'}
                    </Badge>
                    <span className="text-sm text-primary/60">
                      {'Addis Ababa'}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-2">
                    {job.title}
                  </h3>
                  <p className="text-primary/60 line-clamp-3 mb-4">
                    {job.description}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary/50">
                    Posted {formatDate(job.postDate)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-secondary font-medium">
                    Apply Now
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    )
  } catch (error: any) { // TypeScript: Allow any type
    console.error(error);
  
    return (
      <div className="border-2 border-dashed border-red-100 bg-red-50 rounded-xl p-8 text-center">
        <div className="text-2xl text-red-400 mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-red-600 mb-2">
          Failed to load jobs
        </h3>
        <p className="text-red-500/80">
          {error || JSON.stringify(error) || 'An unknown error occurred'}
        </p>
      </div>
    );
  }  
}