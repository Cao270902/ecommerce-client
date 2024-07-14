const BASE_URL = "http://localhost:4444/api";

export default async function restApi({ endpoint, method, body }) {
  try {
    const res = await fetch(`${BASE_URL}/${endpoint}`, {
      method,
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}
