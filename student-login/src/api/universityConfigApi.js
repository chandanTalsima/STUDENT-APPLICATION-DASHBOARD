const API_BASE_URL = 'https://130518web.saas.talismaonline.com/cxmai/api/copilotresponses';

export const defaultUniversityConfig = {
  File: '',
  universityName: '',
  isSelected: false, // Default to false, will be set when selected
  logoPath: ''
};

/**
 * Uploads a new configuration or updates an existing one
 * @param {File|Object} fileOrConfig - Either a File object for logo upload or a config object
 * @param {string} [universityName] - Required when file is provided
 * @returns {Promise<Object>} 
 */
export const uploadConfig = async (fileOrConfig, universityName) => {
  try {
    const formData = new FormData();
    let endpoint = `${API_BASE_URL}/uploadOCRDashboardConfig`;
    let hasFile = false;

    if (fileOrConfig instanceof File) {
      if (!universityName) {
        throw new Error('University name is required for file upload');
      }
      // Ensure the order: File, UniversityName, isSelected
      formData.append('File', fileOrConfig);
      formData.append('UniversityName', universityName);
      // Only set isSelected: true if explicitly provided
      const shouldSelect = fileOrConfig?.isSelected ?? false;
      formData.append('isSelected', String(shouldSelect));
      hasFile = true;
    } else if (typeof fileOrConfig === 'object' && fileOrConfig !== null) {
      
      // Ensure UniversityName is provided and not empty
      if (!fileOrConfig.UniversityName || fileOrConfig.UniversityName.trim() === '') {
        throw new Error('University name is required');
      }
      
      // Ensure the order: File, UniversityName, isSelected
      
      // Handle file upload properly - add File first
      if (fileOrConfig.File && fileOrConfig.File instanceof File) {
        formData.append('File', fileOrConfig.File);
        hasFile = true;
      } else if (fileOrConfig.File && typeof fileOrConfig.File === 'string' && fileOrConfig.File.startsWith('data:')) {
        try {
          const response = await fetch(fileOrConfig.File);
          const blob = await response.blob();
          formData.append('File', blob, 'logo.png');
          hasFile = true;
        } catch (error) {
          console.warn('Failed to convert base64 to blob:', error);
        }
      }
      
      // Add UniversityName
      formData.append('UniversityName', fileOrConfig.UniversityName.trim());
      
      // Add isSelected with proper type handling
      // Default to false if not specified
      const isSelected = fileOrConfig.isSelected !== undefined ? 
        (typeof fileOrConfig.isSelected === 'string' ? 
          fileOrConfig.isSelected === 'true' : 
          Boolean(fileOrConfig.isSelected)
        ) : false;
      formData.append('isSelected', String(isSelected));
      
      // Add other fields (excluding already processed ones)
      Object.entries(fileOrConfig).forEach(([key, value]) => {
        if (value !== undefined && value !== null && 
            !['File', 'UniversityName', 'isSelected', 'hasFileChange', 'updateOtherUniversities'].includes(key)) {
          formData.append(key, value);
        }
      });
      
      // Add hasFileChange flag if present
      if (fileOrConfig.hasFileChange !== undefined) {
        formData.append('hasFileChange', String(fileOrConfig.hasFileChange));
      }
      
      // Add updateOtherUniversities flag if present
      if (fileOrConfig.updateOtherUniversities !== undefined) {
        formData.append('updateOtherUniversities', String(fileOrConfig.updateOtherUniversities));
      }
      
      // If no file is being uploaded and we're just updating university info,
      // we can skip the API call that requires a file and just return success
      if (!hasFile && fileOrConfig.skipFileUpload) {
        console.log('Skipping file upload - only updating university info locally');
        return { 
          data: { 
            success: true, 
            message: 'University info updated locally',
            universityName: fileOrConfig.UniversityName.trim()
          }, 
          error: null 
        };
      }
    } else {
      return {
        data: null,
        error: 'Invalid parameters. Expected File or config object.'
      };
    }

    // If we reach here and there's no file, but the API requires it, 
    // return an error explaining the limitation
    if (!hasFile) {
      return {
        data: null,
        error: 'API requires both file and university name. To update only university name, use skipFileUpload option.'
      };
    }

    console.log('Sending request to:', endpoint);
    const options = {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors' 
    };

    if (window.location.origin === new URL(endpoint).origin) {
      options.credentials = 'include';
    } else {
      options.credentials = 'same-origin';
    }

    let response;
    try {
      response = await fetch(endpoint, options);
      console.log('Response status:', response.status, response.statusText);
    } catch (networkError) {
      console.error('Network error during fetch:', networkError);
      if (networkError.name === 'TypeError' && networkError.message.includes('Failed to fetch')) {
        throw new Error('Network error: Could not connect to the server. Please check your internet connection and try again.');
      }
      throw networkError;
    }

    let data;
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        console.log('API Response:', JSON.stringify(data, null, 2));
      } else {
        const textResponse = await response.text();
        console.error('Non-JSON response received:', textResponse);
        throw new Error(`Expected JSON response, got: ${contentType || 'unknown'}`);
      }
    } catch (jsonError) {
      console.error('Error parsing response:', jsonError);
      const textResponse = await response.text();
      console.error('Raw response:', textResponse);
      throw new Error(`Error processing server response: ${jsonError.message}`);
    }

    if (!response.ok || !data.success) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });
      throw new Error(data.message || `Failed to process configuration: ${response.status} ${response.statusText}`);
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error processing configuration:', error);
    return { 
      data: null, 
      error: error.message || 'Failed to process configuration' 
    };
  }
};

