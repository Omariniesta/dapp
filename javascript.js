lucide.createIcons();

function switchTab(tab) {
  document.querySelectorAll('.main').forEach(div => div.classList.remove('active'));
  document.getElementById(tab).classList.add('active');
  document.querySelectorAll('.footer button').forEach(btn => btn.classList.remove('active'));
  event.target.closest('button').classList.add('active');
}

// Mock Telegram User (replace this part later with real WebApp data)
const user = {
  username: "zyper_gamer"
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('username').innerText = "Username: @" + user.username;

  // Fetch user data
  fetch(http://127.0.0.1:8000/user/${user.username})
    .then(res => res.json())
    .then(data => {
      document.getElementById("username").textContent = "Username: @" + data.username;
      document.getElementById("points").textContent = data.points;
      document.getElementById("referrals").textContent = data.referrals;
    })
    .catch(error => console.error("User fetch error:", error));

  // Fetch tasks
  fetch("http://127.0.0.1:8000/tasks")
    .then(res => res.json())
    .then(tasks => {
      const taskContainer = document.getElementById("task-container");
      taskContainer.innerHTML = "";

      tasks.forEach(task => {
        const taskDiv = document.createElement("div");
        taskDiv.className = "task-card";
        taskDiv.innerHTML = 
          <div>
            <p>${task.title}</p>
            <button>Complete</button>
          </div>
          <span>+${task.points} pts</span>
        ;
        taskContainer.appendChild(taskDiv);
      });
    })
    .catch(error => console.error("Tasks fetch error:", error));
});