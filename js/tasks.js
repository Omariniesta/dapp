import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { db } from "./main.js"; // or wherever you initialize Firebase

// Fetch and render tasks from JSON
fetch("https://omariniesta.github.io/Omar/tasks.json")
  .then(response => response.json())
  .then(async tasks => {
    const taskContainer = document.getElementById("task-container");

    const tg = window.Telegram.WebApp;
    const username = tg.initDataUnsafe?.user?.username || "guest";

    // Load user's completed tasks from Firestore
    const userRef = doc(db, "users", username);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.exists() ? userSnap.data() : { completedTasks: [], points: 0 };

    tasks.forEach(task => {
      const card = document.createElement("div");
      card.className = "task-card";
      card.innerHTML = `
  <div class="task-name">
    ${task.title}
  </div>
  <p class="task-desc">${task.description}</p>
  <div class="task-footer">
    <div class="task-points">+${task.points} pts</div>
    <div class="task-action"></div>
  </div>
`;

      const button = document.createElement("button");
      button.textContent = userData.completedTasks?.includes(task.id) ? "Completed" : "Do Task";
      button.disabled = userData.completedTasks?.includes(task.id);
      button.className = "task-btn";
      button.dataset.taskId = task.id;
      button.dataset.points = task.points;
      button.dataset.action = task.action;

      button.addEventListener("click", async (e) => {
        const id = e.currentTarget.dataset.taskId;
        const points = parseInt(e.currentTarget.dataset.points);
        const action = e.currentTarget.dataset.action;

        if (action === "checkin") {
          await completeTask(username, id, points);
          e.currentTarget.textContent = "Completed";
          e.currentTarget.disabled = true;
        } else {
          // Open external link and then mark complete
          window.open(action, "_blank");

          setTimeout(async () => {
            await completeTask(username, id, points);
            e.currentTarget.textContent = "Completed";
            e.currentTarget.disabled = true;
          }, 3000); // Give time to visit the page
        }
      });

      card.querySelector(".task-action").appendChild(button);
      taskContainer.appendChild(card);
    });
  });
