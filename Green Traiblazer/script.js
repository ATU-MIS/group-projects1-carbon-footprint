document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("loginForm")) initLoginPage();
  if (document.getElementById("registerForm")) initRegisterPage();
  if (document.getElementById("user-welcome")) initDashboardPage();
  if (document.getElementById("calculationForm")) initCalculator();
  if (document.getElementById("score-display")) initResultPage();
  if (document.getElementById("inputName")) initProfilePage();
  if (document.getElementById("admin-panel-identifier")) initAdminPanel();
});

function initRegisterPage() {
  const btn = document.getElementById("btnKayitOl");
  const form = document.getElementById("registerForm");
  const handleRegister = (e) => {
    e.preventDefault();
    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPass").value.trim();
    if (!name || !email || !password) {
      alert("Lütfen boş alan bırakmayın.");
      return;
    }
    const userData = { name, password, job: "Öğrenci", target: 5.5 };
    localStorage.setItem("user_" + email, JSON.stringify(userData));
    alert("✅ Kayıt başarılı! Giriş yapabilirsiniz.");
    window.location.href = "login.html";
  };
  if (btn) btn.addEventListener("click", handleRegister);
  if (form) form.addEventListener("submit", handleRegister);
}

function initLoginPage() {
  const btn = document.getElementById("btnLogin");
  const form = document.getElementById("loginForm");
  const handleLogin = (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("email");
    const passInput = document.getElementById("password");
    const email = emailInput.value.trim();
    const password = passInput.value.trim();

    if (email === "admin@gmail.com" && password === "gülcevecennet") {
      window.location.href = "admin.html";
      return;
    }
    const storedUser = localStorage.getItem("user_" + email);
    if (!storedUser) {
      alert("❌ Kayıtlı kullanıcı bulunamadı.");
      return;
    }
    const user = JSON.parse(storedUser);
    if (user.password === password) {
      localStorage.setItem("activeUserName", user.name);
      localStorage.setItem("activeUserEmail", email);
      window.location.href = "dashboard.html";
    } else {
      alert("❌ Şifre hatalı!");
    }
  };
  if (btn) btn.addEventListener("click", handleLogin);
  if (form) form.addEventListener("submit", handleLogin);
}

function initDashboardPage() {
  const name = localStorage.getItem("activeUserName");
  const email = localStorage.getItem("activeUserEmail");
  if (!email) {
    window.location.href = "login.html";
    return;
  }

  const nameEl = document.getElementById("user-welcome");
  const navNameEl = document.getElementById("nav-username");
  const scoreEl = document.getElementById("dashboard-score");
  if (nameEl) nameEl.innerText = name;
  if (navNameEl) navNameEl.innerText = name;

  const historyTable = document.getElementById("history-table");
  const fullHistory = JSON.parse(localStorage.getItem("appHistory") || "[]");
  const myHistory = fullHistory.filter((item) => item.email === email);

  if (myHistory.length > 0) {
    if (scoreEl) scoreEl.innerText = myHistory[myHistory.length - 1].total;
  } else {
    if (scoreEl) scoreEl.innerText = "--";
  }

  if (historyTable) {
    historyTable.innerHTML = "";
    if (myHistory.length === 0) {
      historyTable.innerHTML = `<tr><td colspan="3" class="p-4 text-center text-gray-500">Hesaplama yok.</td></tr>`;
    } else {
      myHistory
        .slice()
        .reverse()
        .forEach((record) => {
          historyTable.innerHTML += `<tr class="border-b hover:bg-gray-50"><td class="py-3 px-4">${record.date}</td><td class="py-3 px-4 font-bold text-gray-800">${record.total} Ton</td><td class="py-3 px-4 text-green-600 text-xs font-semibold">Tamamlandı</td></tr>`;
        });
    }
  }
  const goalInput = document.getElementById("new-goal-input");
  const addGoalBtn = document.getElementById("add-goal-btn");
  const goalList = document.getElementById("goal-list");
  const renderGoals = () => {
    const myGoals = JSON.parse(localStorage.getItem("goals_" + email) || "[]");
    if (goalList) {
      goalList.innerHTML = "";
      myGoals.forEach((goal, index) => {
        goalList.innerHTML += `<li class="flex justify-between items-center bg-gray-50 p-2 rounded text-sm mb-1 group"><span class="truncate mr-2"><i class="fas fa-check text-carbon-blue mr-1"></i>${goal}</span><button onclick="deleteGoal(${index})" class="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"><i class="fas fa-trash"></i></button></li>`;
      });
      if (myGoals.length === 0)
        goalList.innerHTML = `<li class="text-center text-gray-400 text-xs italic mt-2">Hedef yok.</li>`;
    }
  };
  const addGoal = () => {
    const text = goalInput.value.trim();
    if (!text) return;
    const myGoals = JSON.parse(localStorage.getItem("goals_" + email) || "[]");
    myGoals.push(text);
    localStorage.setItem("goals_" + email, JSON.stringify(myGoals));
    goalInput.value = "";
    renderGoals();
  };
  if (addGoalBtn) addGoalBtn.onclick = addGoal;
  if (goalInput)
    goalInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addGoal();
      }
    });
  if (goalList) renderGoals();

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn)
    logoutBtn.onclick = (e) => {
      e.preventDefault();
      localStorage.removeItem("activeUserName");
      localStorage.removeItem("activeUserEmail");
      window.location.href = "index.html";
    };
}
function deleteGoal(index) {
  const email = localStorage.getItem("activeUserEmail");
  const myGoals = JSON.parse(localStorage.getItem("goals_" + email) || "[]");
  myGoals.splice(index, 1);
  localStorage.setItem("goals_" + email, JSON.stringify(myGoals));
  location.reload();
}

