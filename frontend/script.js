const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  addMessage(userMessage, true);
  userInput.value = "";

  addMessage("Thinking...", false);
  try {
    const response = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await response.json();
    chatMessages.lastChild.remove();
    addMessage(data.response, false);
  } catch (error) {
    console.error(error);
    chatMessages.lastChild.remove();
    addMessage("Oops! Something went wrong. Please try again.", false);
  }
}

function addMessage(message, isUser) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `chat-message ${isUser ? "user-message" : "ai-message"}`;
  messageDiv.textContent = message;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
