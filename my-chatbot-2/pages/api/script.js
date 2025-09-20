const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

function appendMessage(text, className) {
  const msg = document.createElement("div");
  msg.className = `message ${className}`;
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage(message, "user-message");
  userInput.value = "";
  appendMessage("Typing...", "typing");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    const typingEl = chatBox.querySelector(".typing");
    if (typingEl) typingEl.remove();

    if (res.ok) {
      appendMessage(data.response, "bot-message");
    } else {
      appendMessage("Error: " + (data.error || "Unknown"), "bot-message");
    }
  } catch (err) {
    const typingEl = chatBox.querySelector(".typing");
    if (typingEl) typingEl.remove();
    appendMessage("Network error", "bot-message");
    console.error(err);
  }
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
