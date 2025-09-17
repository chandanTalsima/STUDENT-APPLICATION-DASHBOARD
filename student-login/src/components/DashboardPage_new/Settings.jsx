import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import EditIcon from '@mui/icons-material/Edit';
import SchoolIcon from '@mui/icons-material/School';
import { useTheme } from '@mui/material/styles';
import { 
  defaultUniversityConfig, 
  fetchConfig, 
  getAllUniversities 
} from '../../api/universityConfigApi';

const resetToDefaultConfig = () => ({ ...defaultUniversityConfig });

const Settings = ({ open, onClose, config: initialConfig, logo: initialLogo }) => {
  const [config, setConfig] = useState({
    ...defaultUniversityConfig,
    ...initialConfig
  });
  const [logoPreview, setLogoPreview] = useState(initialLogo || '');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [hasBeenCleared, setHasBeenCleared] = useState(false);
  
  const theme = useTheme ? useTheme() : { palette: { divider: '#e0e0e0', primary: { main: '#1976d2' } }, shape: { borderRadius: 4 } };

  useEffect(() => {
    if (initialConfig) {
      setConfig(prev => ({
        ...prev,
        ...initialConfig
      }));
    }
  }, [initialConfig]);

  useEffect(() => {
    if (initialLogo) {
      setLogoPreview(initialLogo);
    }
  }, [initialLogo]);

  const loadUniversities = async () => {
    try {
      setIsLoadingUniversities(true);
      const universities = await getAllUniversities();
      const universitiesList = Object.entries(universities ?? {})?.map(x => ({...x[1],isSelected : x[1].isSelected.toLowerCase() == "true"})) || [];
      setUniversities(universitiesList);
    } catch (error) {
      console.error('Error loading universities:', error);
      showMessage('Failed to load universities', 'error');
    } finally {
      setIsLoadingUniversities(false);
    }
  };

  const handleUniversityChange = async (university) => {
    try {
      setIsLoading(true);
      const { data } = await fetchConfig(university.id || university.universityName || university.name);
      if (data) {
        const universityName = university.universityName || university.name || university;
        const updatedConfig = {
          ...config,
          ...data,
          universityName: universityName,
          id: university.id || data.id
        };
        setConfig(updatedConfig);
        setHasBeenCleared(false);

        if (data.logoPath) {
          const processedLogo = processLogoUrl(data.logoPath);
          setLogoPreview(processedLogo);
        } else if (university.logoUrl) {
          setLogoPreview(university.logoUrl);
        }
      }
    } catch (error) {
      console.error('Error loading university config:', error);
      showMessage(`Failed to load config for ${university.universityName}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const processLogoUrl = (logoPath) => {
    if (!logoPath) return '';
    if (logoPath.startsWith('data:') || logoPath.startsWith('http') || logoPath.startsWith('/')) {
      return logoPath;
    }
    return `${window.location.origin}${logoPath.startsWith('/') ? '' : '/'}${logoPath}`;
  };
  
  const showMessage = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };
  
  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  
  const handleClose = () => {
    const isNewUniversity = !initialConfig || !initialConfig.universityName || 
                          (config.universityName && config.universityName !== initialConfig.universityName);
    
    if (isNewUniversity && config.universityName) {
      showMessage('Please save or clear the university before closing', 'warning');
      return;
    }
    
    if (hasBeenCleared && !config.universityName) {
      showMessage('Please select or add a university before closing', 'warning');
      return;
    }
    
    if (onClose) onClose();
  };

  const loadConfig = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await fetchConfig(config.universityName);
      
      if (data && !error) {
        setConfig(prev => ({
          ...prev,
          ...data,
          universityName: prev.universityName || data.universityName
        }));
        
        if (data.logoPath) {
          const processedLogo = processLogoUrl(data.logoPath);
          setLogoPreview(processedLogo);
        }
      } else if (error) {
        showMessage(`Using default config: ${error}`, 'info');
      }
    } catch (error) {
      console.error('Error loading config:', error);
      showMessage('Failed to load configuration', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'universityName' && value) {
      setHasBeenCleared(false);
    }

    setLogoPreview('');
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (file) => {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
    if (!validImageTypes.includes(file.type)) {
      showMessage('Please select a valid image file (JPEG, PNG, or SVG)', 'error');
      return;
    }

    const maxSize = 5 * 1024 * 1024; 
    if (file.size > maxSize) {
      showMessage('File size should be less than 5MB', 'error');
      return;
    }

    setFile(file);
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
    
    setConfig(prev => ({
      ...prev,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setIsLoading(true);
    
    const isNewUniversity = !initialConfig || !initialConfig.universityName || 
                          (config.universityName !== initialConfig?.universityName);

    if (isNewUniversity) {
      if (!config.universityName || config.universityName.trim() === '') {
        showMessage('Please enter a university name', 'error');
        setIsLoading(false);
        return;
      }
      
      if (!file && !logoPreview) {
        showMessage('Please upload a logo for the new university', 'error');
        setIsLoading(false);
        return;
      }
    } else if (!config.universityName || config.universityName.trim() === '') {
      showMessage('Please enter a university name', 'error');
      setIsLoading(false);
      return;
    }
    
    if (hasBeenCleared && !config.universityName) {
      showMessage('Please select or add a university before saving', 'warning');
      setIsLoading(false);
      return;
    }
    
    const universityNameChanged = config.universityName !== initialConfig?.universityName;
    const hasNewFile = file && file instanceof File;
    
    const payload = {
      UniversityName: config.universityName.trim(),
      isSelected: true,
      hasFileChange: hasNewFile || (isNewUniversity && logoPreview),
      forceApiCall: true, 
      isNewUniversity: isNewUniversity,
      updateOtherUniversities: true
    };

    if (hasNewFile) {
      payload.File = file;
    } else if (isNewUniversity && logoPreview && !hasNewFile) {
      payload.logoPreview = logoPreview;
    }
    
    payload.changes = {
      universityName: universityNameChanged,
      file: hasNewFile,
      logo: logoPreview !== initialLogo
    };
    
    // console.log('Submitting payload:', {
    //   universityName: payload.UniversityName,
    //   hasFile: !!payload.File,
    //   hasFileChange: payload.hasFileChange
    // });
    
    if (onClose) {
      onClose(payload, logoPreview, file, universityNameChanged);
    }


    // try {
    //   const updatedUniversities = await getAllUniversities();
    //   const universitiesList = Object.entries(universities ?? {})?.map(x => ({...x[1],isSelected : x[1].isSelected.toLowerCase() == "true"})) || [];
    //   setUniversities(universitiesList);
 
    //   if (universityNameChanged) {

    //     const newUniversity = updatedUniversities.find(u => 
    //       u.universityName === config.universityName.trim() || 
    //       u.name === config.universityName.trim()
    //     );
        
    //     if (newUniversity) {
    //       setConfig(prev => ({
    //         ...prev,
    //         id: newUniversity.id || prev.id
    //       }));
    //     }
    //   }
    // } catch (error) {
    //   console.error('Error refreshing universities list:', error);
    // }
    
  } catch (error) {
    console.error('Error saving configuration:', error);
    showMessage(`Failed to save configuration: ${error.message}`, 'error');
  } finally {
    setIsLoading(false);
  }
};

  const handleReset = async () => {
    try {
      setIsLoading(true);
      const defaultConfig = resetToDefaultConfig();
      setConfig({ ...defaultConfig });
      setFile(null);
      setLogoPreview('');
      setHasBeenCleared(true);
      showMessage('Please select or add a university to continue', 'info');
    } catch (error) {
      console.error('Error resetting to default:', error);
      showMessage('Failed to reset settings. Using local defaults.', 'error');
      setConfig({ ...defaultUniversityConfig });
      setFile(null);
      setLogoPreview('');
      setHasBeenCleared(true);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (open) {
      loadUniversities();
    }
  }, [open]);

  return (
    <>
      <Dialog 
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            maxHeight: '80vh',
            height: 'auto',
            margin: '8px',
            width: '100%',
            maxWidth: '600px',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }
        }}
      >
        <DialogTitle sx={{ p: 2, pb: 1 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight="bold" color="text.primary">
                University Settings
              </Typography>
            </Box>
            <IconButton 
              onClick={handleClose} 
              size="small" 
              sx={{ 
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ p: 2, pt: 0, overflowY: 'visible' }}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                mb: 3, 
                bgcolor: 'white',
                borderRadius: 2,
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
              }}
            >
              <Box sx={{ mb: 2 }}>
                <Typography 
                  variant="subtitle2" 
                  color="text.primary" 
                  fontWeight={600}
                  gutterBottom
                >
                  University Branding
                </Typography>
                
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        position: 'relative',
                        display: 'inline-block',
                        '&:hover .edit-icon': {
                          opacity: 1
                        }
                      }}
                    >
                      <Box
                        sx={{
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: '50%',
                          width: 120,
                          height: 120,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          backgroundColor: 'background.paper',
                          margin: '0 auto'
                        }}
                      >
                        {logoPreview ? (
                          <img 
                            src={logoPreview} 
                            alt="Logo preview" 
                            style={{ 
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }} 
                          />
                        ) : (
                          <Box 
                            sx={{ 
                              textAlign: 'center',
                              color: 'text.secondary',
                              p: 1
                            }}
                          >
                            <ImageIcon sx={{ fontSize: 48, display: 'block', mx: 'auto' }} />
                            <Typography variant="caption" sx={{ fontSize: '0.65rem', display: 'block' }}>
                              Upload Logo
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      <IconButton 
                        component="label"
                        className="edit-icon"
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          right: 8,
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          padding: '6px',
                          opacity: 0.7,
                          transition: 'all 0.2s',
                          '&:hover': {
                            backgroundColor: 'white',
                            opacity: 1,
                            transform: 'scale(1.1)'
                          }
                        }}
                      >
                        <EditIcon fontSize="small" color="action" />
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handleFileSelect}
                        />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1, mt: 1 }}>
                  <TextField
                    fullWidth
                    label="University Name"
                    name="universityName"
                    value={config.universityName || ''}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    variant="outlined"
                    InputLabelProps={{
                      style: { color: '#6b7280' }
                    }}
                    InputProps={{
                      style: { 
                        color: '#111827',
                        fontWeight: 500,
                        backgroundColor: '#fff',
                        borderRadius: '4px',
                        height: '56px',
                        boxSizing: 'border-box',
                      },
                      endAdornment: (
                        <Typography 
                          variant="caption" 
                          color="textSecondary" 
                          sx={{ 
                            whiteSpace: 'nowrap',
                            mr: 1
                          }}
                        >
                          {config.universityName ? `${config.universityName.length}/30` : '0/30'}
                        </Typography>
                      ),
                    }}
                    FormHelperTextProps={{
                      sx: {
                        textAlign: 'right',
                        margin: 0,
                        mt: 0.5,
                        color: (config.universityName?.length || 0) >= 30 ? 'error.main' : 'text.secondary',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '100%',
                        display: 'block'
                      }
                    }}
                    helperText={config.universityName?.length > 30 ? 
                      config.universityName : 
                      'Enter university name (max 30 characters)'}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.87)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: theme.palette.primary.main,
                        },
                        '& .MuiInputBase-input': {
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }
                      },
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1, mt: 1 }}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="university-select-label" style={{ color: '#6b7280' }}>Select University</InputLabel>
                    <Select
                      labelId="university-select-label"
                      id="university-select"
                      value={config.universityName || ''}
                      onChange={(e) => {
                        const selected = universities.find(u => u.name === e.target.value);
                        if (selected) {
                          handleUniversityChange(selected);
                        }
                      }}
                      label="Select University"
                      disabled={isLoading || isLoadingUniversities}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 48 * 4.5, 
                            width: 250,
                          },
                        },
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: '56px',
                          '& fieldset': {
                            borderColor: 'rgba(0, 0, 0, 0.23)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(0, 0, 0, 0.87)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: theme.palette.primary.main,
                            borderWidth: '1px',
                          },
                        },
                        '& .MuiSelect-select': {
                          padding: '16.5px 14px',
                          color: '#111827',
                          fontWeight: 500,
                        },
                      }}
                    >
                      {isLoadingUniversities ? (
                        <MenuItem value="">
                          <Box display="flex" alignItems="center" width="100%">
                            <CircularProgress size={20} style={{ marginRight: 8 }} />
                            Loading...
                          </Box>
                        </MenuItem>
                      ) : (
                        universities.map((university) => (
                          <MenuItem 
                            key={university.name} 
                            value={university.name}
                            style={{
                              whiteSpace: 'normal',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: '100%',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {university.name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </Paper>
          </DialogContent>
          
          <DialogActions sx={{ px: 3, pb: 3, pt: 0 }}>
            <Button 
              onClick={handleReset}
              variant="outlined"
              color="inherit"
              disabled={isLoading}
              sx={{
                mr: 'auto',
                color: '#6b7280',
                borderColor: '#e5e7eb',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  borderColor: '#d1d5db',
                },
                textTransform: 'none',
                fontWeight: 500,
                px: 2,
                py: 0.75,
                borderRadius: '0.5rem',
              }}
            >
              Clear
            </Button>
            <Button 
              onClick={handleClose}
              variant="outlined"
              color="inherit"
              disabled={isLoading}
              sx={{
                color: '#6b7280',
                borderColor: '#e5e7eb',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  borderColor: '#d1d5db',
                },
                textTransform: 'none',
                fontWeight: 500,
                px: 2,
                py: 0.75,
                borderRadius: '0.5rem',
                mr: 1
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                textTransform: 'none',
                fontWeight: 500,
                px: 3,
                py: 0.75,
                borderRadius: '0.5rem',
                '&:hover': {
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  transform: 'translateY(-1px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
                '&:disabled': {
                  background: '#d1d5db',
                  color: '#6b7280',
                  transform: 'none'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Settings;