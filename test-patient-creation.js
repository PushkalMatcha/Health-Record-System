// Test script to debug patient creation
const fetch = require('node-fetch');

async function testPatientCreation() {
  try {
    // First, let's login to get a token
    console.log('1. Logging in...');
    const loginResponse = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@svds.org',
        password: 'admin123'
      })
    });

    if (!loginResponse.ok) {
      const error = await loginResponse.text();
      console.error('Login failed:', error);
      return;
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('Login successful, token:', token.substring(0, 20) + '...');

    // Now test patient creation
    console.log('2. Creating patient...');
    const patientData = {
      firstName: 'Test',
      lastName: 'Patient',
      email: 'test.patient@patient.local',
      password: 'defaultPassword123',
      dateOfBirth: new Date(new Date().getFullYear() - 25, 0, 1).toISOString(),
      address: 'Test Village, Andhra Pradesh',
      phone: '+91 98765 43210',
      emergencyContact: {
        name: 'Emergency Contact',
        phone: '+91 98765 43210'
      },
      medicalHistory: {
        gender: 'Male',
        bloodGroup: 'O+',
        chronicConditions: [],
        allergies: [],
        priority: 'Medium',
        notes: 'Test patient',
        currentMedications: ''
      }
    };

    console.log('Patient data:', JSON.stringify(patientData, null, 2));

    const patientResponse = await fetch('http://localhost:4000/api/patients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(patientData)
    });

    console.log('Response status:', patientResponse.status);
    const responseText = await patientResponse.text();
    console.log('Response body:', responseText);

    if (patientResponse.ok) {
      console.log('✅ Patient created successfully!');
    } else {
      console.log('❌ Patient creation failed');
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testPatientCreation();
