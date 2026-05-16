
export async function safeFetch(url: string, options?: RequestInit) {
  console.log(`safeFetch: Requesting ${url}`, options?.method || 'GET');
  const response = await fetch(url, options);
  const contentType = response.headers.get("content-type");
  
  console.log(`safeFetch: Response from ${url}`, {
    status: response.status,
    contentType,
    ok: response.ok
  });

  if (contentType && (contentType.includes("application/json") || contentType.includes("text/json"))) {
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      if (!response.ok) {
        throw new Error(data.error || `Server Error: ${response.status}`);
      }
      return data;
    } catch (e) {
      console.error(`safeFetch: Failed to parse JSON from ${url}. Text content:`, text);
      throw new Error(`Server returned invalid JSON (${response.status}): ${text.slice(0, 100)}`);
    }
  } else {
    const text = await response.text();
    if (!response.ok) {
      console.error(`safeFetch: Non-JSON Error from ${url}:`, text);
      throw new Error(`Server returned non-JSON error (${response.status}): ${text.slice(0, 100)}`);
    }
    return text;
  }
}
