export const handler = async (event, context) => {
  const { place_id, api_key } = event.queryStringParameters;

  if (!place_id || !api_key) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing place_id or api_key' }),
    };
  }

  const url = `https://serpapi.com/search.json?engine=google_maps_reviews&place_id=${place_id}&api_key=${api_key}&hl=en`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
