// Get version from package.json or GitHub environment variables
export const getVersion = (): string => {
  // Debug: Log all available environment variables
  console.log('Version Debug:', {
    REACT_APP_VERSION: process.env.REACT_APP_VERSION,
    REACT_APP_GITHUB_VERSION: process.env.REACT_APP_GITHUB_VERSION,
    REACT_APP_GITHUB_TAG: process.env.REACT_APP_GITHUB_TAG,
    NODE_ENV: process.env.NODE_ENV
  });

  // Check for GitHub tag (for releases) - this should be a proper version like v1.2.3
  if (process.env.REACT_APP_GITHUB_TAG && process.env.REACT_APP_GITHUB_TAG.startsWith('v')) {
    const version = process.env.REACT_APP_GITHUB_TAG.replace('v', '');
    console.log('Using GitHub tag version:', version);
    return version;
  }
  
  // Check for GitHub version (for releases) - should be a proper version, not branch name
  if (process.env.REACT_APP_GITHUB_VERSION && 
      process.env.REACT_APP_GITHUB_VERSION.match(/^\d+\.\d+\.\d+/)) {
    console.log('Using GitHub version:', process.env.REACT_APP_GITHUB_VERSION);
    return process.env.REACT_APP_GITHUB_VERSION;
  }
  
  // Fallback to package.json version
  const fallbackVersion = process.env.REACT_APP_VERSION || '0.0.6';
  console.log('Using fallback version:', fallbackVersion);
  return fallbackVersion;
}; 