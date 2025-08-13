// Test script for company registration flow
const baseUrl = 'https://8465c230-7f79-4824-855a-9cabe89a7383-00-3aklzfh6u39se.spock.replit.dev';

async function testRegistrationFlow() {
  console.log('=== TESTING COMPANY REGISTRATION FLOW ===\n');
  
  const testEmail = `test${Date.now()}@example.com`;
  const testPassword = 'Test123!@#';
  
  // Step 1: Initialize session
  console.log('1. Initializing session...');
  const initResponse = await fetch(`${baseUrl}/api/company/init-session`, {
    credentials: 'include'
  });
  const initData = await initResponse.json();
  console.log('Session initialized:', initData.sessionId);
  
  // Step 2: Submit company background (Section 1)
  console.log('\n2. Submitting company background...');
  const backgroundResponse = await fetch(`${baseUrl}/api/company/request-access`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      firstName: 'Test',
      lastName: 'User',
      companyName: 'Test Company ' + Date.now(),
      primaryIndustry: 'Technology',
      organizationSize: '1000-5000'
    })
  });
  
  if (!backgroundResponse.ok) {
    const error = await backgroundResponse.text();
    console.error('Background submission failed:', error);
    return;
  }
  
  const backgroundData = await backgroundResponse.json();
  console.log('Company created with ID:', backgroundData.companyId);
  console.log('Access code:', backgroundData.accessCode);
  
  // Step 3: Complete survey (Sections 2-4)
  console.log('\n3. Completing survey sections 2-4...');
  const surveyResponse = await fetch(`${baseUrl}/api/company/complete-survey`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      companyId: backgroundData.companyId,
      email: testEmail,
      password: testPassword,
      expectedParticipants: '100',
      primaryRoles: ['Full-stack development (end-to-end features)'],
      participatingTeams: ['Engineering', 'Data Science'],
      teamOrganization: ['Junior', 'Senior', 'Lead'],
      accessibleTools: ['ChatGPT', 'GitHub Copilot'],
      adoptionRating: 'on-par',
      promotionStart: '6-12-months',
      primaryMotivations: ['Efficiency and productivity improvements'],
      initiatives: ['Dedicated training programs'],
      barriers: ['Security concerns'],
      successMeasures: ['Code quality metrics']
    })
  });
  
  if (!surveyResponse.ok) {
    const error = await surveyResponse.text();
    console.error('Survey completion failed:', error);
    return;
  }
  
  const surveyData = await surveyResponse.json();
  console.log('Survey completed successfully');
  console.log('Final access code:', surveyData.accessCode);
  
  // Step 4: Check dashboard access
  console.log('\n4. Checking dashboard access...');
  const dashboardResponse = await fetch(`${baseUrl}/api/company/dashboard`, {
    credentials: 'include'
  });
  
  if (!dashboardResponse.ok) {
    const error = await dashboardResponse.text();
    console.error('Dashboard access failed:', error);
    console.log('\n❌ TEST FAILED: Session not persisting to dashboard');
    return;
  }
  
  const dashboardData = await dashboardResponse.json();
  console.log('Dashboard accessed successfully!');
  console.log('Company email:', dashboardData.company.email);
  console.log('Stats:', dashboardData.stats);
  
  console.log('\n✅ TEST PASSED: Registration flow works correctly!');
}

// Run the test
testRegistrationFlow().catch(console.error);