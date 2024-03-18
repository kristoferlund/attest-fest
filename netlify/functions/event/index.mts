export default async (req: Request) => {
  const url = "https://stats.fmckl.se/api/event";

  // Check if the request has a body
  if (!req.body) {
    // If there's no body, return a 404 response with "Body required."

    return new Response("Body required", {
      status: 404,
    });
  }

  try {
    // Forward the request to the target URL and wait for the response
    const response = await fetch(url, {
      method: req.method,
      headers: req.headers,
      body: req.body,
    });

    // Collect response from the target URL
    const responseBody = await response.text();

    // Return the response from the target URL
    return new Response(responseBody, {
      status: response.status,
    });
  } catch (error) {
    // Handle any errors that occur during the fetch operation
    return new Response(error.message, {
      status: 500,
    });
  }
};
