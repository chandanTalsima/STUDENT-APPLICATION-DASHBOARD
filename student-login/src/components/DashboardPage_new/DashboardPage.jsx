import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
 Box,
  Typography,
  Divider,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Snackbar, 
  Alert, 
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import Guidelines from "./Guidelines";
import ApplicationCard from "./ApplicationCard.jsx";
import Settings from "./Settings";
import { 
  getAllUniversities, 
  defaultUniversityConfig, 
  fetchConfig, 
  uploadConfig as updateUniversityConfig 
} from "../../api/universityConfigApi";

const DashboardPage = ({ studentId, applications = [] }) => {
  const navigate = useNavigate();
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [currentConfig, setCurrentConfig] = useState({ ...defaultUniversityConfig });
  const [universityName, setUniversityName] = useState(defaultUniversityConfig.universityName || 'University');
  const [universityLogo, setUniversityLogo] = useState('');
  const [snackbar, setSnackbar] = useState({
  open: false,
  message: '',
  severity: 'success'
});
  const defaultApplications = useMemo(() => [
    {
      courses: [
        {
          name: "Master of Science in Computer Science",
          faculty: "Faculty of Science, Fort Lauderdale, Florida, United States",
        },
      ],
    },
    {
      courses: [
        {
          name: "Master of Science in Computer Science",
          faculty: "Faculty of Science, Fort Lauderdale, Florida, United States",
        },
      ],
    },
  ], []);

  const [applicationsToShow, setApplicationsToShow] = useState(defaultApplications);
  const processLogoUrl = useCallback((logoPath) => {
    if (!logoPath) return '';
    if (logoPath.startsWith('data:') || logoPath.startsWith('http') || logoPath.startsWith('/')) {
      return logoPath;
    }
    return `${window.location.origin}${logoPath.startsWith('/') ? '' : '/'}${logoPath}`;
  }, []);

  const loadConfigFromAPI = useCallback(async (univName) => {
    try {
      const nameToUse = univName || universityName;
      const { data: config, error } = await fetchConfig(nameToUse);
      
      if (error) {
        console.error('Error loading config:', error);
        return null;
      }
      
      if (config) {
        const updatedConfig = {
          ...currentConfig,
          ...config,
          universityName: config.universityName || nameToUse,
          logoPath: config.logoPath || currentConfig.logoPath
        };
        
        return updatedConfig;
      }
      return null;
    } catch (error) {
      console.error('Error in loadConfigFromAPI:', error);
      return null;
    }
  }, [currentConfig, universityName]);

  const loadUniversities = useCallback(async () => {
    try {
      setIsLoadingUniversities(true);
      const universities = await getAllUniversities();

      const universitiesList =  Object.entries(universities ?? {})?.map(x => ({...x[1],isSelected : x[1].isSelected.toLowerCase() == "true"})) || [];
      
      setUniversities(universitiesList);
      const selectedUniversity = universitiesList.find(u => u.isSelected);
      if (selectedUniversity && !universityName) {
        setUniversityName(selectedUniversity.universityName || selectedUniversity.name);
      }
      
      return universitiesList;
    } catch (error) {
      console.error('Error loading universities:', error);
      return [];
    } finally {
      setIsLoadingUniversities(false);
    }
  }, [universityName]);

  const handleUniversityChange = useCallback(async (university) => {
    if (!university) {
      console.error('No university provided to handleUniversityChange');
      return;
    }
    
    const uniName = university.universityName || university.name || university;
    
    try {
      setIsLoadingUniversities(true);
      
      const selectedUniversity = universities.find(u => 
        u.universityName === uniName || u.name === uniName || u.id === university.id
      );
      
      if (!selectedUniversity) {
        console.warn(`Could not find university: ${uniName}`);
        return;
      }
      
      const universityId = selectedUniversity.id;
      
      const updatePromises = universities.map(async (uni) => {
        const shouldBeSelected = uni.id === universityId;
        
        if (uni.isSelected !== shouldBeSelected) {
          try {
            const response = await fetch(`${API_BASE_URL}/updateUniversitySelection`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                universityId: uni.id,
                isSelected: shouldBeSelected
              })
            });
            
            if (!response.ok) {
              throw new Error(`Failed to update university ${uni.id}`);
            }
            
            return {
              ...uni,
              isSelected: shouldBeSelected
            };
          } catch (error) {
            console.error(`Error updating university ${uni.id}:`, error);
            return uni; 
          }
        }
        return uni; 
      });
  
      const updatedUniversities = await Promise.all(updatePromises);
      setUniversities(updatedUniversities);
  
      setUniversityName(uniName);
      
      const { data: config, error } = await fetchConfig(universityId);
      
      if (error) {
        console.error(`Failed to load config: ${error.message}`);
        return;
      }
      
      if (config) {
        const newUniversityName = config.universityName || uniName;
        
        const updatedConfig = {
          ...currentConfig,
          ...config,
          universityName: newUniversityName,
          logoPath: config.logoPath || university.logoUrl || currentConfig.logoPath
        };
        
        setCurrentConfig(updatedConfig);
        setUniversityName(newUniversityName);
        
        const newLogo = config.logoPath || university.logoUrl;
        if (newLogo) {
          const processedLogo = processLogoUrl(newLogo);
          setUniversityLogo(processedLogo);
        }

      }
    } catch (error) {
      console.error('Error in handleUniversityChange:', error);
    } finally {
      setIsLoadingUniversities(false);
    }
  }, [universities, currentConfig, processLogoUrl]);


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


