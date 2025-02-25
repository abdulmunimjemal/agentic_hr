import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface InterviewPopupProps {
  open: boolean;
  onClose: () => void;
  applications_list: {
    interviewStatus: string; 
    reasoning?: {
      interview?: string[];  
    };
  };
}

const InterviewPopup: React.FC<InterviewPopupProps> = ({
  open,
  onClose,
  applications_list,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Interview Status</DialogTitle>
      <DialogContent>
        <Typography>
          Interview Status: {applications_list?.interviewStatus}
        </Typography>
        <Typography>
          Interview Reasoning:{" "}
          {applications_list?.reasoning?.interview?.join(", ")}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}
        >
          Close
        </Button>
        <Button
          color="primary"
          sx={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}
        >
          Admit Candidate
        </Button>
        <Button
          color="secondary"
          sx={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}
        >
          Reject
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InterviewPopup;
