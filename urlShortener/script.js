const longUrlInput = document.getElementById("longUrl");
const shortenUrlButton = document.getElementById("shortenUrlBtn");
const shortUrlResult = document.getElementById("shortUrlResult");

function sanitizeUrl(url) {
  return url.trim();
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

shortenUrlButton.addEventListener("click", async () => {
  const longUrl = sanitizeUrl(longUrlInput.value);

  shortUrlResult.textContent = "Shortening URL...";
  shortUrlResult.style.color = "blue";

  if (!isValidUrl(longUrl)) {
    shortUrlResult.textContent = "Please enter a valid URL.";
    shortUrlResult.style.color = "red";
    return;
  }

  const apiKey = "n7b5bk0qD0FVg9xZz1elfPKyt6rFEzWCmIo8Qp6DIsup9HDmQxPKgFkmJSCb";

  try {
    const response = await fetch("https://api.tinyurl.com/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: longUrl,
        domain: "tiny.one",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API request failed:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API response data:", data);

    if (data.data && data.data.tiny_url) {
      shortUrlResult.innerHTML = `<a href="${data.data.tiny_url}" target="_blank">${data.data.tiny_url}</a>`;
      shortUrlResult.style.color = "green";
    } else {
      throw new Error(
        (data.errors && data.errors[0] && data.errors[0].message) ||
          "Unknown error occurred"
      );
    }
  } catch (error) {
    console.error("Error:", error);
    shortUrlResult.textContent = `Error: ${error.message}`;
    shortUrlResult.style.color = "red";
  }
});
