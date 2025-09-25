document.addEventListener("DOMContentLoaded", () => {
  const sendButton = document.getElementById("send-button");
  const micButton = document.getElementById("mic-button");
  const messageInput = document.getElementById("message-input");
  const chatMessages = document.getElementById("chat-messages");
  const suggestionsContainer = document.getElementById("suggestions");
  const contentDisplay = document.getElementById("content-display");

  // Define content for each suggestion
  const suggestionContents = {
    "Information related to pending cases":
      "There are more than five crore pending cases in India's courts, including the Supreme Court, high courts, and district courts:\n\n" +
      "Supreme Court: As of January 2024, there were 80,221 cases pending in the Supreme Court.\n\n" +
      "High courts: There are nearly 62,000 cases pending in high courts that are over 30 years old, with some cases dating back to 1952.\n\n",
    "Divisions of the DoJ":
      "The divisions of the Department of Justice include: [List of divisions]",
    "Judges and court vacancies":
      "There are several issues related to judicial vacancies in India, including vacancies in the Supreme Court, High Courts, and District Courts:\n\n" +
      "Supreme Court:\n" +
      "As of July 5, 2023, the Supreme Court of India had three vacancies out of its sanctioned strength of 34 judges.\n\n" +
      "High Courts:\n" +
      "As of April 1, 2024, there were 327 vacancies in High Courts across India, out of a sanctioned strength of 1,114 judges. The Allahabad High Court has the highest number of vacancies at 69, out of a sanctioned strength of 160 seats.\n\n" +
      "District Courts:\n" +
      "The Supreme Court directed that the selection process for 15 vacancies in the direct recruitment quota for district judges in Tamil Nadu should be completed by March 31, 2024.\n",
    "Pending cases":
      "Overview of pending cases: [Information about ongoing cases]",
    "Information related to Rape and POCSO Act":
      "Details regarding the Rape and POCSO Act: [Information about the act]",
    "Process of Download the e-Courts app":
      "Steps to download the e-Courts app: [Instructions for download]",
    Others: "Contact Details of live Agent",
  };

  function addMessage(text, type) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", `${type}-message`);
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function createSuggestionButtons() {
    suggestionsContainer.innerHTML = "";
    Object.keys(suggestionContents).forEach((suggestion) => {
      const button = document.createElement("button");
      button.classList.add("suggestion-button");
      button.textContent = suggestion;
      button.addEventListener("click", () => {
        messageInput.value = suggestion;
        showContent(suggestion); // Display content related to the selected suggestion
        sendButton.click(); // Automatically send the message
      });
      suggestionsContainer.appendChild(button);
    });
  }

  function showContent(suggestion) {
    if (suggestionContents[suggestion]) {
      // Clear previous content to avoid duplication
      contentDisplay.textContent = suggestionContents[suggestion];
      contentDisplay.style.display = "block"; // Show the content display
      // Add the bot message only if it's not already there
      const existingMessages = chatMessages.querySelectorAll(".bot-message");
      const lastMessage = existingMessages[existingMessages.length - 1];
      if (!lastMessage || lastMessage.textContent !== suggestionContents[suggestion]) {
        addMessage(suggestionContents[suggestion], "bot");
      }
    } else {
      contentDisplay.textContent = "No content available.";
      contentDisplay.style.display = "block"; // Ensure it's visible even if no content
    }
  }

  sendButton.addEventListener("click", () => {
    const userMessage = messageInput.value.trim();
    if (userMessage) {
      addMessage(userMessage, "user");
      const botResponse =
        suggestionContents[userMessage] || getBotResponse(userMessage);
      addMessage(botResponse, "bot");
      messageInput.value = "";
      contentDisplay.style.display = "none"; // Hide content display after sending the message
    }
  });

  messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendButton.click();
    }
  });

  document.getElementById("chat-close").addEventListener("click", () => {
    document.getElementById("chat-container").style.display = "none";
  });

  createSuggestionButtons();

  // Voice-to-Text Functionality
  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  recognition.lang = "en-US";

  micButton.addEventListener("click", () => {
    recognition.start();
  });

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    messageInput.value = transcript;
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
  };

  recognition.onend = () => {
    console.log("Speech recognition ended.");
  };
});
