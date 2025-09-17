const API_BASE_URL = 'https://130518web.saas.talismaonline.com/cxmai/api/copilotresponses';

const createFormData = (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  return formData;
};

export const defaultUniversityConfig = {
  universityName: '',
  applicationName: '',
  logoPath: '',
  theme: {
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
    accentColor: '#ec4899'
  }
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

    if (fileOrConfig instanceof File) {
      if (!universityName) {
        throw new Error('University name is required for file upload');
      }
      formData.append('file', fileOrConfig);
      formData.append('UniversityName', universityName);
    } else if (typeof fileOrConfig === 'object' && fileOrConfig !== null) {
      
      if (fileOrConfig.UniversityName) {
        formData.append('UniversityName', fileOrConfig.UniversityName);
      }
      const isSelected = Boolean(fileOrConfig.isSelected !== undefined ? fileOrConfig.isSelected : true);
      formData.append('isSelected', isSelected);
      
      
      if (fileOrConfig.File) {
        formData.append('file', fileOrConfig.File);
      }
      
     
      Object.entries(fileOrConfig).forEach(([key, value]) => {
        if (value !== undefined && value !== null && key !== 'File' && key !== 'UniversityName' && key !== 'isSelected') {
          formData.append(key, value);
        }
      });
      
    
      if (fileOrConfig.File) {
        if (!fileOrConfig.UniversityName) {
          throw new Error('University name is required when including a file');
        }
      }
    } else {
      return {
        data: null,
        error: 'Invalid parameters. Expected File or config object.'
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

    
    // if (fileOrConfig instanceof File && fileOrConfig.type.startsWith('image/') && !data.logoData) {
    //   const logoData = await new Promise((resolve) => {
    //     const reader = new FileReader();
    //     reader.onloadend = () => resolve(reader.result.split(',')[1]);
    //     reader.readAsDataURL(fileOrConfig);
    //   });
    //   data.logoData = logoData;
    // }

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
          logoPath: universityData.logoUrl || ''
        }, 
        error: null 
      };
    }

    const firstUniversityKey = Object.keys(data)[0];
    const firstUniversity = data[firstUniversityKey];
    
    return { 
      data: {
        ...firstUniversity,
        universityName: firstUniversity.name || firstUniversityKey,
        logoPath: firstUniversity.logoUrl || ''
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
 * Fetches the first available university from the API
 * @returns {Promise<string|null>} 
 */
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
    

    const universities = [];

    Object.entries(data).forEach(([id, uniData]) => {
      try {
        if (uniData && typeof uniData === 'object' && uniData.name) {
          console.log(`Adding university: ${uniData.name}`);
          universities.push({
            id: id,
            universityName: uniData.name,
            logoUrl: uniData.logoUrl || '',
            isSelected: uniData.isSelected === 'true' || uniData.isSelected === true
          });
        } else {
          console.log('Skipping invalid university data:', { id, uniData });
        }
      } catch (error) {
        console.error('Error processing university:', id, error);
      }
    });
    
    console.log(`Found ${universities.length} universities`);
    
    if (universities.length === 0) {
      console.log('No universities found, returning default');
      return [{
        id: 'default',
        universityName: defaultUniversityConfig.universityName,
        logoUrl: defaultUniversityConfig.logoPath
      }];
    }
    
    return universities;
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