const scenarios = [
  {
    id: 1,
    theme: "game-scam",
    title: "遊戲儲值詐騙",
    messages: [
      {
        sender: "scammer",
        text: "恭喜你獲得免費遊戲鑽石！點擊此連結領取：bit.ly/free-diamonds",
        screenshotUrl: null
      },
      {
        sender: "feedback",
        text: "",
        responseOptions: ["trust", "doubt"]
      }
    ],
    feedback: {
      trust: {
        text: "錯誤！你點擊了詐騙連結，可能會洩露個人資訊。",
        isCorrect: false,
        explanation: "詐騙者常使用免費獎勵誘惑你點擊惡意連結，應避免點擊來路不明的連結。"
      },
      doubt: {
        text: "正確！懷疑並回報是安全的做法！",
        isCorrect: true,
        explanation: "遇到可疑訊息時，應保持懷疑並向平台或相關સ相關單位回報。"
      }
    }
  },
  {
    id: 2,
    theme: "fake-job",
    title: "假工作詐騙",
    messages: [
      {
        sender: "scammer",
        text: "在家工作日賺 5000！立即加入我們的兼職計畫：job.tw/easy-money",
        screenshotUrl: null
      },
      {
        sender: "feedback",
        text: "",
        responseOptions: ["trust", "doubt"]
      }
    ],
    feedback: {
      trust: {
        text: "錯誤！這可能是詐騙，可能要求你支付費用或提供個人資料。",
        isCorrect: false,
        explanation: "正規工作不會要求預付費用，應確認對方身份並查證工作來源。"
      },
      doubt: {
        text: "正確！保持懷疑並查證是最佳做法！",
        isCorrect: true,
        explanation: "高薪兼職廣告通常是詐騙陷阱，應查證公司背景。"
      }
    }
  }
];

let currentScenarioIndex = 0;
let currentStep = 0;
let score = 0;
let wrongAnswers = [];

const chatContainer = document.getElementById("chatContainer");
const responseOptions = document.getElementById("responseOptions");
const scenarioTitle = document.getElementById("scenarioTitle");
const scenarioGuide = document.getElementById("scenarioGuide");
const progress = document.getElementById("progress");
const welcomeScreen = document.getElementById("welcomeScreen");
const mainContainer = document.getElementById("mainContainer");
const wrongAnswersScreen = document.getElementById("wrongAnswersScreen");
const summaryScreen = document.getElementById("summaryScreen");
const wrongAnswersList = document.getElementById("wrongAnswersList");
const summaryText = document.getElementById("summaryText");

function startChallenge() {
  welcomeScreen.style.display = "none";
  mainContainer.style.display = "flex";
  loadScenario(currentScenarioIndex);
}

function loadScenario(index) {
  const scenario = scenarios[index];
  scenarioTitle.textContent = scenario.title;
  scenarioGuide.textContent = "請閱讀右側對話，選擇正確回應以避免詐騙。";
  progress.textContent = `進度：${index + 1}/${scenarios.length}`;
  chatContainer.innerHTML = "";
  responseOptions.innerHTML = "";
  currentStep = 0;
  displayMessage();
}

function displayMessage() {
  const scenario = scenarios[currentScenarioIndex];
  if (currentStep < scenario.messages.length) {
    const msg = scenario.messages[currentStep];
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${msg.sender}`;
    messageDiv.textContent = msg.text;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    if (msg.responseOptions) {
      renderResponseButtons(msg.responseOptions);
    }
    currentStep++;
  }
}

function renderResponseButtons(options) {
  responseOptions.innerHTML = "";
  options.forEach(option => {
    const button = document.createElement("button");
    button.className = "response-btn";
    button.setAttribute("data-response", option);
    button.textContent = option === "trust" ? "相信並點擊連結" : "懷疑並回報";
    button.setAttribute("aria-label", `選擇${button.textContent}`);
    button.addEventListener("click", () => handleResponse(option));
    responseOptions.appendChild(button);
  });
}

function handleResponse(response) {
  const scenario = scenarios[currentScenarioIndex];
  const feedback = scenario.feedback[response];
  const feedbackDiv = document.createElement("div");
  feedbackDiv.className = "message feedback";
  feedbackDiv.textContent = feedback.text;
  chatContainer.appendChild(feedbackDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  if (feedback.isCorrect) {
    score += 10;
  } else {
    wrongAnswers.push({
      scenarioId: scenario.id,
      title: scenario.title,
      userChoice: response === "trust" ? "相信並點擊連結" : "懷疑並回報",
      explanation: feedback.explanation
    });
  }

  responseOptions.innerHTML = "";
  setTimeout(() => {
    currentScenarioIndex++;
    if (currentScenarioIndex < scenarios.length) {
      loadScenario(currentScenarioIndex);
    } else {
      showSummary();
    }
  }, 1500);
}

function showWrongAnswers() {
  mainContainer.style.display = "none";
  wrongAnswersScreen.style.display = "block";
  wrongAnswersList.innerHTML = "";
  if (wrongAnswers.length === 0) {
    wrongAnswersList.innerHTML = "<p>目前沒有錯題記錄，表現完美！</p>";
  } else {
    const ul = document.createElement("ul");
    wrongAnswers.forEach(answer => {
      const li = document.createElement("li");
      li.innerHTML = `
        <p>題目：${answer.title}</p>
        <p>你的選擇：${answer.userChoice}</p>
        <p>解析：${answer.explanation}</p>
        <button onclick="retryScenario(${answer.scenarioId})">重新挑戰</button>
      `;
      ul.appendChild(li);
    });
    wrongAnswersList.appendChild(ul);
  }
}

function retryScenario(scenarioId) {
  currentScenarioIndex = scenarios.findIndex(s => s.id === scenarioId);
  wrongAnswersScreen.style.display = "none";
  mainContainer.style.display = "flex";
  loadScenario(currentScenarioIndex);
}

function showSummary() {
  mainContainer.style.display = "none";
  summaryScreen.style.display = "block";
  summaryText.innerHTML = `
    <p>完成題目：${scenarios.length}</p>
    <p>正確率：${Math.round((score / (scenarios.length * 10)) * 100)}%</p>
    <p>總積分：${score}</p>
  `;
}

function resetChallenge() {
  currentScenarioIndex = 0;
  score = 0;
  wrongAnswers = [];
  summaryScreen.style.display = "none";
  mainContainer.style.display = "flex";
  loadScenario(currentScenarioIndex);
}