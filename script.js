// ---------------------------------------------------------
// Tense data - structure, examples and quiz for each tense
// (unchanged - still lives right here in the code)
// ---------------------------------------------------------

const tenseData = {
  "present-simple": {
    label: "Present Simple",
    structure: "Subject + verb (add s/es for he/she/it)",
    examples: [
      "She works at a bank.",
      "I drink coffee every morning.",
      "The sun rises in the east."
    ],
    quiz: [
      { q: "He ___ to school every day.", options: ["go", "goes", "going"], answer: "b" },
      { q: "They ___ football on weekends.", options: ["plays", "play", "played"], answer: "b" },
      { q: "Water ___ at 100 degrees.", options: ["boil", "boils", "boiled"], answer: "b" }
    ]
  },
  "present-continuous": {
    label: "Present Continuous",
    structure: "Subject + am/is/are + verb-ing",
    examples: [
      "She is working right now.",
      "I am reading a book.",
      "They are watching a movie tonight."
    ],
    quiz: [
      { q: "Look! It ___ outside.", options: ["rains", "is raining", "rained"], answer: "b" },
      { q: "I ___ my homework right now, call back later.", options: ["am doing", "did", "have done"], answer: "a" },
      { q: "She ___ dinner at the moment.", options: ["cooks", "is cooking", "cooked"], answer: "b" }
    ]
  },
  "present-perfect": {
    label: "Present Perfect",
    structure: "Subject + have/has + past participle",
    examples: [
      "She has worked here for 3 years.",
      "I have seen that movie before.",
      "They have just arrived."
    ],
    quiz: [
      { q: "They ___ in this city since 2019.", options: ["lived", "live", "have lived"], answer: "c" },
      { q: "I ___ never been to Japan.", options: ["have", "has", "had"], answer: "a" },
      { q: "She ___ finished her homework already.", options: ["has", "have", "had"], answer: "a" }
    ]
  },
  "past-simple": {
    label: "Past Simple",
    structure: "Subject + verb-ed (or irregular past form)",
    examples: [
      "She worked late yesterday.",
      "I visited my grandma last week.",
      "They went to Paris in 2020."
    ],
    quiz: [
      { q: "I ___ to the store yesterday.", options: ["go", "went", "gone"], answer: "b" },
      { q: "She ___ her keys this morning.", options: ["lost", "lose", "losing"], answer: "a" },
      { q: "We ___ a great time at the party.", options: ["have", "had", "has"], answer: "b" }
    ]
  },
  "past-continuous": {
    label: "Past Continuous",
    structure: "Subject + was/were + verb-ing",
    examples: [
      "She was working when I called.",
      "I was sleeping at midnight.",
      "They were talking when the teacher walked in."
    ],
    quiz: [
      { q: "While I ___ dinner, the phone rang.", options: ["was cooking", "cook", "will cook"], answer: "a" },
      { q: "It ___ raining when we left the house.", options: ["is", "was", "were"], answer: "b" },
      { q: "They ___ playing games all night.", options: ["was", "were", "are"], answer: "b" }
    ]
  },
  "past-perfect": {
    label: "Past Perfect",
    structure: "Subject + had + past participle",
    examples: [
      "She had worked there before she moved.",
      "By the time we arrived, the movie had started.",
      "I had never seen snow before that trip."
    ],
    quiz: [
      { q: "By the time we arrived, the movie ___ already started.", options: ["starts", "had started", "will start"], answer: "b" },
      { q: "She ___ finished the report before the meeting began.", options: ["has", "had", "have"], answer: "b" },
      { q: "I realized I ___ forgotten my phone.", options: ["have", "had", "has"], answer: "b" }
    ]
  },
  "future-simple": {
    label: "Future Simple",
    structure: "Subject + will + verb",
    examples: [
      "She will work tomorrow.",
      "I will call you later.",
      "They will travel to Japan next week."
    ],
    quiz: [
      { q: "Next week, we ___ to Japan.", options: ["travel", "will travel", "traveled"], answer: "b" },
      { q: "I think it ___ rain tomorrow.", options: ["will", "would", "is"], answer: "a" },
      { q: "She ___ be here soon.", options: ["will", "was", "is"], answer: "a" }
    ]
  },
  "future-continuous": {
    label: "Future Continuous",
    structure: "Subject + will be + verb-ing",
    examples: [
      "She will be working at noon.",
      "This time tomorrow, I will be flying to Rome.",
      "They will be waiting for us at the airport."
    ],
    quiz: [
      { q: "At 8pm tonight, I ___ dinner.", options: ["will cook", "will be cooking", "cooked"], answer: "b" },
      { q: "This time next week, we ___ on vacation.", options: ["will be", "will be being", "are"], answer: "a" },
      { q: "She ___ studying when you call.", options: ["will be", "will", "is"], answer: "a" }
    ]
  }
};

// ---------------------------------------------------------
// Helpers
// ---------------------------------------------------------

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// lib/firebaseclient.js loads Firebase from Google's CDN as a module. If
// that fails (no internet, or the config is still the placeholder), none
// of the window.firebase* helpers exist and pages would silently break.
// These two helpers show the reason on the page instead.
function firebaseNotLoaded() {
  return typeof window.onAuthReady !== "function";
}

