import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { getJobs } from "../../services/api";

interface Job {
  job_id: number;  // numeric job ID
  title: string;
}

const JobPostList: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs();
        // Map the server response to the numeric job_id + title
        const mappedJobs = data.map((job: any) => ({
          job_id: job.job_id, // numeric field from your schema
          title: job.title,   // e.g., "Software Engineer"
        }));
        setJobs(mappedJobs);
      } catch (error) {
        setError("Failed to fetch jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleJobClick = (job_id: number) => {
    // Navigate to the Next.js dynamic route pages/jobs/[job_id].tsx
    window.location.href = `/jobs/${job_id}`;
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Paper
      sx={{
        padding: "16px",
        margin: "16px",
        marginTop: "64px",
        borderRadius: "8px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box
        sx={{
          background: "#364957",
          color: "#ffff",
          padding: "16px",
          borderRadius: "8px 8px 0 0",
        }}
      >
        <Typography variant="h5">Open Job Posts</Typography>
      </Box>
      <List>
        {jobs.map((job) => (
          <ListItem
            button
            key={job.job_id}
            onClick={() => handleJobClick(job.job_id)}
            sx={{
              marginBottom: "8px",
              borderRadius: "4px",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              "&:hover": { backgroundColor: "#FF8A00", color: "#fff" },
            }}
          >
            <ListItemText
              primary={job.title}
              // "Ongoing" or job.status if you like
              secondary="Ongoing"
              secondaryTypographyProps={{ color: "#364957" }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default JobPostList;
