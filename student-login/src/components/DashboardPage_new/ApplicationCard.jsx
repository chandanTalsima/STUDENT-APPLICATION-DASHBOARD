import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  Button,
  IconButton,
  Tooltip,
  Divider,
  Grid,
  Link,
  Chip
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SchoolIcon from '@mui/icons-material/School';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';

const ApplicationCard = ({ appNumber, courses, studentId, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [animationDelay] = useState(index * 0.1);
  const redirectCxmaiUrl = `${window.location.origin}/cxm.ai/?ContactId=${studentId}&Role=OCR_new`;
  
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
            onClick={(e) => {
              e.preventDefault();
              window.location.href = redirectCxmaiUrl;
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

export default ApplicationCard;
