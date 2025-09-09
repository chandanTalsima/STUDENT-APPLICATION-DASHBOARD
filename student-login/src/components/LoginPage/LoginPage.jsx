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
import studentImage from "../../assets/imagegirl.png";
import booksImage from "../../assets/books.png";
import KaplanLogo from "../../assets/talismalogo.png";

const LoginPage = () => {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (studentId.trim()) {
      navigate(`/dashboard/${studentId}`);
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
          maxHeight: "90vh",
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
            p: 5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: "#ffffff",
          }}
        >
          <Box display="flex" justifyContent="center" mb={3}>
            <img
              src={KaplanLogo}
              alt="Kaplan Logo"
              style={{ maxHeight: 60, objectFit: "contain" }}
            />
          </Box>

          <Typography
            variant="h4"
            color="secondary"
            fontWeight="bold"
            mb={1}
            sx={{ whiteSpace: "nowrap" }}
          >
            Student Application Portal
          </Typography>

          <Typography variant="body1" gutterBottom>
            Welcome!
          </Typography>
          <Typography variant="h4" fontWeight="bold" mb={3}>
            Log In
          </Typography>

          <TextField
            label="Applicant ID"
            fullWidth
            variant="outlined"
            margin="normal"
            value={studentId}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                setStudentId(value);
              }
            }}
            inputProps={{ inputMode: "numeric" }}
          />

          <TextField
            label="Password"
            fullWidth
            variant="outlined"
            margin="normal"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: "pointer" }}
            >
              Forgot Password?
            </Typography>
          </Box>

          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#d088b6",
              color: "#fff",
              fontWeight: "bold",
              py: 1.4,
              borderRadius: 3,
              "&:hover": { backgroundColor: "#b26ca0" },
            }}
            onClick={handleLogin}
          >
            LOGIN →
          </Button>
        </Box>

        {/* Right - Image */}
        <Box
          sx={{
            width: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 4,
          }}
        >
          <img
            src={studentImage}
            alt="Login Visual"
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
