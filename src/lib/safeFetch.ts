
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
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error(`safeFetch: Failed to parse JSON from ${url}. Text content:`, text);
      throw new Error(`Server returned invalid JSON (${response.status}): ${text.slice(0, 100)}`);
    }

    if (!response.ok) {
      throw new Error(data.error || `Server Error: ${response.status}`);
    }
    return data;
  } else {
    const text = await response.text();
    if (!response.ok) {
      console.error(`safeFetch: Non-JSON Error from ${url}:`, text);
      throw new Error(`Server returned non-JSON error (${response.status}): ${text.slice(0, 100)}`);
    }
    return text;
  }
}