function initProfilePage() {
  const email = localStorage.getItem("activeUserEmail");
  if (!email) {
    window.location.href = "login.html";
    return;
  }
  let user = JSON.parse(localStorage.getItem("user_" + email) || "{}");
  const inputs = {
    name: document.getElementById("inputName"),
    job: document.getElementById("inputJob"),
    email: document.getElementById("inputEmail"),
    target: document.getElementById("inputTarget"),
  };
  if (inputs.name) inputs.name.value = user.name || "";
  if (inputs.job) inputs.job.value = user.job || "";
  if (inputs.email) inputs.email.value = email;
  if (inputs.target) inputs.target.value = user.target || 5.5;

  document.getElementById("nav-fullname").innerText = user.name || "Kullanıcı";
  document.getElementById("card-name").innerText = user.name || "Kullanıcı";
  document.getElementById("card-job").innerText = user.job || "Üye";

  const btnInfo = document.getElementById("btnSaveInfo");
  if (btnInfo)
    btnInfo.addEventListener("click", () => {
      user.name = inputs.name.value;
      user.job = inputs.job.value;
      localStorage.setItem("user_" + email, JSON.stringify(user));
      localStorage.setItem("activeUserName", user.name);
      alert("✅ Güncellendi!");
      location.reload();
    });

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn)
    logoutBtn.onclick = (e) => {
      e.preventDefault();
      localStorage.removeItem("activeUserName");
      localStorage.removeItem("activeUserEmail");
      window.location.href = "index.html";
    };
}

function initAdminPanel() {
  console.log("Admin Başlatıldı...");
  updateDashboardStats();

  const logoutBtn = document.getElementById("adminLogoutBtn");
  if (logoutBtn)
    logoutBtn.onclick = () => {
      window.location.href = "login.html";
    };
}

function switchSection(sectionId) {
  document.getElementById("section-dashboard").style.display = "none";
  document.getElementById("section-users").style.display = "none";
  document.getElementById("section-reports").style.display = "none";

  document.getElementById("menu-dashboard").classList.remove("active");
  document.getElementById("menu-users").classList.remove("active");
  document.getElementById("menu-reports").classList.remove("active");

  document.getElementById("section-" + sectionId).style.display = "block";
  document.getElementById("menu-" + sectionId).classList.add("active");

  const titles = {
    dashboard: "Genel Bakış",
    users: "Kullanıcı Yönetimi",
    reports: "Sistem Raporları",
  };
  document.getElementById("page-title").innerText = titles[sectionId];

  if (sectionId === "dashboard") updateDashboardStats();
  if (sectionId === "users") renderAllUsers();
  if (sectionId === "reports") renderAllReports();
}

