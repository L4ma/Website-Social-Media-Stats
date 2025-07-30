// Get version from package.json or GitHub environment variables
export const getVersion = (): string => {
  // Check for GitHub tag (for releases) - this should be a proper version like v1.2.3
  if (process.env.REACT_APP_GITHUB_TAG && process.env.REACT_APP_GITHUB_TAG.startsWith('v')) {
    return process.env.REACT_APP_GITHUB_TAG.replace('v', '');
  }
  
  // Check for GitHub version (for releases) - should be a proper version, not branch name
  if (process.env.REACT_APP_GITHUB_VERSION && 
      process.env.REACT_APP_GITHUB_VERSION.match(/^\d+\.\d+\.\d+/)) {
    return process.env.REACT_APP_GITHUB_VERSION;
  }
  
  // Fallback to package.json version
  return process.env.REACT_APP_VERSION || '1.0.0';
}; 