/**
 * Fetches the configuration for a university
 * @param {string} universityId 
 * @returns {Promise<Object>} 
 */
export const fetchConfig = async (universityId) => {
  try {
    console.log('Fetching config for university ID:', universityId);
    
    const response = await fetch(`${API_BASE_URL}/GetOCRDashboardConfig`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch configuration: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();

    if (universityId && universityId !== 'default') {
      console.log('Looking for university with ID:', universityId);
      const universityData = data[universityId];
      
      if (!universityData) {
        throw new Error(`University with ID ${universityId} not found`);
      }
      
      console.log('Found university config:', universityData);
      return { 
        data: {
          ...universityData,
          universityName: universityData.name || universityId,
          logoPath: universityData.logoUrl || '',
          isSelected: universityData.isSelected === true || universityData.isSelected.toLowerCase() === 'true'
        }, 
        error: null 
      };
    }

    // Return default config with isSelected set to false when no specific university is requested
    return { 
      data: { 
        ...defaultUniversityConfig,
        isSelected: false 
      }, 
      error: null 
    };
    
  } catch (error) {
    console.error('Error in fetchConfig:', error);
    return { 
      data: null, 
      error: error.message || 'Failed to fetch configuration' 
    };
  }
};

/**
 * Fetches all available universities from the API
 * @returns {Promise<Array<{universityName: string, id: string, logoUrl: string}>>}
 */
export const getAllUniversities = async () => {
  try {
    console.log('Fetching universities from:', `${API_BASE_URL}/GetOCRDashboardConfig`);
    const response = await fetch(`${API_BASE_URL}/GetOCRDashboardConfig`);
    if (!response.ok) {
      throw new Error(`Failed to fetch university configuration: ${response.status} ${response.statusText}`);
    }
    
    const responseText = await response.text();
    console.log('Raw API response start:', responseText.substring(0, 200) + '...');

    const data = JSON.parse(responseText);
    console.log('Parsed data type:', typeof data, 'Total keys:', Object.keys(data).length);
    
    //const universities = [];
    // let latestUniversity = null;
    // let latestTimestamp = 0;

    // First pass: collect all universities and find the selected one
    // const universityEntries = Object.entries(data);
    // let selectedUniversity = null;
    
    // universityEntries.forEach(([id, uniData]) => {
    //   try {
    //     if (uniData && typeof uniData === 'object' && uniData.name) {
    //       // Check if this university is marked as selected in the API response
    //       const isSelected = uniData.isSelected === true || uniData.isSelected.toLowerCase() === 'true';
          
    //       if (isSelected) {
    //         selectedUniversity = { id, ...uniData };
    //       }
          
    //       // Keep track of the most recent university as fallback
    //       const timestamp = uniData.lastModified ? new Date(uniData.lastModified).getTime() : 0;
    //       if (timestamp > latestTimestamp) {
    //         latestTimestamp = timestamp;
    //         latestUniversity = { id, ...uniData };
    //       }
    //     }
    //   } catch (error) {
    //     console.error('Error processing university:', id, error);
    //   }
    // });

    // // If no university is explicitly selected, use the most recent one
    // if (!selectedUniversity && latestUniversity) {
    //   selectedUniversity = latestUniversity;
    // }

    // // Second pass: create university objects with proper selection state
    // universityEntries.forEach(([id, uniData]) => {
    //   try {
    //     if (uniData && typeof uniData === 'object' && uniData.name) {
    //       // Check if this is the selected university
    //       const isSelected = selectedUniversity ? id === selectedUniversity.id : false;
    //       console.log(`Adding university: ${uniData.name}${isSelected ? ' (selected)' : ''}`);
          
    //       universities.push({
    //         id: id,
    //         universityName: uniData.name,
    //         logoUrl: uniData.logoUrl || '',
    //         isSelected: isSelected,
    //         lastModified: uniData.lastModified
    //       });
    //     } else {
    //       console.log('Skipping invalid university data:', { id, uniData });
    //     }
    //   } catch (error) {
    //     console.error('Error processing university:', id, error);
    //   }
    // });
    
    //console.log(`Found ${universities.length} universities`);
    
    // if (universities.length === 0) {
    //   console.log('No universities found, returning default');
    //   return [{
    //     id: 'default',
    //     universityName: defaultUniversityConfig.universityName,
    //     logoUrl: defaultUniversityConfig.logoPath,
    //     isSelected: false
    //   }];
    // }
    
    return data;
  } catch (error) {
    console.error('Error fetching universities:', error);
    return [];
  }
};

/**
 * Gets the first available university from the API
 * @returns {Promise<{universityName: string, id: string, logoUrl: string}|null>}
 */
export const getFirstAvailableUniversity = async () => {
  try {
    const universities = await getAllUniversities();
    if (universities.length > 0) {
      return {
        id: universities[0].id,
        universityName: universities[0].universityName,
        logoUrl: universities[0].logoUrl,
        isSelected: universities[0].isSelected || false
      };
    }

    return {
      id: 'default',
      universityName: defaultUniversityConfig.universityName,
      logoUrl: defaultUniversityConfig.logoPath,
      isSelected: false
    };
  } catch (error) {
    console.error('Error getting first university:', error);
    return {
      id: 'default',
      universityName: defaultUniversityConfig.universityName,
      logoUrl: defaultUniversityConfig.logoPath,
      isSelected: false
    };
  }
};

/**
 * @returns {Object}
 */
export const getDefaultConfig = () => {
  return { ...defaultUniversityConfig };
};