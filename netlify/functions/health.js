// netlify/functions/health.js
exports.handler = async () => {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ status: 'OK', timestamp: new Date().toISOString(), platform: 'Netlify' })
  };
};
