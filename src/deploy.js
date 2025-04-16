
#!/usr/bin/env node

// GitHub Pages deployment script
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

console.log(`${colors.cyan}${colors.bright}🦖 DinoTradez GitHub Pages Deployment${colors.reset}`);
console.log(`${colors.cyan}=====================================${colors.reset}\n`);

try {
  // Build the project with production settings
  console.log(`${colors.blue}📦 Building project...${colors.reset}`);
  execSync('npm run build', { stdio: 'inherit', env: { ...process.env, NODE_ENV: 'production' } });
  console.log(`${colors.green}✅ Build completed successfully!${colors.reset}`);

  // Verify the build output exists
  const distPath = path.join(__dirname, 'dist');
  if (!fs.existsSync(distPath)) {
    throw new Error('dist directory not found! Build may have failed silently.');
  }

  const indexPath = path.join(distPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    throw new Error('index.html not found in dist folder! Build output is incomplete.');
  }

  // Create .nojekyll file (needed for GitHub Pages)
  console.log(`\n${colors.blue}📄 Creating .nojekyll file...${colors.reset}`);
  fs.writeFileSync(path.join(distPath, '.nojekyll'), '');
  console.log(`${colors.green}✅ .nojekyll file created!${colors.reset}`);

  // Create CNAME file for custom domain
  console.log(`\n${colors.blue}📄 Creating CNAME file for custom domain...${colors.reset}`);
  fs.writeFileSync(path.join(distPath, 'CNAME'), 'dinotradez.com');
  console.log(`${colors.green}✅ CNAME file created for dinotradez.com!${colors.reset}`);

  // Create 404.html for SPA routing
  console.log(`\n${colors.blue}📄 Creating 404.html file...${colors.reset}`);
  fs.copyFileSync(indexPath, path.join(distPath, '404.html'));
  console.log(`${colors.green}✅ 404.html file created!${colors.reset}`);

  // Add cache busting timestamp
  const timestamp = Date.now();
  console.log(`\n${colors.blue}🔄 Adding cache busting timestamp...${colors.reset}`);
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  const updatedIndexContent = indexContent.replace('</head>', 
    `<meta name="build-timestamp" content="${timestamp}" />\n</head>`);
  fs.writeFileSync(indexPath, updatedIndexContent);
  console.log(`${colors.green}✅ Cache busting timestamp added!${colors.reset}`);

  // Create a deployment timestamp file
  console.log(`\n${colors.blue}📄 Creating deployment timestamp file...${colors.reset}`);
  fs.writeFileSync(path.join(distPath, 'deploy-timestamp.txt'), `Deployed on: ${new Date().toISOString()} with timestamp: ${timestamp}`);
  console.log(`${colors.green}✅ Timestamp file created!${colors.reset}`);

  // Create a deployment status page
  console.log(`\n${colors.blue}📄 Creating deployment status page...${colors.reset}`);
  const statusPage = `
<!DOCTYPE html>
<html>
<head>
  <title>DinoTradez Deployment Status</title>
  <meta name="deployment-id" content="${timestamp}">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Expires" content="0" />
  <style>
    body {
      background-color: #000000;
      color: #ffffff;
      font-family: 'Inter', sans-serif;
      margin: 0;
      padding: 20px;
      text-align: center;
    }
    .status {
      background-color: #0f172a;
      border-radius: 8px;
      padding: 20px;
      margin: 20px auto;
      max-width: 600px;
    }
    .timestamp {
      color: #3b82f6;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <h1>🦖 DinoTradez Deployment Status</h1>
  <div class="status">
    <h2>Deployment Active</h2>
    <p>This page confirms that your deployment is active.</p>
    <p>Deployment Timestamp: <span class="timestamp">${timestamp}</span></p>
    <p>Deployment Time: <span class="timestamp">${new Date().toISOString()}</span></p>
    <p><a href="./" style="color: #3b82f6;">Return to DinoTradez App</a></p>
  </div>
</body>
</html>
  `;
  fs.writeFileSync(path.join(distPath, 'deployment-status.html'), statusPage);
  console.log(`${colors.green}✅ Deployment status page created!${colors.reset}`);

  // Deploy to GitHub Pages with force flag
  console.log(`\n${colors.blue}🚀 Deploying to GitHub Pages...${colors.reset}`);
  console.log(`${colors.yellow}This may take a few minutes...${colors.reset}`);
  
  // Use --no-history to create a fresh history and force option to overwrite existing gh-pages branch
  execSync('npx gh-pages -d dist --no-history --dotfiles', { stdio: 'inherit' });
  console.log(`${colors.green}✅ Deployment submitted successfully!${colors.reset}`);

  console.log(`\n${colors.cyan}${colors.bright}Deployment Information:${colors.reset}`);
  console.log(`${colors.yellow}• Deployment timestamp: ${timestamp}${colors.reset}`);
  console.log(`${colors.yellow}• Your site should be available at:${colors.reset}`);
  console.log(`  ${colors.bright}https://dinotradez.com/${colors.reset}`);
  
  console.log(`\n${colors.yellow}⚠️ Important Notes:${colors.reset}`);
  console.log(`${colors.yellow}• GitHub Pages deployment typically takes 1-5 minutes to process${colors.reset}`);
  console.log(`${colors.yellow}• DNS propagation for your custom domain may take up to 24-48 hours${colors.reset}`);
  console.log(`${colors.yellow}• You can check deployment status in the GitHub repository's Actions tab${colors.reset}`);
  console.log(`${colors.yellow}• To verify the deployment, wait a few minutes and then visit:${colors.reset}`);
  console.log(`  ${colors.bright}https://dinotradez.com/deployment-status.html${colors.reset}`);
  console.log(`  If you see the timestamp "${timestamp}", your deployment is live${colors.reset}`);
  
  // Force cache busting by adding a query parameter to the URL
  console.log(`\n${colors.yellow}• To bypass browser caching, use this URL:${colors.reset}`);
  console.log(`  ${colors.bright}https://dinotradez.com/?t=${timestamp}${colors.reset}`);
  
  // Provide a function to check deployment status
  console.log(`\n${colors.blue}Checking deployment status...${colors.reset}`);
  console.log(`${colors.yellow}Will check again in 60 seconds...${colors.reset}`);
  
  // Set a timeout to check the deployment after 60 seconds
  setTimeout(() => {
    checkDeploymentStatus(`https://dinotradez.com/deploy-timestamp.txt`, timestamp);
  }, 60000);

} catch (error) {
  console.error(`\n${colors.red}❌ Error during deployment:${colors.reset}`, error);
  process.exit(1);
}

