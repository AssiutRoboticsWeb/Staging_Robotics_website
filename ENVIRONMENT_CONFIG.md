# Environment Configuration

This project now supports dynamic API URL configuration based on the environment. The system automatically detects whether you're running in development or production and uses the appropriate API base URL.

## How It Works

### Automatic Environment Detection

The system detects the environment based on:

1. **Hostname**: 
   - `localhost`, `127.0.0.1`, or any hostname containing `local` → Development
   - Any private IP ranges (192.168.x.x, 10.0.x.x, 172.x.x.x) → Development

2. **Protocol**:
   - `file://` protocol → Development

3. **Node.js Environment Variables**:
   - `NODE_ENV=development` or `NODE_ENV=dev` → Development

4. **Default**: Production

### API URLs

- **Development**: `http://localhost:3000/`
- **Production**: `https://assiut-robotics-server.vercel.app/`

## Usage

### Basic Usage

```javascript
// The serverConfig is automatically available globally
const apiUrl = serverConfig.getApiUrl('members/login');
// Results in: http://localhost:3000/members/login (development)
// Or: https://assiut-robotics-server.vercel.app/members/login (production)
```

### Available Methods

```javascript
// Get full API URL for an endpoint
serverConfig.getApiUrl('endpoint/path')

// Check current environment
serverConfig.getEnvironment() // Returns 'development' or 'production'

// Environment checks
serverConfig.isDevelopment() // Returns true/false
serverConfig.isProduction() // Returns true/false

// Get base URL
serverConfig.baseUrl // Returns the current base URL

// Legacy server support
serverConfig.getLegacyBaseUrl() // Returns legacy server URL
serverConfig.getLegacyApiUrl('endpoint') // Returns legacy API URL
```

### Example Implementation

```javascript
// Before (hardcoded)
fetch('https://assiut-robotics-server.vercel.app/members/login', {
    method: 'POST',
    body: JSON.stringify(data)
});

// After (dynamic)
fetch(serverConfig.getApiUrl('members/login'), {
    method: 'POST',
    body: JSON.stringify(data)
});
```

## Setup Requirements

### 1. Include the Configuration Script

Make sure to include the server configuration script in your HTML files:

```html
<script src="../config/server-config.js"></script>
<!-- or -->
<script src="./config/server-config.js"></script>
<!-- or -->
<script src="../../public/config/server-config.js"></script>
```

### 2. Use the Global Variables

The configuration automatically creates these global variables:
- `window.serverConfig` - The main configuration object
- `window.API_BASE_URL` - The base URL (for backward compatibility)

## Testing

You can test the environment configuration by opening `test-env-config.html` in your browser. This will show you:
- Current detected environment
- Configuration details
- Test API URL generation

## Development Setup

### Local Development

1. Start your local server on port 3000
2. Open the project in your browser using `localhost` or `127.0.0.1`
3. The system will automatically use `http://localhost:3000/` for API calls

### Production Deployment

1. Deploy your project to any hosting service
2. The system will automatically use `https://assiut-robotics-server.vercel.app/` for API calls

## Files Updated

The following files have been updated to use the dynamic configuration:

- `public/config/server-config.js` - Main configuration file
- `public/form/views.html` - Updated API calls and added config script
- `draft/Tracks/script.js` - Updated to use dynamic URLs
- `draft/Tracks/admin.js` - Updated to use dynamic URLs
- `draft/Tracks/index.html` - Added config script
- `draft/Tracks/admin.html` - Added config script
- `public/OC_page/OC.js` - Updated API calls
- `public/memberPage/oldMemberPage/script.js` - Updated API calls
- `public/com/main.js` - Updated API calls

## Backward Compatibility

The system maintains backward compatibility with:
- Existing `API_BASE_URL` global variable
- Legacy server URLs for specific endpoints
- All existing API call patterns

## Troubleshooting

### Configuration Not Working

1. Ensure `server-config.js` is included before any scripts that use it
2. Check browser console for any JavaScript errors
3. Verify the file path to `server-config.js` is correct

### Wrong Environment Detected

1. Check the browser's hostname in the address bar
2. For local development, use `localhost` or `127.0.0.1`
3. For production, ensure you're not on a local IP address

### API Calls Failing

1. Verify your local server is running on port 3000 (development)
2. Check that the production server is accessible
3. Ensure the endpoint paths are correct
