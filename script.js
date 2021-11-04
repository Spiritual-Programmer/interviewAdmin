"use strict"

//Selectors
const url = "http://example-api.winningwithchase.com/interview";
const createInterviewForm = document.querySelector("#create-interview");
const createInterviewCard = document.querySelector(".create.interview-card");
const displayAccountInterviewsForm = document.querySelector("#display-account-interviews"); 
const displayInterviewCard = document.querySelector(".display.interview-card");
const interviewsContainer = document.querySelector(".interviews-container");

//Event Listeners
if (createInterviewCard) {
  createInterviewCard.addEventListener("click", (e) => {
    location.href="createInterview.html";
  })
}
if (displayInterviewCard) {
  displayInterviewCard.addEventListener("click", (e) => {
    location.href="displayInterview.html";
  })
}
if (createInterviewForm) {
  createInterviewForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let email = document.querySelector("#email").value;
    let scheduled_at = document.querySelector("#scheduled-at").value;
    createInterview(email, scheduled_at);
  })
}
if (displayAccountInterviewsForm) {
  displayAccountInterviewsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let accountID = document.querySelector("#account-id").value;
    displayAccountInterviews(accountID);
  })
}

//Functions
function createInterview (email, scheduled_at) {
  let randomUUID = generateUUID();
  fetch("http://example-api.winningwithchase.com/interview", {
  body: JSON.stringify({"invite_email": email, "scheduled_at": scheduled_at}),
  headers: {
    Accept: "application/json",
    "Account-Id": randomUUID,
    "Content-Type": "application/json"
  },
  method: "POST"
})
.then(response => response.json())
.then(data => {
  document.querySelector("#copy-uuid").value = randomUUID;
  let copyUUID = document.querySelector("#copy-uuid");
  let UUIDContainer = document.querySelector(".copy-uuid-container");
  let clipBoardIcon = document.querySelector("#clipboard-icon");
  UUIDContainer.style.display = "block";
  clipBoardIcon.addEventListener("click", (e) => {
    e.preventDefault();
    copyUUID.select();
    copyUUID.setSelectionRange(0, 99999); /* For mobile devices */
    navigator.clipboard.writeText(copyUUID.value);
    })
  const message = document.querySelector(".message");
  message.innerHTML = `Successfully created an interview with ${email} with account id of ${randomUUID}`;
  })
}
function displayAccountInterviews(accountID) {
  fetch(url, {
    headers: {
      Accept: "application/json",
      "Account-Id": accountID
    }
  })
  .then(response => response.json())
  .then(data => {
    data.forEach((interview) => {
      let interviewItem = document.createElement("div");
      interviewItem.classList = "interview-item";
      interviewsContainer.append(interviewItem);
      let interviewID = document.createElement("h4");
      let inviteEmail = document.createElement("h4");
      let scheduledAt = document.createElement("h4");
      interviewID.innerHTML = `Interview ID: ${interview.interview_id}`;
      inviteEmail.innerHTML = `Invite Email: ${interview.invite_email}`;
      scheduledAt.innerHTML = `Scheduled At: ${interview.scheduled_at}`;
      interviewItem.append(interviewID);
      interviewItem.append(inviteEmail);
      interviewItem.append(scheduledAt);
    })
  })
}
function generateUUID() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}
