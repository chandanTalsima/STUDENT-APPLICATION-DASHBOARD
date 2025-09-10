import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
  Link,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SchoolIcon from "@mui/icons-material/School";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LogoutIcon from "@mui/icons-material/Logout";
import KaplanLogo from "../../assets/university.png";
// Guidelines component modified to remove internal scrolling
const Guidelines = () => {
  const [activeStep, setActiveStep] = React.useState(null);

  const steps = [
    {
      id: 1,
      title: "Choose Program & Intake",
      icon: "🎯",
      description: "Select your desired program and intake term",
      items: ["Select Program Type, Field of Study, Intake Term", "Click Continue"]
    },
    {
      id: 2,
      title: "Personal Information",
      icon: "👤",
      description: "Provide your personal details",
      items: ["Enter DOB, Gender, Nationality", "ID Proof Number, Address, Emergency Contact"]
    },
    {
      id: 3,
      title: "Academic History",
      icon: "🎓",
      description: "Add your educational background",
      items: ["List prior institutions, degrees, graduation year", "Upload transcripts (PDF)"]
    },
    {
      id: 4,
      title: "Test Scores",
      icon: "📊",
      description: "Submit standardized test results",
      items: ["Enter test scores (SAT, GRE, etc.)", "Upload score reports"],
      optional: true
    },
    {
      id: 5,
      title: "Statement of Purpose",
      icon: "📝",
      description: "Share your motivation and goals",
      items: ["Upload or paste a 500-word SOP outlining goals and reason for choosing Global University"]
    },
    {
      id: 6,
      title: "Letters of Recommendation",
      icon: "📋",
      description: "Get recommendations from mentors",
      items: ["Enter recommender info", "Upload letters or send requests"]
    },
    {
      id: 7,
      title: "Application Fee",
      icon: "💳",
      description: "Complete payment process",
      items: ["Pay fee online and receive confirmation"]
    },
    {
      id: 8,
      title: "Review & Submit",
      icon: "✅",
      description: "Final review before submission",
      items: ["Review entered info", "Accept declaration", "Click Submit"]
    }
  ];

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '8px'
    }}>
      {steps.map((step, index) => {
        const isActive = activeStep === step.id;
        const isLast = index === steps.length - 1;
        
        return (
          <div key={step.id} style={{ position: 'relative' }}>
            {!isLast && (
              <div style={{
                position: 'absolute',
                left: '19px',
                top: '50px',
                width: '2px',
                height: '60px',
                background: 'linear-gradient(to bottom, #e5e7eb, #f3f4f6)',
                zIndex: 0
              }}></div>
            )}

            <div
              onClick={() => setActiveStep(isActive ? null : step.id)}
              style={{
                background: isActive ? 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' : '#ffffff',
                border: `1px solid ${isActive ? '#3b82f6' : '#e5e7eb'}`,
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                zIndex: 1,
                boxShadow: isActive 
                  ? '0 4px 12px rgba(59, 130, 246, 0.15)' 
                  : '0 1px 3px rgba(0, 0, 0, 0.05)',
                transform: isActive ? 'translateX(4px)' : 'translateX(0)'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  minWidth: '40px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: isActive 
                      ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
                      : 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? '0 4px 8px rgba(59, 130, 246, 0.3)' : 'none'
                  }}>
                    {isActive ? '✓' : step.icon}
                  </div>
                  {step.optional && (
                    <span style={{
                      fontSize: '10px',
                      background: '#fef3c7',
                      color: '#92400e',
                      padding: '2px 6px',
                      borderRadius: '8px',
                      fontWeight: '600'
                    }}>
                      Optional
                    </span>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '4px'
                  }}>
                    <h4 style={{
                      margin: 0,
                      fontSize: '16px',
                      fontWeight: '600',
                      color: isActive ? '#1d4ed8' : '#111827'
                    }}>
                      {step.title}
                    </h4>
                    <svg
                      style={{
                        width: '16px',
                        height: '16px',
                        color: '#6b7280',
                        transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease'
                      }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  <p style={{
                    margin: '0 0 8px 0',
                    fontSize: '14px',
                    color: '#6b7280',
                    lineHeight: '1.4'
                  }}>
                    {step.description}
                  </p>

                  <div style={{
                    maxHeight: isActive ? '200px' : '0',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{ paddingTop: '8px' }}>
                      {step.items.map((item, idx) => (
                        <div key={idx} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                          marginBottom: '6px',
                          fontSize: '13px',
                          color: '#374151'
                        }}>
                          <div style={{
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            background: '#3b82f6',
                            marginTop: '6px',
                            flexShrink: 0
                          }}></div>
                          <span dangerouslySetInnerHTML={{
                            __html: item.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #1d4ed8;">$1</strong>')
                          }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div style={{
        background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
        border: '1px solid #a7f3d0',
        borderRadius: '12px',
        padding: '16px',
        textAlign: 'center',
        marginTop: '8px'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          color: '#065f46',
          fontWeight: '600'
        }}>
          <span style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '12px'
          }}>
            ✓
          </span>
          Complete all steps for successful application
        </div>
      </div>
    </div>
  );
};

const ApplicationCard = ({ appNumber, courses, studentId, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [animationDelay] = useState(index * 0.1);
    const redirectCxmaiUrl = `${location.origin}/cxm.ai/?ContactId=${studentId}&Role=OCR_new`;
  return (
    <Card
      variant="outlined"
      sx={{
        mb: 3,
        borderRadius: 3,
        border: '2px solid #e5e7eb',
        position: 'relative',
        overflow: 'visible',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        animation: `slideInUp 0.6s ease-out ${animationDelay}s both`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)',
          borderRadius: '12px 12px 0 0',
        },
        '@keyframes slideInUp': {
          '0%': {
            opacity: 0,
            transform: 'translateY(30px)'
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0)'
          }
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Avatar 
                sx={{ 
                  width: 24, 
                  height: 24, 
                  bgcolor: '#6366f1', 
                  fontSize: '12px' 
                }}
              >
                {index + 1}
              </Avatar>
              <Typography 
                variant="body2" 
                color="#6b7280"
                sx={{ fontWeight: 600 }}
              >
                Application No.
              </Typography>
            </Box>
            <Typography 
              variant="h6" 
              fontWeight="bold" 
              color="#111827"
              sx={{ 
                fontSize: '16px',
                letterSpacing: '-0.025em'
              }}
            >
              {appNumber}
            </Typography>
          </Box>
          
          <Box display="flex" gap={1}>
            <Tooltip title="Edit Application">
              <Button
                variant="contained"
                size="small"
                startIcon={<EditOutlinedIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  textTransform: "none",
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    boxShadow: '0 6px 16px rgba(99, 102, 241, 0.5)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease'
                }}
                onClick={() => {
                  window.location.href = redirectCxmaiUrl;
                }}
              >
                Edit
              </Button>
            </Tooltip>
            <IconButton
              size="small"
              sx={{ 
                color: '#6b7280',
                '&:hover': { 
                  bgcolor: '#f3f4f6',
                  color: '#374151'
                }
              }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ my: 2, opacity: 0.6 }} />

        <Grid container spacing={2}>
          {courses.map((course, idx) => (
            <Grid item xs={12} key={idx}>
              <Box 
                sx={{
                  p: 2,
                  bgcolor: '#f8fafc',
                  borderRadius: 2,
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: '#f1f5f9',
                    borderColor: '#cbd5e1'
                  }
                }}
              >
                <Box display="flex" alignItems="flex-start" gap={1.5}>
                  <Avatar 
                    sx={{ 
                      bgcolor: '#ddd6fe', 
                      color: '#7c3aed',
                      width: 40,
                      height: 40
                    }}
                  >
                    <SchoolIcon fontSize="small" />
                  </Avatar>
                  <Box flex={1}>
                    <Typography 
                      variant="body1" 
                      fontWeight="600"
                      color="#111827"
                      sx={{ mb: 0.5, lineHeight: 1.4 }}
                    >
                      {course.name}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                      <LocationOnIcon 
                        fontSize="small" 
                        sx={{ color: '#6b7280', fontSize: 16 }} 
                      />
                      <Typography 
                        variant="body2" 
                        color="#6b7280"
                        sx={{ fontSize: '13px' }}
                      >
                        {course.faculty}
                      </Typography>
                    </Box>
                    <Chip 
                      label="In Progress" 
                      size="small"
                      sx={{
                        bgcolor: '#fef3c7',
                        color: '#92400e',
                        fontSize: '11px',
                        height: 24,
                        fontWeight: 600
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 2.5, opacity: 0.6 }} />

        <Box display="flex" gap={3} flexWrap="wrap">
          <Link
            href="#"
            underline="none"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: '#6366f1',
              fontSize: '14px',
              fontWeight: 600,
              px: 2,
              py: 1,
              borderRadius: 1.5,
              bgcolor: '#f0f9ff',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: '#e0f2fe',
                transform: 'translateY(-1px)',
                color: '#4f46e5'
              }
            }}
          >
            <PaymentOutlinedIcon fontSize="small" />
            Pay Now
          </Link>

          <Link
            href="#"
            underline="none"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: '#059669',
              fontSize: '14px',
              fontWeight: 600,
              px: 2,
              py: 1,
              borderRadius: 1.5,
              bgcolor: '#ecfdf5',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: '#d1fae5',
                transform: 'translateY(-1px)',
                color: '#047857'
              }
            }}
            onClick={() => {
              window.location.href = `${location.origin}/cxm.ai/?ContactId=${studentId}&Role=OCR_new`;
            }}
          >
            <FolderOutlinedIcon fontSize="small" />
            Documents
          </Link>

          <Link
            href="#"
            underline="none"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: '#dc2626',
              fontSize: '14px',
              fontWeight: 600,
              px: 2,
              py: 1,
              borderRadius: 1.5,
              bgcolor: '#fef2f2',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: '#fee2e2',
                transform: 'translateY(-1px)',
                color: '#b91c1c'
              }
            }}
          >
            <DownloadOutlinedIcon fontSize="small" />
            Download
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
};

const DashboardPage = ({ studentId, applications = [] }) => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Default applications if none provided
  const defaultApplications = [
    {
      appNumber: "GlobalUniversity/02697/Const/2025",
      courses: [
        {
          name: "Master of Science in Computer Science",
          faculty: "Faculty of Science, Fort Lauderdale, Florida, United States",
        },
      ],
    },
    {
      appNumber: "GlobalUniversity/02698/Afft/2025",
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
                Global University
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

              {/* Scrollable Applications Container */}
              <Box
                sx={{
                  flex: 1,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  pr: 1, // Add some padding for scrollbar
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
                bgcolor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                p: 3,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                height: { xs: 'auto', lg: 'calc(100vh - 200px)' }, // Match the height of applications container
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
                  pr: 1, // Add some padding for scrollbar
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