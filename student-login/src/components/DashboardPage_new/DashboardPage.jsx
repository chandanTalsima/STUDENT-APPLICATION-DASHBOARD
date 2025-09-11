import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Divider,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import KaplanLogo from "../../assets/university.png";
import Guidelines from "./Guidelines";
import ApplicationCard from "./ApplicationCard.jsx";

const DashboardPage = ({ studentId, applications = [] }) => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Default applications if none provided
  const defaultApplications = [
    {
      appNumber: "TalismaUniversity/02697/Const/2025",
      courses: [
        {
          name: "Master of Science in Computer Science",
          faculty: "Faculty of Science, Fort Lauderdale, Florida, United States",
        },
      ],
    },
    {
      appNumber: "TalismaUniversity/02698/Afft/2025",
      courses: [
        {
          name: "Master of Science in Computer Science",
          faculty: "Faculty of Science, Fort Lauderdale, Florida, United States",
        },
      ],
    },
  ];

  const applicationsToShow = applications.length > 0 ? applications : defaultApplications;

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        p: { xs: 2, md: 3 },
      }}
    >
      <Box
        sx={{
          maxWidth: '1400px',
          margin: '0 auto',
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease-out',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            p: 3,
            mb: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
            <Avatar
              sx={{
                width: 58,
                height: 58,
                background: 'linear-gradient(135deg,rgb(255, 255, 255) 0%,rgb(255, 255, 255) 100%)',
                boxShadow: '0 4px 12px rgba(255, 255, 255, 255)',
              }}
            >
              <img
                src={KaplanLogo}
                alt="Logo"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </Avatar>
            <Box>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                  background: 'linear-gradient(135deg, #1f2937 0%, #4f46e5 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '24px', md: '32px' },
                  letterSpacing: '-0.025em',
                }}
              >
                TALISMA UNIVERSITY
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#6b7280',
                  fontWeight: 500,
                  fontSize: { xs: '16px', md: '18px' },
                }}
              >
              
              </Typography>
            </Box>
            <Tooltip title="Logout">
              <IconButton
                color="primary"
                onClick={() => navigate('/login_new')}
                sx={{
                  bgcolor: 'rgba(99, 102, 241, 0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(99, 102, 241, 0.2)',
                  },
                  transition: 'all 0.2s ease-in-out',
                  ml: 'auto',
                }}
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box
          display="flex"
          flexDirection={{ xs: "column", lg: "row" }}
          gap={3}
        >
          {/* Left - Application Cards */}
          <Box flex={1.5}>
            <Box 
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                p: 3,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                height: { xs: 'auto', lg: 'calc(100vh - 200px)' }, // Set max height on larger screens
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Typography 
                  variant="h5" 
                  fontWeight="bold" 
                  sx={{
                    color: '#111827',
                    fontSize: '24px',
                    letterSpacing: '-0.025em'
                  }}
                >
                  My Applications
                </Typography>
                <Chip 
                  label={`${applicationsToShow.length} Active`}
                  sx={{
                    bgcolor: '#dcfce7',
                    color: '#166534',
                    fontWeight: 600
                  }}
                />
              </Box>

              <Box
                sx={{
                  flex: 1,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  pr: 1,
                  '&::-webkit-scrollbar': {
                    width: '8px'
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'rgba(243, 244, 246, 0.5)',
                    borderRadius: '10px'
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    borderRadius: '10px',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4f46e5, #7c3aed)'
                    }
                  },
                  // Firefox scrollbar styling
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#6366f1 rgba(243, 244, 246, 0.5)'
                }}
              >
                {applicationsToShow.map((application, index) => (
                  <ApplicationCard
                    key={application.appNumber || index}
                    appNumber={application.appNumber}
                    studentId={studentId}
                    index={index}
                    courses={application.courses}
                  />
                ))}
                
                {/* Show message if no applications */}
                {applicationsToShow.length === 0 && (
                  <Box 
                    display="flex" 
                    flexDirection="column" 
                    alignItems="center" 
                    justifyContent="center" 
                    py={6}
                  >
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: '#f3f4f6',
                        color: '#9ca3af',
                        mb: 2
                      }}
                    >
                      📋
                    </Avatar>
                    <Typography variant="h6" color="#6b7280" mb={1}>
                      No Applications Found
                    </Typography>
                    <Typography variant="body2" color="#9ca3af">
                      You haven't submitted any applications yet.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          {/* Right - Guidelines */}
          <Box flex={1}>
            <Box
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 3,
                p: 3,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                height: { xs: 'auto', lg: 'calc(100vh - 200px)' },
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: '#ddd6fe',
                    color: '#7c3aed'
                  }}
                >
                  📋
                </Avatar>
                <Typography 
                  variant="h6" 
                  fontWeight="bold" 
                  sx={{
                    color: '#111827',
                    fontSize: '20px'
                  }}
                >
                  Application Guidelines
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#6b7280', 
                  mb: 2,
                  fontSize: '14px'
                }}
              >
                Follow these steps for a successful application process
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box
                sx={{
                  flex: 1,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  pr: 1,
                  '&::-webkit-scrollbar': {
                    width: '8px'
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'rgba(243, 244, 246, 0.5)',
                    borderRadius: '10px'
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    borderRadius: '10px',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4f46e5, #7c3aed)'
                    }
                  },
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#6366f1 rgba(243, 244, 246, 0.5)'
                }}
              >
                <Guidelines />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;