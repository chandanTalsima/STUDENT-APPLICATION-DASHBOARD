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
      const universitiesList = await getAllUniversities();
      
      console.log('Universities loaded:', universitiesList.map(u => ({
        name: u.universityName || u.name,
        isSelected: u.isSelected
      })));
      
      setUniversities(universitiesList);
      
      // If there's a selected university, use it
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
  }, []);

  const handleUniversityChange = useCallback(async (university) => {
    if (!university) {
      console.error('No university provided to handleUniversityChange');
      return;
    }
    
    const uniName = university.universityName || university.name || university;
    console.log('University changed to:', uniName);
    
    try {
      setIsLoadingUniversities(true);
      
      let universityId = university.id;
      if (!universityId && (university.universityName || university.name)) {
        const found = universities.find(u => 
          u.universityName === (university.universityName || university.name) || 
          u.name === (university.universityName || university.name)
        );
        if (found) {
          universityId = found.id;
        }
      }
      
      if (!universityId) {
        console.warn(`Could not find ID for university: ${uniName}`);
        return;
      }
      
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
        
        console.log('Successfully updated university to:', newUniversityName);
      }
    } catch (error) {
      console.error('Error in handleUniversityChange:', error);
    } finally {
      setIsLoadingUniversities(false);
    }
  }, [universities, currentConfig, processLogoUrl]);

  const handleSettingsClose = useCallback(async (updatedConfig, logoUrl, file = null, isUniversityChange = false) => {
    setOpenSettings(false);
    
    if (!updatedConfig) return;

    try {
      setIsLoading(true);
      
      // The config from Settings should already be in the correct format
      const configToSave = {
        UniversityName: updatedConfig.UniversityName || currentConfig.universityName,
        isSelected: true, // Always set isSelected to true when saving
        ...(updatedConfig.File && { File: updatedConfig.File }) // Use File from updatedConfig if it exists
      };
      
      try {
        console.log('Saving configuration with file:', !!configToSave.File);
        const { data: configSaved, error: saveError } = await updateUniversityConfig(configToSave);
        
        if (saveError) {
          console.error('Config save failed, but continuing with local update:', saveError);
        } else {
          console.log('Configuration saved successfully');
          
          // Update logo if we have a new one from the response or from the file upload
          if (configSaved?.logoPath) {
            const processedLogo = processLogoUrl(configSaved.logoPath);
            if (processedLogo) {
              setUniversityLogo(processedLogo);
              logoUrl = processedLogo;
            }
          } else if (logoUrl) {
            // If we have a logo URL from the settings but no file was uploaded, use it directly
            setUniversityLogo(logoUrl);
          }
        }
        
        // Update university name if changed
        const newUniversityName = updatedConfig.UniversityName || currentConfig.universityName;
        if (newUniversityName && newUniversityName !== universityName) {
          console.log('Updating university name to:', newUniversityName);
          setUniversityName(newUniversityName);
          
          // Update current config
          setCurrentConfig(prev => ({
            ...prev,
            universityName: newUniversityName,
            isSelected: true
          }));
        }
      } catch (apiError) {
        console.error('API call failed, continuing with local update:', apiError);
      }
      
      const updatedUniversityName = updatedConfig.UniversityName || currentConfig.universityName;
      
      const finalConfig = {
        ...currentConfig,
        ...updatedConfig,
        universityName: updatedUniversityName,
        isSelected: true, // Ensure isSelected is always true
        id: updatedConfig.id || currentConfig.id
      };
      
      setCurrentConfig(finalConfig);
      setUniversityName(updatedUniversityName);

      let finalLogoUrl = '';
      if (logoUrl) {
        // If we have a logo URL (either from file upload or existing), use it
        finalLogoUrl = logoUrl;
      } else if (updatedConfig.logoPath) {
        finalLogoUrl = processLogoUrl(updatedConfig.logoPath);
      } else if (finalConfig.logoPath) {
        finalLogoUrl = processLogoUrl(finalConfig.logoPath);
      }
      
      if (finalLogoUrl && finalLogoUrl !== universityLogo) {
        console.log('Final logo update to:', finalLogoUrl);
        setUniversityLogo(finalLogoUrl);
      }

      try {
        await loadUniversities();
        console.log('Successfully reloaded universities list');
      } catch (error) {
        console.error('Failed to reload universities, but configuration was updated locally:', error);
      }
      
      console.log('University configuration update completed successfully');
      
    } catch (error) {
      console.error('Error in handleSettingsClose:', error);
      if (updatedConfig.universityName) {
        setUniversityName(updatedConfig.universityName);
        setCurrentConfig(prev => ({
          ...prev,
          ...updatedConfig
        }));
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentConfig, processLogoUrl, loadUniversities, universityLogo, universityName]);

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
          // Find the selected university
          const selectedUni = universitiesList.find(u => u.isSelected);
          
          if (selectedUni) {
            console.log('Found selected university:', selectedUni.universityName || selectedUni.name);
            
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
            console.log('No university is selected');
            // If no university is selected, don't set a default one
            setUniversityName('University');
            setUniversityLogo('');
          }
        } else {
          console.log('No universities found');
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
    if (currentConfig.logoPath) {
      const processedLogo = processLogoUrl(currentConfig.logoPath);
      if (processedLogo !== universityLogo) {
        setUniversityLogo(processedLogo);
      }
    }
  }, [currentConfig.logoPath, processLogoUrl, universityLogo]);

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
        />
      </Box>
    </Box>
  );
};

export default DashboardPage;