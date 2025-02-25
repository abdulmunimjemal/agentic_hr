import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface ScreeningPopupProps {
  open: boolean;
  onClose: () => void;
  applications_list: {
    screeningStatus: string; 
    reasoning?: {
      screening?: string[];  
    };
  };
}

const ScreeningPopup: React.FC<ScreeningPopupProps> = ({
  open,
  onClose,
  applications_list,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Screening Status</DialogTitle>
      <DialogContent>
        <Typography>
          Screening Status: {applications_list?.screeningStatus}
        </Typography>
        <Typography>
          Screening Reasoning:{" "}
          {applications_list?.reasoning?.screening?.join(", ")}
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
          Invite for Interview
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

export default ScreeningPopup;
