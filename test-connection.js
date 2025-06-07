import 'dotenv/config';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

async function testConnection() {
  try {
    const propertyId = process.env.GA_PROPERTY_ID;
    console.log('Environment check:');
    console.log('GA_PROPERTY_ID:', propertyId);
    console.log('GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

    if (!propertyId) {
      throw new Error('GA_PROPERTY_ID is not set in the environment variables.');
    }

    const analyticsDataClient = new BetaAnalyticsDataClient();
    
    // Simplified request with just one metric
    const request = {
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      metrics: [{ name: 'sessions' }]
    };

    console.log('\nRequest format:');
    console.log(JSON.stringify(request, null, 2));

    console.log('\nAttempting to fetch data...');
    const [response] = await analyticsDataClient.runReport(request);

    console.log('\nGoogle Analytics connection successful!');
    console.log('Report data for the last 7 days:');
    console.log(JSON.stringify(response, null, 2));
  } catch (error) {
    console.error('\nGoogle Analytics connection failed:');
    console.error('Error details:', error.message);
    if (error.details) {
      console.error('Additional details:', error.details);
    }
    if (error.code) {
      console.error('Error code:', error.code);
    }
    process.exit(1);
  }
}

testConnection(); 