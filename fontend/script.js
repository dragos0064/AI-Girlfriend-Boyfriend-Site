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
    document.getElementById("chat-messages").lastChild.remove();
    addMessage(data.response, false);
  } catch (error) {
    console.error(error);
    addMessage("Error: Unable to fetch AI response", false);
  }
}

function addMessage(message, isUser) {
  const messageDiv = document.createElement("div");
  messageDiv.textContent = message;
  messageDiv.style.marginBottom = "10px";
  messageDiv.style.alignSelf = isUser ? "flex-end" : "flex-start";
  messageDiv.style.backgroundColor = isUser ? "#0078d4" : "#e1e1e1";
  messageDiv.style.color = isUser ? "#ffffff" : "#000000";
  messageDiv.style.padding = "10px";
  messageDiv.style.borderRadius = "10px";
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