const handleSettingsClose = useCallback(async (updatedConfig, logoUrl, file = null, isUniversityChange = false) => {
  setOpenSettings(false);
  
  if (!updatedConfig) return;

  try {
    setIsLoading(true);

    if (!updatedConfig.UniversityName || updatedConfig.UniversityName.trim() === '') {
      setIsLoading(false);
      return;
    }
    
    const newUniversityName = updatedConfig.UniversityName.trim();
    let shouldCallAPI = false;
    let configToSave = null;

    if (updatedConfig.hasFileChange) {
      shouldCallAPI = true;
      configToSave = {
        UniversityName: newUniversityName,
        isSelected: true,
        File: updatedConfig.File
      };
    } else if (updatedConfig.skipFileUpload) {
      shouldCallAPI = false;
    }

    if (shouldCallAPI && configToSave) {
      try {
        const { data: configSaved, error: saveError } = await updateUniversityConfig(configToSave);
        
        if (saveError) {
          console.error('Config save failed:', saveError);
        } else {
          
          if (configSaved?.logoPath) {
            const processedLogo = processLogoUrl(configSaved.logoPath);
            if (processedLogo) {
              setUniversityLogo(processedLogo);
              logoUrl = processedLogo;
            }
          }
        }
      } catch (apiError) {
        console.error('API call failed:', apiError);
        showMessage(`API call failed: ${apiError.message}. Changes saved.`, 'warning');
      }
    } else {
      showMessage('University name updated', 'success');
    }
    if (newUniversityName !== universityName) {
      setUniversityName(newUniversityName);
      
      setCurrentConfig(prev => ({
        ...prev,
        universityName: newUniversityName,
        isSelected: true
      }));
    }
    
    if (logoUrl) {
      setUniversityLogo(logoUrl);
    } else if (file && file instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUniversityLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
    
    const finalConfig = {
      ...currentConfig,
      universityName: newUniversityName,
      isSelected: true,
      id: updatedConfig.id || currentConfig.id
    };
    
    setCurrentConfig(finalConfig);

    try {
      await loadUniversities();
    } catch (error) {
      console.error('Failed to reload universities, but configuration was updated :', error);
    }
    
    
  } catch (error) {
    console.error('Error in handleSettingsClose:', error);
    showMessage(`Error updating configuration: ${error.message}`, 'error');
  } finally {
    setIsLoading(false);
  }
}, [currentConfig, processLogoUrl, loadUniversities, universityLogo, universityName, updateUniversityConfig]);

  useEffect(() => {
    const initialize = async () => {
      try {
        const universitiesList = await loadUniversities();
        if (applications.length > 0) {
          setApplicationsToShow(applications);
        } else {
          setApplicationsToShow(defaultApplications);
        }
        
        if (universitiesList.length > 0) {
          const selectedUni = universitiesList.find(u => u.isSelected);
          
          if (selectedUni) {
            
            const config = await loadConfigFromAPI(selectedUni.universityName || selectedUni.name);
            if (config && config.universityName) {
              setCurrentConfig(config);
              setUniversityName(config.universityName);
              
              const processedLogo = processLogoUrl(config.logoPath);
              setUniversityLogo(processedLogo);
            } else {
              setUniversityName(selectedUni.universityName || selectedUni.name || 'University');
              if (selectedUni.logoUrl) {
                setUniversityLogo(selectedUni.logoUrl);
              }
            }
          } else {
            setUniversityName('University');
            setUniversityLogo('');
          }
        } else {
          setUniversityName('University');
          setUniversityLogo('');
        }
      } catch (error) {
        console.error('Error initializing dashboard:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    if (!isLoaded) {
      initialize();
    }
  }, [isLoaded, applications, defaultApplications, loadUniversities, loadConfigFromAPI, processLogoUrl]);

  useEffect(() => {
    if (currentConfig?.logoPath) {
      const processedLogo = processLogoUrl(currentConfig?.logoPath);
      if (processedLogo !== universityLogo) {
        setUniversityLogo(processedLogo);
      }
    }
  }, [currentConfig?.logoPath, processLogoUrl, universityLogo]);
  
  useEffect(() => {
    if(openSettings)
    {
      setCurrentConfig(universities?.find(u => u.isSelected) || defaultUniversityConfig)
    }
  },[openSettings])

  console.log("initial config",currentConfig);

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
          <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
            <Box display="flex" alignItems="center" gap={1.5}>
              <Avatar
                src={universityLogo}
                alt={universityName}
                onError={(e) => {
                  console.error('Error loading logo:', universityLogo);
                  e.target.style.display = 'none';
                }}
                sx={{ 
                  width: 48, 
                  height: 48, 
                  border: '2px solid #fff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
              <Box>
                <Typography 
                  variant="h4"
                  sx={{
                    background: 'linear-gradient(135deg, #4a5ed3 0%, #5a2d8a 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: { xs: '24px', sm: '30px', md: '36px' },
                    fontWeight: 800,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    lineHeight: 1.1,
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    margin: '4px 0',
                    display: 'inline-block'
                  }}
                >
                  {universityName}
                </Typography>
              </Box>
            </Box>
            
            <Box display="flex" alignItems="center" ml="auto" gap={1}>
              <Tooltip title="Settings">
                <IconButton
                  color="primary"
                  onClick={() => setOpenSettings(true)}
                  disabled={isLoading}
                  sx={{
                    bgcolor: 'rgba(99, 102, 241, 0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(99, 102, 241, 0.2)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
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
                  }}
                >
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        <Box
          display="flex"
          flexDirection={{ xs: "column", lg: "row" }}
          gap={3}
        >
          {/* Left - Applications */}
          <Box flex={1.5}>
            <Box 
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                p: 3,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                height: { xs: 'auto', lg: 'calc(100vh - 200px)' }, 
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
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#6366f1 rgba(243, 244, 246, 0.5)'
                }}
              >
                {applicationsToShow.map((application, index) => {
                  const uniqueKey = `${application.appNumber || 'app'}-${index}-${currentConfig.universityName}`;
                  return (
                    <ApplicationCard
                      key={uniqueKey}
                      appNumber={application.appNumber}
                      studentId={studentId}
                      index={index}
                      courses={application.courses}
                    />
                  );
                })}
                
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
        
        <Settings 
          open={openSettings} 
          onClose={handleSettingsClose}
          config={currentConfig}
          logo={universityLogo}
          loading={isLoading}
          universities={universities}
          onUniversityChange={handleUniversityChange}
          setinitialConfig = {setCurrentConfig}
        />
      </Box>
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
    </Box>
  );
};

export default DashboardPage;