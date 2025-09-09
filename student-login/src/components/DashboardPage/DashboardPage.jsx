import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
  Link,
  Grid,
} from "@mui/material";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import KaplanLogo from "../../assets/talismalogo.png";
import Guidelines from "./Guidelines";

const ApplicationCard = ({ appNumber, courses, studentId }) => (
  <Card variant="outlined" sx={{ mb: 3, borderColor: "#240f6e" }}>
    <CardContent>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography variant="subtitle1" fontWeight="bold" color="#240f6e">
          Application No.: {appNumber}
        </Typography>
        <Button
          variant="contained"
          size="small"
          sx={{ backgroundColor: "#240f6e", textTransform: "none" }}
          onClick={() => {
            window.location.href = `https://130518web.saas.talismaonline.com/cxm.ai/?ContactId=${studentId}&Role=OCR`;
          }}
        >
          Edit Application
        </Button>
      </Box>

      <Grid container spacing={2}>
        {courses.map((course, idx) => (
          <Grid item xs={12} sm={6} key={idx}>
            <Typography variant="body1" fontWeight="medium">
              {idx + 1}. {course.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {course.faculty}
            </Typography>
          </Grid>
        ))}
      </Grid>

      <Box mt={2} display="flex" gap={3} alignItems="center">
        <Link
          href="#"
          underline="hover"
          fontSize={14}
          display="flex"
          alignItems="center"
          gap={0.5}
          color="#240f6e"
        >
          <PaymentOutlinedIcon fontSize="small" /> Pay Now
        </Link>

        <Link
          href="#"
          underline="hover"
          fontSize={14}
          display="flex"
          alignItems="center"
          gap={0.5}
          color="#240f6e"
          onClick={() => {
            window.location.href = `https://130518web.saas.talismaonline.com/cxm.ai/?ContactId=${studentId}&Role=OCR`;
          }}
        >
          <FolderOutlinedIcon fontSize="small" /> Manage Documents
        </Link>

        <Link
          href="#"
          underline="hover"
          fontSize={14}
          display="flex"
          alignItems="center"
          gap={0.5}
          color="#240f6e"
        >
          <DownloadOutlinedIcon fontSize="small" /> Download Application
        </Link>
      </Box>
    </CardContent>
  </Card>
);

const DashboardPage = ({ studentId }) => {
  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      p={3}
      gap={3}
    >
      {/* Left - Application Cards */}
      <Box flex={1.5}>
        <Box display="flex" alignItems="center" mb={2}>
          <img
            src={KaplanLogo}
            alt="Kaplan Logo"
            style={{ height: 50, marginRight: 16 }}
          />
          <Typography variant="h5" fontWeight="bold" color="#240f6e">
            CXM University
            Dashboard
          </Typography>
        </Box>

        <ApplicationCard
          appNumber="CXMUniversity/02697/Const/2025"
          studentId={studentId}
          courses={[
            {
              name: "Master of Science in Computer Science",
              faculty:
                "Faculty of Science, Fort Lauderdale, Florida, United States",
            },
          ]}
        />
        <ApplicationCard
          appNumber="CXMUniversity/02698/Afft/2025"
          studentId={studentId}
          courses={[
            {
              name: "Master of Science in Computer Science",
              faculty:
                "Faculty of Science, Fort Lauderdale, Florida, United States",
            },
          ]}
        />
      </Box>

      {/* Right - Guidelines */}
      <Box
        flex={1}
        px={2}
        sx={{ backgroundColor: "#f9f9f9", borderRadius: 2, py: 2 }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom color="#240f6e">
          Guidelines
        </Typography>
        <Divider />
        <Box mt={2}>
          <Guidelines/>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;
