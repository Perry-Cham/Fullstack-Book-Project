
export function fetchData() {
  return fetch("/data.json")
    .then((response) => response.json())
    .catch((error) => console.error("Error fetching data:", error));
  return fetch("/data.json")
    .then((response) => response.json())
    .catch((error) => console.error("Error fetching data:", error));
}


let Books = fetchData();
const goalBtn = document.querySelector(".goal-btn");
if (goalBtn) {
  goalBtn.addEventListener("click", () => {
    const modalOverlay = document.createElement("section");
    /* const section4 = document.createElement("div"); */
    /* const section4 = document.createElement("div"); */

    const goalForm = document.createElement("form");
    goalForm.method = "post";
    goalForm.action = "/users/setGoal";
    goalForm.action = "/users/setGoal";
    goalForm.classList.add("goal-form");
    goalForm.innerHTML = `
      <span class="close-btn">X</span>
      <h2>Set your reading goal</h2>
      <p>Setting a reading goal is a great way to stay motivated and track your progress. Let's get started!</p>
      <label for="duration">How long should it last</label> 
      <input type="number" value='1' id="duration" name="duration">
      <select id="durationUnit" name="durationUnit">
        <option value="day">Day(s)</option>
        <option selected value="week">Week(s)</option>
      </select>
      <label for="bookCount">How many Books do you want to complete?</label>
      <input type="number" value='2' id="bookCount" name="bookCount"> 
       <label for="bookCount">How many hours do you want to read a day?</label>
      <input type="number" value='2' id="readingHours" name="readingHours"> 
      <fieldset>
        <legend>Do you want to receive daily reminders?</legend>
        <label>
          <input type="radio" name="reminders" value="yes"> Yes
        </label>
        <label>
          <input type="radio" name="reminders" value="no"> No
        </label>
      </fieldset>
      <label for="goalName">Name your goal (optional)</label>
      <p>I know it seems a bit strange to give it a name but it'll really help you stick to it if you give it a name that means something to you.</p> 
      <input type="text" id="goalName" value='novelTarget' name="goalName"> 
      <button class="goal-set-btn" type="submit">Submit</button>`;

    /* section4.appendChild(goalForm); */
    modalOverlay.classList.add("modal-overlay");
    modalOverlay.appendChild(goalForm);
    modalOverlay.appendChild(goalForm);
    document.body.appendChild(modalOverlay);
    modalOverlay.scrollIntoView();

    document.querySelector("main").classList.add("stopScroll");
    goalForm.querySelector(".close-btn").addEventListener("click", () => {
      document.body.removeChild(modalOverlay);
    });

    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) {
        document.body.removeChild(modalOverlay);
        document.querySelector("main").classList.add("stopScroll");
      }
    });
  });
}

const pageBtns = document.querySelectorAll(".page-btn");
pageBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const bookId = e.target.getAttribute("data-id");
    const numInput = document.createElement("input");
    numInput.type = "number";
    numInput.placeholder = "Enter current page";
    const confirmBtn = document.createElement("button");
    confirmBtn.textContent = "Confirm";

    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.appendChild(numInput);
    modal.appendChild(confirmBtn);
    btn.parentNode.appendChild(modal);

    confirmBtn.addEventListener("click", () => {
      const pageNumber = numInput.value;
      console.log(pageNumber, JSON.stringify({ page: pageNumber }));
      btn.parentNode.removeChild(modal);
      console.log("done" + bookId);
      fetch(`/users/saveCurrentPage/${bookId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ page: pageNumber }),
      });
    });
  });
});

const readingChart = document.querySelector(".reading-chart");
if (readingChart) {
  fetch("/users/getCurrentlyReading", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const labels = [];
      const pagesRead = [];
      // Process data to extract dates and pages read
      data.forEach((book) => {
        book.readingHistory.forEach((entry) => {
          labels.push(new Date(entry.date).toLocaleDateString()); // Format date
          pagesRead.push(entry.pagesRead);
        });
      });
      console.log(data);

      // Render chart
      const ctx = readingChart.getContext("2d");
      new Chart(ctx, {
        type: "line", // Line chart for better visualization of progress
        data: {
          labels: labels,
          datasets: [
            {
              label: "Pages Read Over Time",
              data: pagesRead,
              borderColor: "#36A2EB",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              fill: true,
            },
          ],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: "Date",
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Pages Read",
              },
            },
          },
        },
      });
    })
    .catch((error) =>
      console.error("Error fetching currently reading data:", error)
    );
}

const studyBtn = document.querySelector(".study-goal-btn");
if (studyBtn) {
  studyBtn.addEventListener("click", () => {
    const studyForm = document.createElement("form");
    studyForm.method = "post";
    studyForm.action = "/users/setStudyGoal";
    studyForm.classList.add("goal-form", "study-form");
    studyForm.innerHTML = `
      <span class="close-btn">&times;</span>
      <label>Main Topic/Course/Grade</label>
      <input name='main-topic' type='text'>
      <label>Duration</label>
      <input name='duration' type='text'>
      <select name='durationUnit'>
        <option>days</option>
        <option>weeks</option>
      </select>
      <label>Number of sub-topics</label>
      <input name='topic-number' type="number">
    `;

    const topicNumberInput = studyForm.querySelector("input[name='topic-number']");
    const topicSection = document.createElement("div");
    studyForm.appendChild(topicSection);

    topicNumberInput.addEventListener("change", () => {
      topicSection.innerHTML = ""; // Clear previous sub-topic inputs
      const topicCount = parseInt(topicNumberInput.value, 10) || 0;
      for (let i = 0; i < topicCount; i++) {
        const div = document.createElement("div");
        div.innerHTML = `
          <label >Sub-Topic Name</label>
          <input name='subtopic' type='text'>
        `;
        topicSection.appendChild(div);
      }
    });

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.textContent = "Submit";
    studyForm.appendChild(submitBtn);

    const modalOverlay = document.createElement("section");
    modalOverlay.classList.add("modal-overlay");
    modalOverlay.appendChild(studyForm);
    document.body.appendChild(modalOverlay);
    modalOverlay.scrollIntoView();

    document.querySelector("main").classList.add("stopScroll");
    studyForm.querySelector(".close-btn").addEventListener("click", () => {
      document.body.removeChild(modalOverlay);
      document.querySelector("main").classList.remove("stopScroll");
    });

    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) {
        document.body.removeChild(modalOverlay);
        document.querySelector("main").classList.remove("stopScroll");
      }
    });
  });
}

const studySubTopics = document.querySelectorAll('.study-sub-topic')
if(studySubTopics){
  studySubTopics.forEach((topic) => {
    const btn = topic.querySelector('.study-finish-btn');
    btn.addEventListener('click', () => {
      topic.classList.add('completed');
      const topicId = topic.getAttribute('data-id');
      fetch(`/users/updateStudyGoal/${topicId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      })
    })
  })
}