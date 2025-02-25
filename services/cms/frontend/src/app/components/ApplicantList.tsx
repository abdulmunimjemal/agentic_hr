import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
} from "@mui/material";
import { PictureAsPdf as PdfIcon } from "@mui/icons-material";
import ScreeningPopup from "./ScreeningPopup";
import InterviewPopup from "./InterviewPopup";

interface Reasoning {
  screening?: string[];
  interview?: string[];
}

interface Applications_list {
  _id?: string; 
  job_id: number;
  name: string;
  cv: string;
  screeningStatus: string;
  interviewStatus: string;
  reasoning?: Reasoning;
}

interface ApplicantsListProps {
  applicants: Applications_list[];
}

const ApplicantsList: React.FC<ApplicantsListProps> = ({ applicants }) => {
  const [selectedApplications_list, setSelectedApplications_list] =
    useState<Applications_list | null>(null);
  const [openScreeningPopup, setOpenScreeningPopup] = useState(false);
  const [openInterviewPopup, setOpenInterviewPopup] = useState(false);

  const handleScreeningClick = (applications_list: Applications_list) => {
    setSelectedApplications_list(applications_list);
    setOpenScreeningPopup(true);
  };

  const handleInterviewClick = (applications_list: Applications_list) => {
    setSelectedApplications_list(applications_list);
    setOpenInterviewPopup(true);
  };

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#364957" }}>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Name
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                CV
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Screening Status
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Interview Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applicants.map((applications_list) => (
              <TableRow
                key={applications_list.job_id}
                sx={{
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
              >
                {/* Name */}
                <TableCell sx={{ color: "#364957" }}>
                  {applications_list.name}
                </TableCell>

                {/* CV Link */}
                <TableCell>
                  <Link
                    href={`/api/sharedfile?file=${applications_list.cv.split("/").pop()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "#FF8A00",
                    }}
                  >
                    <PdfIcon sx={{ marginRight: "8px" }} />
                    View CV
                  </Link>
                </TableCell>

                {/* Screening Status  */}
                <TableCell
                  onClick={() => handleScreeningClick(applications_list)}
                  sx={{
                    color: "#FF8A00",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  {applications_list.screeningStatus}
                </TableCell>

                {/* Interview Status */}
                <TableCell
                  onClick={() => handleInterviewClick(applications_list)}
                  sx={{
                    color: "#FF8A00",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  {applications_list.interviewStatus}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Popups */}
      {selectedApplications_list && (
        <ScreeningPopup
          open={openScreeningPopup}
          onClose={() => setOpenScreeningPopup(false)}
          applications_list={selectedApplications_list}
        />
      )}
      {selectedApplications_list && (
        <InterviewPopup
          open={openInterviewPopup}
          onClose={() => setOpenInterviewPopup(false)}
          applications_list={selectedApplications_list}
        />
      )}
    </>
  );
};

export default ApplicantsList;
