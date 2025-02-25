// services/api.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';

// Fetch all jobs
export const getJobs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/jobs`);
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

// Fetch all candidates
export const getCandidates = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/candidates`);
    return response.data;
  } catch (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }
};

// Fetch all applications
export const getApplications = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/applications`);
    return response.data;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};

// Fetch applications for a specific job
export const getApplicationsByJobId = async (jobId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/applications_list/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching applications by job ID:', error);
    throw error;
  }
};