// Function to check if deployment is live
function checkDeploymentStatus(url, expectedTimestamp) {
  https.get(url, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (data.includes(expectedTimestamp.toString())) {
        console.log(`\n${colors.green}✅ Deployment confirmed live!${colors.reset}`);
        console.log(`${colors.green}Your site is now available at:${colors.reset}`);
        console.log(`${colors.bright}https://dinotradez.com/${colors.reset}`);
      } else {
        console.log(`\n${colors.yellow}⚠️ Deployment not yet detected or cache not updated.${colors.reset}`);
        console.log(`${colors.yellow}This is normal - GitHub Pages deployments can take up to 10 minutes.${colors.reset}`);
        console.log(`${colors.yellow}DNS propagation for custom domains can take 24-48 hours.${colors.reset}`);
        console.log(`${colors.yellow}Try visiting your site in incognito mode or after clearing cache:${colors.reset}`);
        console.log(`${colors.bright}https://dinotradez.com/${colors.reset}`);
        console.log(`${colors.bright}https://dinotradez.com/?t=${Date.now()}${colors.reset}`);
      }
    });
  }).on('error', (err) => {
    console.log(`\n${colors.yellow}⚠️ Could not verify deployment:${colors.reset}`, err.message);
    console.log(`${colors.yellow}GitHub Pages may still be processing your deployment.${colors.reset}`);
    console.log(`${colors.yellow}DNS propagation for your custom domain may take 24-48 hours.${colors.reset}`);
    console.log(`${colors.yellow}Check again in a few minutes at:${colors.reset}`);
    console.log(`${colors.bright}https://dinotradez.com/${colors.reset}`);
  });
}
