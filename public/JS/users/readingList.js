export function fetchData() {
  return fetch("/data.json").then((response) => response.json());
}
let Books = fetchData();
const goalBtn = document.querySelector(".goal-btn");
goalBtn.addEventListener("click", () => {
  const modal = document.createElement("div");
  const modalOverlay = document.createElement("section");
  const section1 = document.createElement("div");
  const section2 = document.createElement("div");
  const section3 = document.createElement("div");
  const section4 = document.createElement("div");

  //section 4 is where the user actually sets their goal
  const goalForm = document.createElement('form');
  goalForm.method = "post";
  goalForm.action = "/setGoal";
  goalForm.innerHTML =
    "<label>How long should it last<label> <input type=number placeholder> = 7> <input type=select> <options><options> <label>How many Books do you want to complete?</label> <input type=number> <Do you want to receive daily reminders?> <input type = radio group=1> <input ytpe = radio group = 1> <label>Name your goal (optional)<label><p>I know it seems a bit strange to give it a name but Itll really help you stick to it if you give it a name that means something to you.</p> <input type=text> <button class=goal-set-btn type=submit>Submit<button>";
    section4.appendChild(goalForm)
    modalOverlay.classList.add("modal-overlay")
    modalOverlay.appendChild(section4)
    document.body.appendChild(modalOverlay);

    modalOverlay.addEventListener("click", () => {
      document.body.removeChild(modalOverlay)
    })
});

