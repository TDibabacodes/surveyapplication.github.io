function fillOutSurvey() {
  document.getElementById("menu").style.display = "none";
  document.getElementById("screen2").style.display = "block";
}

function viewSurveyResults() {
  document.getElementById("menu").style.display = "none";
  document.getElementById("screen3").style.display = "block";
  getSurveyResults();
}

function submitSurvey(event) {
  event.preventDefault();

  const surname = document.getElementById("surname").value;
  const firstNames = document.getElementById("firstNames").value;
  const contactNumber = document.getElementById("contactNumber").value;
  const date = document.getElementById("date").value;
  const age = document.getElementById("age").value;
  const favoriteFood = Array.from(
    document.querySelectorAll('input[type="checkbox"]:checked')
  ).map((cb) => cb.value);
  const eatOut = document.querySelector('input[name="eatOut"]:checked').value;
  const watchMovies = document.querySelector(
    'input[name="watchMovies"]:checked'
  ).value;
  const watchTV = document.querySelector('input[name="watchTV"]:checked').value;
  const listenRadio = document.querySelector(
    'input[name="listenRadio"]:checked'
  ).value;

  const surveyData = {
    surname,
    firstNames,
    contactNumber,
    date,
    age,
    favoriteFood,
    eatOut,
    watchMovies,
    watchTV,
    listenRadio,
  };

  // Send the survey data to the server
  fetch("/survey", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(surveyData),
  })
    .then((response) => {
      if (response.ok) {
        document.getElementById("surveyForm").reset();
        alert("Survey submitted successfully!");
        document.getElementById("menu").style.display = "block";
        document.getElementById("screen2").style.display = "none";
      } else {
        throw new Error("Failed to submit survey");
      }
    })
    .catch((error) => {
      console.error(error);
      alert("Failed to submit survey");
    });
}

function getSurveyResults() {
  fetch("/survey")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to fetch survey results");
      }
    })
    .then((data) => {
      displaySurveyResults(data);
    })
    .catch((error) => {
      console.error(error);
      alert("Failed to fetch survey results");
    });
}

function displaySurveyResults(data) {
  document.getElementById("totalSurveys").textContent = data.totalSurveys;
  document.getElementById("averageAge").textContent = data.averageAge;
  document.getElementById("oldestPerson").textContent = data.oldestPerson;
  document.getElementById("youngestPerson").textContent = data.youngestPerson;
  document.getElementById("pizzaPercentage").textContent = data.pizzaPercentage;
  document.getElementById("pastaPercentage").textContent = data.pastaPercentage;
  document.getElementById("papWorsPercentage").textContent =
    data.papWorsPercentage;
  document.getElementById("eatOutRating").textContent = data.eatOutRating;
  document.getElementById("watchMoviesRating").textContent =
    data.watchMoviesRating;
  document.getElementById("watchTVRating").textContent = data.watchTVRating;
  document.getElementById("listenRadioRating").textContent =
    data.listenRadioRating;
}

function backToMenu() {
  document.getElementById("menu").style.display = "block";
  document.getElementById("screen3").style.display = "none";
}
