export default async (req: Request) => {
  const url = "https://stats.fmckl.se/api/event";

  // Attempt to read the request body
  const requestBody = await req.text();

  // Check if the request has a body
  if (!requestBody) {
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
      body: requestBody, // Use the read body text
    });

    // Return the response from the target URL directly
    // This approach ensures headers and status are preserved
    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    // Handle any errors that occur during the fetch operation
    return new Response(error.message, {
      status: 500,
    });
  }
};
