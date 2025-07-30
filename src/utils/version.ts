// Get version from package.json or GitHub environment variables
export const getVersion = (): string => {
  // Check for GitHub environment variables first (for releases)
  if (process.env.REACT_APP_GITHUB_VERSION) {
    return process.env.REACT_APP_GITHUB_VERSION;
  }
  
  // Check for GitHub tag (for releases)
  if (process.env.REACT_APP_GITHUB_TAG) {
    return process.env.REACT_APP_GITHUB_TAG.replace('v', '');
  }
  
  // Fallback to package.json version
  return process.env.REACT_APP_VERSION || '1.0.0';
}; 