function showFirebaseSetupError() {
  if (document.getElementById("firebaseSetupError")) return;
  const box = document.createElement("div");
  box.id = "firebaseSetupError";
  box.className = "setup-error";
  box.textContent =
    "Firebase could not load. Check your internet connection, and make sure " +
    "your own Firebase config is pasted into lib/firebaseclient.js (see README.md).";
  document.body.prepend(box);
}

// Now checks with Firebase instead of LocalStorage. Firebase takes a
// moment to report back, so this takes a callback instead of returning
// true/false right away - run() only fires once we actually know.
function requireLogin(run) {
  if (firebaseNotLoaded()) {
    showFirebaseSetupError();
    return;
  }
  window.onAuthReady(function (user) {
    if (!user) {
      window.location.href = "index.html";
    } else {
      run(user);
    }
  });
}

function setupHeader(user) {
  const welcomeMsg = document.getElementById("welcomeMsg");
  const logoutBtn = document.getElementById("logoutBtn");

  if (welcomeMsg) {
    welcomeMsg.textContent = "Hi, " + user.email;
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      window.firebaseLogout().then(function () {
        window.location.href = "index.html";
      });
    });
  }
}

// ---------------------------------------------------------
// LOGIN PAGE (index.html)
// ---------------------------------------------------------

const loginFormEl = document.getElementById("loginForm");

if (loginFormEl) {
  loginFormEl.addEventListener("submit", function (e) {
    e.preventDefault();

    if (typeof window.firebaseLogin !== "function") {
      document.getElementById("loginError").textContent =
        "Firebase could not load - check your internet and the config in lib/firebaseclient.js.";
      return;
    }

    const email = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("loginError");
    errorMsg.textContent = "";

    window.firebaseLogin(email, password)
      .then(function () {
        window.location.href = "home.html";
      })
      .catch(function (err) {
        if (err && err.code === "auth/too-many-requests") {
          errorMsg.textContent = "Too many attempts. Wait a minute and try again.";
        } else if (err && err.code === "auth/network-request-failed") {
          errorMsg.textContent = "No internet connection, try again.";
        } else if (err && typeof err.code === "string" && err.code.indexOf("api-key") !== -1) {
          errorMsg.textContent = "Firebase is not set up yet - see README.md, section 1.";
        } else {
          errorMsg.textContent = "Wrong email or password, try again.";
        }
      });
  });
}

// ---------------------------------------------------------
// SIGN UP PAGE (signup.html)
// ---------------------------------------------------------

const signupFormEl = document.getElementById("signupForm");

if (signupFormEl) {
  signupFormEl.addEventListener("submit", function (e) {
    e.preventDefault();

    if (typeof window.firebaseSignup !== "function") {
      document.getElementById("signupError").textContent =
        "Firebase could not load - check your internet and the config in lib/firebaseclient.js.";
      return;
    }

    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirm = document.getElementById("signupPasswordConfirm").value;
    const errorMsg = document.getElementById("signupError");
    errorMsg.textContent = "";

    if (password.length < 6) {
      errorMsg.textContent = "Password needs to be at least 6 characters.";
      return;
    }

    if (password !== confirm) {
      errorMsg.textContent = "Passwords don't match.";
      return;
    }

    window.firebaseSignup(email, password)
      .then(function () {
        window.location.href = "home.html";
      })
      .catch(function (err) {
        if (err.code === "auth/email-already-in-use") {
          errorMsg.textContent = "That email already has an account. Try logging in instead.";
        } else if (err.code === "auth/invalid-email") {
          errorMsg.textContent = "That email address doesn't look right.";
        } else if (err.code === "auth/network-request-failed") {
          errorMsg.textContent = "No internet connection, try again.";
        } else if (typeof err.code === "string" && err.code.indexOf("api-key") !== -1) {
          errorMsg.textContent = "Firebase is not set up yet - see README.md, section 1.";
        } else {
          errorMsg.textContent = "Could not create account, please try again.";
        }
      });
  });
}

// ---------------------------------------------------------
// HOME PAGE (home.html) - grid of tense cards
// ---------------------------------------------------------

const tenseGridEl = document.getElementById("tenseGrid");

if (tenseGridEl) {
  requireLogin(function (user) {
    setupHeader(user);

    Object.keys(tenseData).forEach(function (key) {
      const tense = tenseData[key];
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML =
        "<h3>" + tense.label + "</h3>" +
        '<p class="structure">' + tense.structure + "</p>" +
        '<div class="card-actions">' +
        '<a href="tense.html?t=' + key + '" class="btn-small">Learn</a>' +
        '<a href="quiz.html?t=' + key + '" class="btn-small">Quiz</a>' +
        "</div>";
      tenseGridEl.appendChild(card);
    });
  });
}

// ---------------------------------------------------------
// LEARN PAGE (tense.html)
// ---------------------------------------------------------

const tenseTitleEl = document.getElementById("tenseTitle");

