import React, { useEffect, useState } from "react";
import ApplicantsList from "../../app/components/ApplicantList";
import Sidebar from "../../app/components/Sidebar";
import { Box, CssBaseline, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { getApplicationsByJobId } from "../../services/api";

const JobApplicantsPage = () => {
  const router = useRouter();
  const { job_id } = router.query;
  const [applications_list, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchApplicants = async () => {
    if (job_id) {
      try {
        const data = await getApplicationsByJobId(job_id as number);
        setApplicants(data);
      } catch (error) {
        setError("Failed to fetch applicants. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
  };

  fetchApplicants();
}, [job_id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      <Sidebar />
      <Box sx={{ flexGrow: 1, padding: "16px" }}>
        <Typography
          variant="h4"
          sx={{ color: "#364957", marginBottom: "16px" }}
        >
          Applicants for Job ID: {job_id}
        </Typography>
        <ApplicantsList applicants={applications_list} />
      </Box>
    </Box>
  );
};

export default JobApplicantsPage;