function updateDashboardStats() {
  const history = JSON.parse(localStorage.getItem("appHistory") || "[]");
  const uniqueUsers = new Set(history.map((item) => item.email));

  let totalCO2 = 0;
  history.forEach((item) => (totalCO2 += parseFloat(item.total)));
  const avgCO2 =
    history.length > 0 ? (totalCO2 / history.length).toFixed(1) : 0;

  document.getElementById("admin-total-users").innerText =
    uniqueUsers.size || 0;
  document.getElementById("admin-total-co2").innerText =
    totalCO2.toFixed(1) + " Ton";
  document.getElementById("admin-avg-co2").innerText = avgCO2 + " Ton";

  const tableBody = document.getElementById("admin-history-table");
  tableBody.innerHTML = "";
  history
    .slice()
    .reverse()
    .slice(0, 5)
    .forEach((item) => {
      const userData = JSON.parse(
        localStorage.getItem("user_" + item.email) || "{}"
      );
      const name = userData.name || item.email;
      const initials = name.substring(0, 2).toUpperCase();
      let badge = parseFloat(item.total) > 6.3 ? "bg-danger" : "bg-success";
      let status = parseFloat(item.total) > 6.3 ? "Yüksek" : "Düşük";

      tableBody.innerHTML += `
        <tr>
            <td><div class="user-cell"><div class="user-avatar">${initials}</div><div><div style="font-weight:600;">${name}</div><div style="font-size:11px; color:#999;">${item.email}</div></div></div></td>
            <td>${item.date}</td>
            <td style="font-weight:bold;">${item.total} Ton</td>
            <td><span class="badge ${badge}">${status}</span></td>
        </tr>`;
    });

  const riskyList = document.getElementById("risky-users-list");
  riskyList.innerHTML = "";
  const risky = history.filter((item) => parseFloat(item.total) > 8.0);
  if (risky.length === 0)
    riskyList.innerHTML = `<p style="text-align:center; color:#999;">Risk yok.</p>`;
  else {
    risky
      .slice()
      .reverse()
      .slice(0, 3)
      .forEach((item) => {
        const uData = JSON.parse(
          localStorage.getItem("user_" + item.email) || "{}"
        );
        riskyList.innerHTML += `<div class="alert-item"><div class="alert-text"><h4>${
          uData.name || "Üye"
        }</h4><p>Kritik: <strong>${item.total} Ton</strong></p></div></div>`;
      });
  }
}

function renderAllUsers() {
  const tableBody = document.getElementById("all-users-table");
  tableBody.innerHTML = "";
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("user_")) {
      const email = key.replace("user_", "");
      const user = JSON.parse(localStorage.getItem(key));
      const initials = user.name
        ? user.name.substring(0, 2).toUpperCase()
        : "US";

      tableBody.innerHTML += `
            <tr>
                <td><div class="user-avatar" style="background:#3b82f6; color:white;">${initials}</div></td>
                <td style="font-weight:bold;">${user.name}</td>
                <td>${email}</td>
                <td>${user.job || "Belirtilmemiş"}</td>
                <td>${user.target || 5.5} Ton</td>
            </tr>`;
    }
  }
}

function renderAllReports() {
  const tableBody = document.getElementById("all-reports-table");
  tableBody.innerHTML = "";
  const history = JSON.parse(localStorage.getItem("appHistory") || "[]");

  history
    .slice()
    .reverse()
    .forEach((item) => {
      const userData = JSON.parse(
        localStorage.getItem("user_" + item.email) || "{}"
      );

      const details = item.details || { transport: 0, energy: 0, food: 0 };

      tableBody.innerHTML += `
        <tr>
            <td>${item.date}</td>
            <td style="font-weight:bold;">${userData.name || item.email}</td>
            <td>${
              typeof details.transport === "number"
                ? details.transport.toFixed(2)
                : details.transport
            }</td>
            <td>${
              typeof details.energy === "number"
                ? details.energy.toFixed(2)
                : details.energy
            }</td>
            <td>${
              typeof details.food === "number"
                ? details.food.toFixed(2)
                : details.food
            }</td>
            <td style="color:${
              parseFloat(item.total) > 6.3 ? "red" : "green"
            }; font-weight:bold;">${item.total} Ton</td>
        </tr>`;
    });
}

