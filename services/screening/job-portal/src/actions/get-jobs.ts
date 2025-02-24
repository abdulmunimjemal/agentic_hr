import getConfig from 'next/config'
import Image from 'next/image'
 
// Only holds serverRuntimeConfig and publicRuntimeConfig
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()
const BASE_API_URL = serverRuntimeConfig.BASE_API_URL


type Job = {
  job_id: number;
  title: string;
  description: string;
  postDate: string; // Assuming it's an ISO date string
};

export async function getJobs(): Promise<Job[]> {
  const res = await fetch(`${BASE_API_URL}/jobs`);
  const jobs: any[] = await res.json(); // Explicitly typed as `any[]` to avoid implicit `any` errors

  return jobs.map((job) => ({
    job_id: job.job_id, 
    title: job.title,  
    description: job.description, 
    postDate: job.postDate, // Include `postDate`
  }));
}

export async function getJob(jobId: number): Promise<Job> {
  const res = await fetch(`${BASE_API_URL}/jobs/${jobId}`);
  const job: any = await res.json(); // Explicitly typed as `any` to avoid implicit `any` errors

  // check response
  if (!res.ok) {
    throw new Error(`Failed to fetch job with ID: ${jobId}`);
  }

  return {
    job_id: job.job_id, 
    title: job.title,  
    description: job.description, 
    postDate: job.postDate, // Include `postDate`
  };
}
