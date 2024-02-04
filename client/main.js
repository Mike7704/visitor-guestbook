const form = document.getElementById("form");
const messagesContainer = document.getElementById("messages-container");

const baseURL = import.meta.env.VITE_ServerURL;

// Listen to form to send a new message
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  addMessage(form);
});

// Get messages from database
async function fetchMessages() {
  const messages = await fetch(`${baseURL}/messages`);
  // Parse into an array
  return await messages.json();
}

// Add message to database
async function addMessage(form) {
  // Read form data
  const formData = new FormData(form);
  const messageData = Object.fromEntries(formData);

  // Send data to server to add to database
  const response = await fetch(`${baseURL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messageData),
  });
  if (response.ok) {
    displayMessages();
  } else {
    console.error("Failed to add message", response.status);
  }
}

// Delete message from database
async function deleteMessage(id) {
  const result = await fetch(`${baseURL}/messages/${id}`, {
    method: "DELETE",
  });
  //console.log(result);
  if (result.ok) {
    displayMessages();
  } else {
    console.error("Failed to delete message", response.status);
  }
}

// Increase message like count
async function likeMessage(id, currentLikes) {
  const result = await fetch(`${baseURL}/messages/${id}/increaseLikes`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ likes: currentLikes }),
  });
  //console.log(result);
  if (result.ok) {
    displayMessages();
  } else {
    console.error("Failed to like message", response.status);
  }
}

// Iterate through database and generate html elements for each message
async function displayMessages() {
  let messages = await fetchMessages();
  //console.log(messages);
  messagesContainer.innerHTML = ""; // Clear previous messages

  messages.forEach((message) => {
    // Create HTML elements
    let messageDivTag = document.createElement("div");
    let photoImgTag = document.createElement("img");
    let textDivTag = document.createElement("div");
    let nameH3Tag = document.createElement("h3");
    let messagePTag = document.createElement("p");
    let likeButton = document.createElement("button");
    let deleteButton = document.createElement("button");

    messageDivTag.classList.add("message-container");
    textDivTag.classList.add("text-container");

    // Set content of HTML elements
    photoImgTag.src = message.userPhoto;
    nameH3Tag.textContent = message.username;
    messagePTag.textContent = message.message;
    likeButton.textContent = `👍: ${message.likes}`;
    deleteButton.textContent = "Delete";

    // If an image fails to load, set it to the default image
    photoImgTag.onerror = function () {
      photoImgTag.src = "https://www.tenforums.com/geek/gars/images/2/types/thumb_15951118880user.png";
    };

    // Give each message a like button to increase likes
    likeButton.addEventListener("click", (event) => {
      event.preventDefault();
      likeMessage(message.id, message.likes);
    });

    // Give each message a delete button to delete the message
    deleteButton.addEventListener("click", (event) => {
      event.preventDefault();
      deleteMessage(message.id);
    });

    // Add elements to divs to be displayed
    textDivTag.appendChild(nameH3Tag);
    textDivTag.appendChild(messagePTag);
    messageDivTag.appendChild(photoImgTag);
    messageDivTag.appendChild(textDivTag);
    messageDivTag.appendChild(likeButton);
    messageDivTag.appendChild(deleteButton);
    messagesContainer.appendChild(messageDivTag);
  });
  // Set scroll to be at the bottom so last message is visible
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

displayMessages();
