import { MCPServer } from '@modelcontextprotocol/sdk';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import dotenv from 'dotenv';

dotenv.config();

// Log environment variables (excluding sensitive data)
console.log('Environment check:');
console.log('GA_PROPERTY_ID:', process.env.GA_PROPERTY_ID);
console.log('GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
});

const server = new MCPServer({
  tools: {
    query_analytics: async ({ propertyId, dateRange, metrics, dimensions }) => {
      const request = {
        property: `properties/${propertyId}`,
        dateRanges: [dateRange],
        metrics: metrics.map(metric => ({ name: metric })),
        dimensions: dimensions.map(dimension => ({ name: dimension })),
      };
      console.log('query_analytics request:', JSON.stringify(request, null, 2));
      const [response] = await analyticsDataClient.runReport(request);
      return response;
    },

    get_realtime_data: async ({ propertyId, dimensions }) => {
      const request = {
        property: `properties/${propertyId}`,
        dimensions: dimensions.map(dimension => ({ name: dimension })),
        metrics: [{ name: 'activeUsers' }],
      };
      console.log('get_realtime_data request:', JSON.stringify(request, null, 2));
      const [response] = await analyticsDataClient.runRealtimeReport(request);
      return response;
    },

    get_traffic_sources: async ({ propertyId, dateRange }) => {
      const request = {
        property: `properties/${propertyId}`,
        dateRanges: [dateRange],
        dimensions: [{ name: 'source' }, { name: 'medium' }],
        metrics: [
          { name: 'sessions' },
          { name: 'users' },
          { name: 'newUsers' },
        ],
      };
      console.log('get_traffic_sources request:', JSON.stringify(request, null, 2));
      const [response] = await analyticsDataClient.runReport(request);
      return response;
    },

    get_user_demographics: async ({ propertyId, dateRange }) => {
      const request = {
        property: `properties/${propertyId}`,
        dateRanges: [dateRange],
        dimensions: [
          { name: 'country' },
          { name: 'city' },
          { name: 'language' },
        ],
        metrics: [{ name: 'users' }],
      };
      console.log('get_user_demographics request:', JSON.stringify(request, null, 2));
      const [response] = await analyticsDataClient.runReport(request);
      return response;
    },

    get_page_performance: async ({ propertyId, dateRange }) => {
      const request = {
        property: `properties/${propertyId}`,
        dateRanges: [dateRange],
        dimensions: [{ name: 'pagePath' }],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' },
        ],
      };
      console.log('get_page_performance request:', JSON.stringify(request, null, 2));
      const [response] = await analyticsDataClient.runReport(request);
      return response;
    },

    get_conversion_data: async ({ propertyId, dateRange }) => {
      const request = {
        property: `properties/${propertyId}`,
        dateRanges: [dateRange],
        metrics: [
          { name: 'conversions' },
          { name: 'conversionRate' },
          { name: 'totalRevenue' },
        ],
      };
      console.log('get_conversion_data request:', JSON.stringify(request, null, 2));
      const [response] = await analyticsDataClient.runReport(request);
      return response;
    },

    get_custom_report: async ({ propertyId, dateRange, metrics, dimensions, orderBys }) => {
      const request = {
        property: `properties/${propertyId}`,
        dateRanges: [dateRange],
        metrics: metrics.map(metric => ({ name: metric })),
        dimensions: dimensions.map(dimension => ({ name: dimension })),
        orderBys: orderBys || [],
      };
      console.log('get_custom_report request:', JSON.stringify(request, null, 2));
      const [response] = await analyticsDataClient.runReport(request);
      return response;
    },
  },
});

server.start(); 