let currentParagraph = null;

const API_KEY = "your-api-key"; // TODO: insert ur API key;
const openaiHeaders = {
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
};

// Add a hover event listener to all paragraphs
document.addEventListener("mouseover", function (event) {
  if (event.target.tagName === "P") {
    const paragraph = event.target;

    // Check if a button with the same ID already exists
    const buttonId = paragraph.dataset.paraphraseButtonId;
    let button = document.getElementById(buttonId);
    if (!button) {
      // Create the button element with a unique ID
      const buttonId = "paraphrase-button-" + Date.now();
      button = document.createElement("button");
      const iconUrl = chrome.runtime.getURL("icon.png");
      console.log("iconURL", iconUrl);
      button.innerHTML = `<img src="${iconUrl}" width="20" height="20"/>`;
      button.id = buttonId;

      const rect = paragraph.getBoundingClientRect();
      // Style the button to look cute and similar to Material Design hovering buttons
      button.style.position = "absolute";
      button.style.padding = "4px";
      button.style.fontSize = "14px";
      button.style.fontWeight = "bold";
      button.style.color = "#fff";
      button.style.background = "rgba(255, 255, 255, 0.8)";
      button.style.borderRadius = "8px";
      button.style.opacity = "0.9";
      button.style.border = "none";
      button.style.cursor = "pointer";
      button.style.boxShadow =
        "0 1px 4px rgba(0, 0, 0, 0.25), 0 4px 12px rgba(0, 0, 0, 0.15)";
      button.style.transition = "transform 0.3s ease-in-out";

      // Add a hover effect to the button
      button.addEventListener("mouseenter", function () {
        button.style.transform = "scale(1.1)";
      });

      button.addEventListener("mouseleave", function () {
        button.style.transform = "scale(1.0)";
      });

      const margin = 5;
      button.style.right = `${window.innerWidth - rect.right + margin}px`;
      button.style.top = `${rect.top + window.scrollY + margin}px`;

      // Add the button ID to the paragraph data
      paragraph.dataset.paraphraseButtonId = buttonId;

      // Add a click event listener to the button
      button.addEventListener("click", async function () {
        // Handle the button click here
        console.log("Paraphrase button clicked");

        // Get the text of the paragraph
        const paragraphText = paragraph.textContent;

        // Calculate the number of input tokens
        const inputTokens = paragraphText.split(" ").length;

        // Set max_tokens to be at most 2 times the number of input tokens
        const maxTokens = Math.min(Math.round(inputTokens * 2), 2048);

        // Disable the button while the request is in progress
        button.disabled = true;
        const icon = button.querySelector("img");
        icon.style.animation = "spin 1s linear infinite";

        // Send a request to the OpenAI GPT API to paraphrase the text
        const response = await fetch("https://api.openai.com/v1/completions", {
          method: "POST",
          headers: openaiHeaders,
          body: JSON.stringify({
            prompt: `input: Please paraphrase the following text:"${paragraphText}"
            output:`,
            model: "text-davinci-003",
            max_tokens: maxTokens,
            temperature: 0.7,
            n: 1,
            stop: ["input:"],
          }),
        });

        // Get the paraphrased text from the API response
        const data = await response.json();
        const paraphrasedText = data.choices[0].text.trim();

        // Remove the original text from the paragraph
        paragraph.textContent = "";

        // Replace the paragraph's text with the summarized version
        const words = paraphrasedText.split(" ");
        let i = 0;
        const interval = setInterval(() => {
          if (i > words.length) {
            clearInterval(interval);
            return;
          }
          paragraph.textContent = words.slice(0, i++).join(" ");
        }, 50);

        console.log(`Paraphrased text: ${paraphrasedText}`);
        // Enable the button and remove the loading animation from the icon
        button.disabled = false;
        icon.style.animation = "";
      });

      // Add the button to the page
      document.body.appendChild(button);
    }

    // Add a border to the hovered paragraph
    paragraph.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
    paragraph.style.padding = "8px";
    paragraph.style.borderRadius = "4px";

    // Remove the button and border from the previous paragraph, if any
    if (currentParagraph && currentParagraph !== paragraph) {
      removeButton(currentParagraph);
    }

    currentParagraph = paragraph;
  }
});

const style = document.createElement("style");
style.innerHTML = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
document.head.appendChild(style);

function removeButton(paragraph) {
  // Get the button ID from the paragraph data
  const buttonId = paragraph.dataset.paraphraseButtonId;

  // Remove the button with the same ID
  const button = document.getElementById(buttonId);
  if (button) {
    button.parentNode.removeChild(button);
    delete paragraph.dataset.paraphraseButtonId;
  }

  // Remove the border from the paragraph
  paragraph.style.borderRadius = "none";
  paragraph.style.boxShadow = "none";
  paragraph.style.padding = "none";
}

// Remove the button and border when the extension is deactivated
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "deactivate") {
    if (currentParagraph) {
      removeButton(currentParagraph);
      currentParagraph = null;
    }
  }
});
