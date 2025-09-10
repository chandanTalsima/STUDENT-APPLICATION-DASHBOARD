import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import studentImage from "../../assets/girlphoto.jpg";
import booksImage from "../../assets/books.png";
import university from "../../assets/university.png";

const LoginPageNew = () => {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (studentId.trim()) {
      navigate(`/dashboard_new/${studentId}`);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #e0c3fc, #8ec5fc)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Images */}
      <Box
        component="img"
        src={booksImage}
        alt="Books Left"
        sx={{
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          height: "85%",
          opacity: 0.08,
          zIndex: 0,
        }}
      />
      <Box
        component="img"
        src={booksImage}
        alt="Books Right"
        sx={{
          position: "absolute",
          right: 0,
          top: "50%",
          transform: "translateY(-50%) scaleX(-1)",
          height: "85%",
          opacity: 0.08,
          zIndex: 0,
        }}
      />

      <Paper
        elevation={6}
        sx={{
          display: "flex",
          width: "85%",
          maxWidth: 1000,
          height: '70vh',
          minHeight: 500,
          borderRadius: 5,
          overflow: "hidden",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
          zIndex: 1,
        }}
      >
        {/* Left - Form */}
        <Box
          sx={{
            width: "50%",
            height: '100%',
            p: 4,
            pt: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: '0 12px 12px 0',
          }}
        >
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            mb={4}
          >
            <Box 
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                mb: 2,
                overflow: 'hidden'
              }}
            >
              <img
                src={university}
                alt="University Logo"
                style={{ width: '85%', height: '85%', objectFit: 'contain' }}
              />
            </Box>
            
            <Typography
              variant="h5"
              color="primary"
              fontWeight="bold"
              textAlign="center"
              sx={{ 
                textTransform: 'uppercase',
                letterSpacing: '1px',
                mb: 1
              }}
            >
              Student  Application Portal
            </Typography>
            
          <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
            Welcome Back!
            </Typography>
          </Box>

          <Box sx={{ width: '100%', mb: 4 }}>
            <TextField
              label="Applicant ID"
              fullWidth
              variant="outlined"
              size="small"
              margin="normal"
              value={studentId}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setStudentId(value);
                }
              }}
              inputProps={{ 
                inputMode: "numeric",
                style: { fontSize: '0.9rem' }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#8ec5fc',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#8ec5fc',
                    borderWidth: '1px',
                  },
                },
              }}
            />

            <TextField
              label="Password"
              fullWidth
              variant="outlined"
              size="small"
              margin="normal"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                style: { fontSize: '0.9rem' },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#8ec5fc',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#8ec5fc',
                    borderWidth: '1px',
                  },
                },
              }}
            />
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box display="flex" alignItems="center">
              <input 
                type="checkbox" 
                id="remember" 
                style={{
                  width: '16px',
                  height: '16px',
                  marginRight: '8px',
                  accentColor: '#8ec5fc',
                }}
              />
              <label 
                htmlFor="remember"
                style={{
                  fontSize: '0.85rem',
                  color: 'text.secondary',
                  cursor: 'pointer'
                }}
              >
                Remember me
              </label>
            </Box>
            <Typography
              variant="body2"
              color="primary"
              sx={{ 
                cursor: "pointer",
                fontSize: '0.85rem',
                '&:hover': {
                  textDecoration: 'underline',
                }
              }}
            >
              Forgot Password?
            </Typography>
          </Box>

          <Button
            variant="contained"
            fullWidth
            sx={{
              background: 'linear-gradient(135deg, #8ec5fc 0%, #e0c3fc 100%)',
              color: '#fff',
              fontWeight: 600,
              py: 1.2,
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '0.95rem',
              letterSpacing: '0.5px',
              boxShadow: '0 4px 12px rgba(142, 197, 252, 0.3)',
              '&:hover': { 
                background: 'linear-gradient(135deg, #7ab4ea 0%, #d0b0f0 100%)',
                boxShadow: '0 6px 16px rgba(142, 197, 252, 0.4)',
              },
            }}
            onClick={handleLogin}
          >
            Sign In
          </Button>
        </Box>

        {/* Right - Image */}
        <Box
          sx={{
            width: "30%",
            height: '100%',
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 0,
          }}
        >
          <img
            src={studentImage}
            alt="Login Visual"
            style={{
              height: '100%',
              width: '200%',
              objectFit: 'cover',
              display: 'block',
              boxShadow: '0 10px 10px rgba(255, 255, 255, 1)'
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPageNew;