function initCalculator() {
  let currentStep = 1;
  const totalSteps = 4;
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const progressBar = document.getElementById("progress-bar");
  const stepNumber = document.getElementById("step-number");
  function showStep(step) {
    for (let i = 1; i <= totalSteps; i++) {
      const el = document.getElementById("step" + i);
      if (el) {
        i === step ? el.classList.add("active") : el.classList.remove("active");
      }
    }
    if (stepNumber) stepNumber.innerText = step;
    if (progressBar) progressBar.style.width = (step / totalSteps) * 100 + "%";
    if (prevBtn) prevBtn.classList.toggle("hidden", step === 1);
    if (nextBtn) {
      step === totalSteps
        ? (nextBtn.innerHTML = 'HESAPLA <i class="fas fa-calculator ml-2"></i>')
        : (nextBtn.innerHTML = 'İleri <i class="fas fa-arrow-right ml-2"></i>');
    }
  }
  if (nextBtn)
    nextBtn.addEventListener("click", function (e) {
      e.preventDefault();
      currentStep < totalSteps
        ? (currentStep++, showStep(currentStep))
        : calculateFinalResult();
    });
  if (prevBtn)
    prevBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
      }
    });
  showStep(currentStep);
}
function calculateFinalResult() {
  const val = (id) => parseFloat(document.getElementById(id)?.value) || 0;
  const transport =
    (val("transport_car") * 52 * 0.2 + val("transport_public") * 52 * 0.05) /
    1000;
  let energy = val("electricity") * 12 * 0.5;
  const renew = document.getElementById("renewable")?.value || "no";
  if (renew === "yes") energy *= 0.1;
  if (renew === "partial") energy *= 0.7;
  energy = (energy + val("water_bill") * 12 * 0.5) / 1000;
  let foodVal = 1800;
  const foodType =
    document.querySelector('input[name="food"]:checked')?.value || "mixed";
  if (foodType === "meat") foodVal = 2500;
  if (foodType === "vegetarian") foodVal = 1200;
  if (foodType === "vegan") foodVal = 800;
  const food = foodVal / 1000;
  const total = (transport + energy + food).toFixed(2);

  const activeEmail = localStorage.getItem("activeUserEmail");
  if (activeEmail) {
    const history = JSON.parse(localStorage.getItem("appHistory") || "[]");
    const newRecord = {
      email: activeEmail,
      date: new Date().toLocaleDateString("tr-TR"),
      total: total,
      details: { transport, energy, food },
    };
    history.push(newRecord);
    localStorage.setItem("appHistory", JSON.stringify(history));
  }
  localStorage.setItem(
    "carbonData",
    JSON.stringify({
      total,
      transport: transport.toFixed(2),
      energy: energy.toFixed(2),
      food: food.toFixed(2),
    })
  );
  window.location.href = "result.html";
}
function initResultPage() {
  const data = JSON.parse(localStorage.getItem("carbonData") || "{}");
  const scoreEl = document.getElementById("score-display");
  if (scoreEl) scoreEl.innerText = data.total || "0";
  const total = parseFloat(data.total) || 1;
  const setBar = (id, val) => {
    const el = document.getElementById(id.replace("val", "bar"));
    const txt = document.getElementById(id);
    if (el && txt) {
      setTimeout(() => (el.style.width = (val / total) * 100 + "%"), 100);
      txt.innerText = val + " Ton";
    }
  };
  setBar("val-transport", parseFloat(data.transport));
  setBar("val-energy", parseFloat(data.energy));
  setBar("val-food", parseFloat(data.food));

  const badge = document.getElementById("comparison-badge");
  if (badge) {
    if (parseFloat(data.total) <= 6.3) {
      badge.className =
        "bg-green-50 border-l-4 border-eco-green rounded-r-lg py-3 px-4 mb-8 flex items-center shadow-sm";
      document.getElementById("comparison-title").innerText = "Harika!";
    } else {
      badge.className =
        "bg-red-50 border-l-4 border-alert-red rounded-r-lg py-3 px-4 mb-8 flex items-center shadow-sm";
      document.getElementById("comparison-title").innerText = "Dikkat!";
      document.getElementById("comparison-icon").className =
        "fas fa-exclamation-triangle text-2xl text-alert-red mr-4";
    }
  }
}
