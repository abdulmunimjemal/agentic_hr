"use client";

import Sidebar from "@/app/components/Sidebar";
import { CandidatesList } from "@/app/components/CandidatesList";
import { Box, CssBaseline } from "@mui/material";

export default function CandidatesPage() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      <Sidebar />
      <Box sx={{ flexGrow: 1, padding: "16px", marginTop: "32px" }}>
        <CandidatesList />
      </Box>
    </Box>
  );
}
