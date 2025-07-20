#!/usr/bin/env node

const https = require('https')
const http = require('http')

const DEPLOYMENT_URL = process.env.DEPLOYMENT_URL || 'https://your-domain.com'

const checks = [
  {
    name: 'Homepage loads',
    url: `${DEPLOYMENT_URL}/coming-soon`,
    expectedStatus: 200,
    timeout: 10000
  },
  {
    name: 'API endpoint works',
    url: `${DEPLOYMENT_URL}/api/waitlist/stats`,
    expectedStatus: 200,
    timeout: 15000
  },
  {
    name: 'Health check endpoint',
    url: `${DEPLOYMENT_URL}/api/health`,
    expectedStatus: 200,
    timeout: 10000
  }
]

async function makeRequest(url, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http
    const timeoutId = setTimeout(() => {
      reject(new Error(`Request timeout after ${timeout}ms`))
    }, timeout)
    
    const req = client.get(url, (res) => {
      clearTimeout(timeoutId)
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data
        })
      })
    })
    
    req.on('error', (err) => {
      clearTimeout(timeoutId)
      reject(err)
    })
  })
}

async function runChecks() {
  console.log(`🚀 Verifying deployment at: ${DEPLOYMENT_URL}`)
  console.log('=' .repeat(50))
  
  let allPassed = true
  
  for (const check of checks) {
    try {
      console.log(`⏳ ${check.name}...`)
      
      const response = await makeRequest(check.url, check.timeout)
      
      if (response.status !== check.expectedStatus) {
        console.log(`❌ ${check.name}: Expected ${check.expectedStatus}, got ${response.status}`)
        allPassed = false
        continue
      }
      
      // Additional checks
      if (check.name === 'API endpoint works') {
        try {
          const data = JSON.parse(response.data)
          if (!data.total || typeof data.total !== 'number') {
            console.log(`❌ ${check.name}: Invalid API response structure`)
            allPassed = false
            continue
          }
        } catch (e) {
          console.log(`❌ ${check.name}: Invalid JSON response`)
          allPassed = false
          continue
        }
      }
      
      console.log(`✅ ${check.name}: Passed`)
      
    } catch (error) {
      console.log(`❌ ${check.name}: ${error.message}`)
      allPassed = false
    }
  }
  
  console.log('=' .repeat(50))
  
  if (allPassed) {
    console.log('🎉 All checks passed! Deployment is healthy.')
    process.exit(0)
  } else {
    console.log('💥 Some checks failed. Please review the deployment.')
    process.exit(1)
  }
}

// Security headers check
async function checkSecurityHeaders() {
  try {
    const response = await makeRequest(`${DEPLOYMENT_URL}/coming-soon`)
    const headers = response.headers
    
    const requiredHeaders = [
      'x-frame-options',
      'x-content-type-options',
      'strict-transport-security'
    ]
    
    const missingHeaders = requiredHeaders.filter(h => !headers[h])
    
    if (missingHeaders.length > 0) {
      console.log(`⚠️  Missing security headers: ${missingHeaders.join(', ')}`)
    } else {
      console.log('🔒 Security headers: OK')
    }
  } catch (error) {
    console.log(`⚠️  Could not verify security headers: ${error.message}`)
  }
}

async function main() {
  await runChecks()
  await checkSecurityHeaders()
}

main().catch(console.error)