let questions = [];
let metrics = {};
let scores = {};

const questionContainer = document.getElementById("question-container");
const nextBtn = document.getElementById("next-btn");
const resultContainer = document.getElementById("result-container");

let currentQuestion = 0;

fetch('questions.json')
  .then(response => response.json())
  .then(data => {
    metrics = data.metrics;
    questions = data.questions;

    // Initialiser les scores à 0
    for (const key in metrics) {
      scores[key] = 0;
    }

    showQuestion();
  })
  .catch(error => {
    questionContainer.innerHTML = "<p>Erreur de chargement des données.</p>";
    console.error("Erreur de chargement JSON :", error);
  });

function showQuestion() {
  questionContainer.innerHTML = "";
  const q = questions[currentQuestion];
  const title = document.createElement("h2");
  title.textContent = q.question;
  questionContainer.appendChild(title);

  q.answers.forEach(answer => {
    const btn = document.createElement("button");
    btn.textContent = answer.text;
    btn.onclick = () => {
      applyEffects(answer.effects);
      currentQuestion++;
      if (currentQuestion < questions.length) {
        showQuestion();
      } else {
        showResults();
      }
    };
    questionContainer.appendChild(btn);
  });
}

function applyEffects(effects) {
  for (const key in effects) {
    scores[key] = (scores[key] || 0) + effects[key];
  }
}

function showResults() {
  questionContainer.style.display = "none";
  nextBtn.style.display = "none";
  resultContainer.style.display = "block";

  resultContainer.innerHTML = "<h2>Résultats :</h2>";
  for (const key in scores) {
    const metricName = metrics[key] || key;
    resultContainer.innerHTML += `<p>${metricName} : ${scores[key]}</p>`;
  }
}