if (tenseTitleEl) {
  requireLogin(function (user) {
    setupHeader(user);

    const key = getQueryParam("t");
    const tense = tenseData[key];

    if (!tense) {
      tenseTitleEl.textContent = "Tense not found";
    } else {
      tenseTitleEl.textContent = tense.label;
      document.getElementById("tenseStructure").textContent = tense.structure;

      const examplesBox = document.getElementById("tenseExamples");
      tense.examples.forEach(function (sentence) {
        const p = document.createElement("p");
        p.className = "example";
        p.textContent = sentence;
        examplesBox.appendChild(p);
      });

      document.getElementById("quizLink").href = "quiz.html?t=" + key;
    }
  });
}

// ---------------------------------------------------------
// QUIZ PAGE (quiz.html)
// ---------------------------------------------------------

const quizBox = document.getElementById("quiz");

if (quizBox) {
  requireLogin(function (user) {
    setupHeader(user);

    const key = getQueryParam("t");
    const tense = tenseData[key];
    const quizTitle = document.getElementById("quizTitle");

    if (!tense) {
      quizTitle.textContent = "Tense not found";
    } else {
      quizTitle.textContent = tense.label + " Quiz";

      tense.quiz.forEach(function (item, qIndex) {
        const qDiv = document.createElement("div");
        qDiv.className = "quiz-q";
        qDiv.dataset.answer = item.answer;

        const qText = document.createElement("p");
        qText.textContent = (qIndex + 1) + ". " + item.q;
        qDiv.appendChild(qText);

        item.options.forEach(function (optText, optIndex) {
          const letter = String.fromCharCode(97 + optIndex);
          const btn = document.createElement("button");
          btn.className = "opt";
          btn.textContent = letter + ") " + optText;
          btn.addEventListener("click", function () {
            qDiv.querySelectorAll(".opt").forEach(function (o) {
              o.classList.remove("selected");
            });
            btn.classList.add("selected");
          });
          qDiv.appendChild(btn);
        });

        quizBox.appendChild(qDiv);
      });

      document.getElementById("checkBtn").addEventListener("click", function () {
        let score = 0;
        const questions = quizBox.querySelectorAll(".quiz-q");

        questions.forEach(function (q) {
          const answer = q.dataset.answer;
          const options = q.querySelectorAll(".opt");
          const selected = q.querySelector(".opt.selected");

          options.forEach(function (opt, index) {
            const letter = String.fromCharCode(97 + index);
            opt.classList.remove("correct", "incorrect");
            if (letter === answer) {
              opt.classList.add("correct");
            } else if (opt === selected) {
              opt.classList.add("incorrect");
            }
          });

          if (selected) {
            const selectedIndex = Array.from(options).indexOf(selected);
            const selectedLetter = String.fromCharCode(97 + selectedIndex);
            if (selectedLetter === answer) score++;
          }
        });

        const scoreEl = document.getElementById("score");
        scoreEl.textContent =
          "You got " + score + " out of " + questions.length + " correct.";

        window.saveQuizScore(key, tense.label, score, questions.length)
          .then(function () {
            scoreEl.textContent += " (saved to your history)";
          })
          .catch(function () {
            scoreEl.textContent += " (could not save to history)";
          });
      });
    }
  });
}

// ---------------------------------------------------------
// HISTORY PAGE (history.html) - past quiz attempts
// ---------------------------------------------------------

const historyListEl = document.getElementById("historyList");

if (historyListEl) {
  requireLogin(function (user) {
    setupHeader(user);

    window.getQuizHistory()
      .then(function (attempts) {
        if (attempts.length === 0) {
          historyListEl.innerHTML = "<p>No quiz attempts yet. Go take a quiz!</p>";
          return;
        }

        attempts.forEach(function (attempt) {
          const row = document.createElement("div");
          row.className = "history-row";

          const when = attempt.createdAt && attempt.createdAt.toDate
            ? attempt.createdAt.toDate().toLocaleString()
            : "Just now";

          row.innerHTML =
            '<span class="history-tense">' + attempt.tenseLabel + "</span>" +
            '<span class="history-score">' + attempt.score + " / " + attempt.total + "</span>" +
            '<span class="history-date">' + when + "</span>";

          historyListEl.appendChild(row);
        });
      })
      .catch(function () {
        historyListEl.innerHTML = "<p>Could not load your history right now.</p>";
      });
  });
}

// ---------------------------------------------------------
// ABOUT / CONTACT PAGES - just need header + login check
// ---------------------------------------------------------

if (document.body && !loginFormEl && !tenseGridEl && !tenseTitleEl && !quizBox && !historyListEl) {
  if (document.getElementById("welcomeMsg")) {
    requireLogin(function (user) {
      setupHeader(user);
    });
  }
}

// contact form (demo only, does not send anywhere)
const contactFormEl = document.getElementById("contactForm");

if (contactFormEl) {
  contactFormEl.addEventListener("submit", function (e) {
    e.preventDefault();
    document.getElementById("contactMsg").textContent =
      "Thanks, we will get back to you soon.";
  });
}
