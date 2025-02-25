import React from "react";
import Sidebar from "../app/components/Sidebar";
import JobPostList from "../app/components/JobPostList";
import { Box, CssBaseline, Container } from "@mui/material";

const Dashboard = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Sidebar />
      <Container>
        <JobPostList />
      </Container>
    </Box>
  );
};

export default Dashboard;
