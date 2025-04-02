export function fetchData() {
  return fetch("/data.json").then((response) => response.json());
}
let Books = fetchData();
const goalBtn = document.querySelector(".goal-btn");
if (goalBtn) {
  goalBtn.addEventListener("click", () => {
    const modal = document.createElement("div");
    const modalOverlay = document.createElement("section");
    const section1 = document.createElement("div");
    const section2 = document.createElement("div");
    const section3 = document.createElement("div");
    const section4 = document.createElement("div");

    //section 4 is where the user actually sets their goal
    const goalForm = document.createElement("form");
    goalForm.method = "post";
    goalForm.action = "/setGoal";
    goalForm.classList.add("goal-form");
    goalForm.innerHTML = `
  <label for="duration">How long should it last</label> 
  <input type="number" id="duration" name="duration">
  <select id="durationUnit" name="durationUnit">
    <option value="days">Day(s)</option>
    <option selected value="weeks">Week(s)</option>
  </select>
  
  <label for="bookCount">How many Books do you want to complete?</label>
  <input type="number" id="bookCount" name="bookCount"> 
  
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
  <input type="text" id="goalName" name="goalName"> 
  <button class="goal-set-btn" type="submit">Submit</button>`;
    
    section4.appendChild(goalForm);
    modalOverlay.classList.add("modal-overlay");
    modalOverlay.appendChild(section4);
    document.body.appendChild(modalOverlay);

    modalOverlay.addEventListener("click", () => {
      document.body.removeChild(modalOverlay);
    });
  });
}
