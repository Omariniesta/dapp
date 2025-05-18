document.addEventListener("DOMContentLoaded", function () {
  const taskContainer = document.getElementById("task-container");

  fetch("https://omariniesta.github.io/Omar/tasks.json")
    .then((response) => response.json())
    .then((tasks) => {
      tasks.forEach((task) => {
  const card = document.createElement("div");
  card.className = "task-card";

  const isCompleted = task.completed === true;

card.innerHTML = `
  <div class="task-name">${task.title}</div>
  <p class="task-desc">${task.description}</p>
  <div class="task-footer">
    <div class="task-points">${task.completed ? '✅ Completed' : `+${task.points} pts`}</div>
    ${
      task.completed
        ? ''
        : `<div class="task-action">
            ${
              task.action === "checkin"
                ? `<button class="task-btn" onclick="alert('Checked in successfully!')">Check In</button>`
                : `<a href="${task.action}" target="_blank" class="task-btn">Do Task</a>`
            }
          </div>`
    }
  </div>
`;


  taskContainer.appendChild(card);
});

    })
    .catch((error) => {
      console.error("Error loading tasks:", error);
      taskContainer.innerHTML = "<p>Failed to load tasks. Please try again later.</p>";
    });
});
