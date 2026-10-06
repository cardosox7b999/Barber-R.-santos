/* =====================================================
   BARBER R.SANTOS
   SCRIPT.JS
===================================================== */


/* =========================
   VARIÁVEIS
========================= */

let authMode = "login";

let booking = {
    service: null,
    price: 0,
    barber: null,
    date: null,
    time: null
};

let calendarDate = new Date();

const MONTHS = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
];

const TIMES = [
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00"
];


/* =========================
   DOM
========================= */

const header = document.getElementById("header");
const menuButton = document.getElementById("menuButton");
const nav = document.getElementById("nav");

const authModal = document.getElementById("authModal");
const bookingModal = document.getElementById("bookingModal");
const successModal = document.getElementById("successModal");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");


/* =========================
   HEADER SCROLL
========================= */

window.addEventListener("scroll", () => {

    if (window.scrollY > 30) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

});


/* =========================
   MENU MOBILE
========================= */

menuButton.addEventListener("click", () => {

    nav.classList.toggle("open");

    const icon = menuButton.querySelector("i");

    if (nav.classList.contains("open")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
    } else {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    }

});


document.querySelectorAll(".nav-link").forEach(link => {

    link.addEventListener("click", () => {

        nav.classList.remove("open");

        const icon = menuButton.querySelector("i");

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    });

});


/* =========================
   NAVEGAÇÃO ATIVA
========================= */

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {
            current = section.getAttribute("id");
        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === `#${current}`) {
            link.classList.add("active");
        }

    });

});


/* =========================
   AUTH
========================= */

function openAuth() {

    authModal.classList.add("active");
    document.body.style.overflow = "hidden";

}


function closeAuth() {

    authModal.classList.remove("active");
    document.body.style.overflow = "";

}


function toggleAuthMode() {

    authMode = authMode === "login" ? "register" : "login";

    const title = document.getElementById("authTitle");
    const subtitle = document.getElementById("authSubtitle");
    const submit = document.getElementById("authSubmitText");
    const switchText = document.getElementById("authSwitchText");
    const switchButton = document.getElementById("authSwitchButton");

    const registerFields = document.querySelectorAll(".register-field");

    if (authMode === "register") {

        title.textContent = "Criar uma conta";
        subtitle.textContent = "Cadastre-se para acompanhar seus horários.";
        submit.textContent = "Criar conta";
        switchText.textContent = "Já possui uma conta?";
        switchButton.textContent = "Entrar";

        registerFields.forEach(field => {
            field.classList.remove("hidden");
        });

    } else {

        title.textContent = "Entrar na conta";
        subtitle.textContent = "Acesse seus agendamentos.";
        submit.textContent = "Entrar";
        switchText.textContent = "Ainda não possui uma conta?";
        switchButton.textContent = "Criar conta";

        registerFields.forEach(field => {
            field.classList.add("hidden");
        });

    }

}


function togglePassword() {

    const input = document.getElementById("authPassword");
    const icon = document.querySelector(".password-toggle i");

    if (input.type === "password") {

        input.type = "text";

        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");

    } else {

        input.type = "password";

        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");

    }

}


document.getElementById("authForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const email = document.getElementById("authEmail").value.trim();
    const password = document.getElementById("authPassword").value.trim();

    if (!email || !password) {

        showToast("Preencha todos os campos.");

        return;
    }


    if (authMode === "register") {

        const name = document.getElementById("registerName").value.trim();
        const phone = document.getElementById("registerPhone").value.trim();

        if (!name) {
            showToast("Digite seu nome.");
            return;
        }

        const user = {
            name,
            email,
            phone,
            createdAt: new Date().toISOString()
        };

        localStorage.setItem("barberUser", JSON.stringify(user));

        showToast("Conta criada com sucesso!");

        setTimeout(() => {
            closeAuth();
        }, 800);

    } else {

        const savedUser = localStorage.getItem("barberUser");

        if (savedUser) {

            const user = JSON.parse(savedUser);

            if (user.email === email) {

                showToast(`Bem-vindo, ${user.name}!`);

                setTimeout(() => {
                    closeAuth();
                }, 800);

            } else {

                showToast("E-mail não encontrado.");

            }

        } else {

            showToast("Crie uma conta primeiro.");

        }

    }

});


/* =========================
   BOOKING
========================= */

function openBooking() {

    bookingModal.classList.add("active");

    document.body.style.overflow = "hidden";

    resetBooking();

    renderCalendar();

}


function closeBooking() {

    bookingModal.classList.remove("active");

    document.body.style.overflow = "";

}


function resetBooking() {

    booking = {
        service: null,
        price: 0,
        barber: null,
        date: null,
        time: null
    };

    document.querySelectorAll(".booking-page").forEach(page => {
        page.classList.remove("active");
    });

    document.getElementById("bookingStep1").classList.add("active");

    document.querySelectorAll(".booking-option").forEach(option => {
        option.classList.remove("selected");
    });

    document.querySelectorAll(".mini-barber").forEach(barber => {
        barber.classList.remove("selected");
    });

    updateBookingSteps();

    updateSummary();

}


function selectService(name, price) {

    booking.service = name;
    booking.price = price;

    openBooking();

    const options = document.querySelectorAll(".booking-option");

    options.forEach(option => {

        if (option.dataset.service === name) {
            option.classList.add("selected");
        }

    });

}


function selectBarber(name) {

    openBooking();

    booking.barber = name;

    nextBookingStep(2);

    document.querySelectorAll(".mini-barber").forEach(button => {

        button.classList.remove("selected");

        if (button.textContent.includes(name)) {
            button.classList.add("selected");
        }

    });

}


function chooseBookingService(element) {

    document.querySelectorAll(".booking-option").forEach(option => {
        option.classList.remove("selected");
    });

    element.classList.add("selected");

    booking.service = element.dataset.service;
    booking.price = Number(element.dataset.price);

    updateSummary();

}


function chooseBookingBarber(element, name) {

    document.querySelectorAll(".mini-barber").forEach(button => {
        button.classList.remove("selected");
    });

    element.classList.add("selected");

    booking.barber = name;

    updateSummary();

}


function nextBookingStep(step) {

    if (step === 2 && !booking.service) {

        showToast("Escolha um serviço primeiro.");
        return;

    }

    if (step === 3 && !booking.barber) {

        showToast("Escolha um barbeiro primeiro.");
        return;

    }

    document.querySelectorAll(".booking-page").forEach(page => {
        page.classList.remove("active");
    });

    document.getElementById(`bookingStep${step}`).classList.add("active");

    updateBookingSteps();

    if (step === 3) {
        renderCalendar();
    }

}


function updateBookingSteps() {

    const steps = document.querySelectorAll(".booking-step");

    steps.forEach((step, index) => {

        step.classList.toggle(
            "active",
            index + 1 <= getCurrentBookingStep()
        );

    });

}


function getCurrentBookingStep() {

    const active = document.querySelector(".booking-page.active");

    if (!active) {
        return 1;
    }

    return Number(active.id.replace("bookingStep", ""));

}


/* =========================
   CALENDÁRIO
========================= */

function renderCalendar() {

    const calendar = document.getElementById("calendar");
    const monthTitle = document.getElementById("calendarMonth");

    calendar.innerHTML = "";

    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    monthTitle.textContent = `${MONTHS[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();

    const daysInMonth = new Date(
        year,
        month + 1,
        0
    ).getDate();

    const today = new Date();

    for (let i = 0; i < firstDay; i++) {

        const empty = document.createElement("div");

        calendar.appendChild(empty);

    }


    for (let day = 1; day <= daysInMonth; day++) {

        const button = document.createElement("button");

        button.className = "calendar-day";
        button.textContent = day;

        const currentDate = new Date(
            year,
            month,
            day
        );

        currentDate.setHours(0, 0, 0, 0);

        const todayClean = new Date();

        todayClean.setHours(0, 0, 0, 0);


        if (
            currentDate.getTime() === todayClean.getTime()
        ) {

            button.classList.add("today");

        }


        if (currentDate < todayClean) {

            button.classList.add("disabled");
            button.disabled = true;

        } else {

            button.addEventListener("click", () => {

                selectCalendarDay(
                    year,
                    month,
                    day,
                    button
                );

            });

        }


        if (
            booking.date &&
            booking.date.getFullYear() === year &&
            booking.date.getMonth() === month &&
            booking.date.getDate() === day
        ) {

            button.classList.add("selected");

        }

        calendar.appendChild(button);

    }

    renderTimes();

}


function selectCalendarDay(year, month, day, button) {

    document.querySelectorAll(".calendar-day").forEach(dayButton => {
        dayButton.classList.remove("selected");
    });

    button.classList.add("selected");

    booking.date = new Date(year, month, day);

    booking.time = null;

    updateSummary();

    renderTimes();

}


function changeMonth(direction) {

    calendarDate.setMonth(
        calendarDate.getMonth() + direction
    );

    renderCalendar();

}


function renderTimes() {

    const grid = document.getElementById("timeGrid");

    grid.innerHTML = "";

    TIMES.forEach(time => {

        const button = document.createElement("button");

        button.textContent = time;


        const occupied = isTimeOccupied(
            booking.date,
            time,
            booking.barber
        );


        if (occupied) {

            button.classList.add("occupied");
            button.disabled = true;

        } else {

            button.addEventListener("click", () => {

                document
                    .querySelectorAll(".time-grid button")
                    .forEach(btn => btn.classList.remove("selected"));

                button.classList.add("selected");

                booking.time = time;

                updateSummary();

            });

        }


        if (booking.time === time) {
            button.classList.add("selected");
        }

        grid.appendChild(button);

    });

}


function isTimeOccupied(date, time, barber) {

    if (!date || !barber) {
        return false;
    }

    const appointments = JSON.parse(
        localStorage.getItem("barberAppointments") || "[]"
    );

    const dateString = formatDateForStorage(date);

    return appointments.some(appointment => {

        return (
            appointment.date === dateString &&
            appointment.time === time &&
            appointment.barber === barber
        );

    });

}


/* =========================
   SUMMARY
========================= */

function updateSummary() {

    document.getElementById("summaryService").textContent =
        booking.service || "-";

    document.getElementById("summaryBarber").textContent =
        booking.barber || "-";

    document.getElementById("summaryDate").textContent =
        booking.date
            ? formatDate(booking.date)
            : "-";

    document.getElementById("summaryTime").textContent =
        booking.time || "-";

    document.getElementById("summaryPrice").textContent =
        formatMoney(booking.price);

}


/* =========================
   CONFIRMAR AGENDAMENTO
========================= */

function confirmBooking() {

    if (!booking.service) {

        showToast("Escolha um serviço.");
        return;

    }

    if (!booking.barber) {

        showToast("Escolha um barbeiro.");
        return;

    }

    if (!booking.date) {

        showToast("Escolha uma data.");
        return;

    }

    if (!booking.time) {

        showToast("Escolha um horário.");
        return;

    }


    const appointments = JSON.parse(
        localStorage.getItem("barberAppointments") || "[]"
    );


    const exists = appointments.some(appointment => {

        return (
            appointment.date === formatDateForStorage(booking.date) &&
            appointment.time === booking.time &&
            appointment.barber === booking.barber
        );

    });


    if (exists) {

        showToast("Esse horário acabou de ser ocupado.");
        renderTimes();

        return;

    }


    const code =
        "BR-" +
        Math.floor(100000 + Math.random() * 900000);


    const appointment = {

        id: code,

        service: booking.service,

        price: booking.price,

        barber: booking.barber,

        date: formatDateForStorage(booking.date),

        time: booking.time,

        createdAt: new Date().toISOString()

    };


    appointments.push(appointment);

    localStorage.setItem(
        "barberAppointments",
        JSON.stringify(appointments)
    );


    document.getElementById("appointmentCode").textContent = code;


    closeBooking();

    successModal.classList.add("active");

    document.body.style.overflow = "hidden";

}


function closeSuccess() {

    successModal.classList.remove("active");

    document.body.style.overflow = "";

}


/* =========================
   FORMATAÇÃO
========================= */

function formatDate(date) {

    if (!date) {
        return "-";
    }

    return date.toLocaleDateString(
        "pt-BR",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}


function formatDateForStorage(date) {

    if (!date) {
        return "";
    }

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


function formatMoney(value) {

    return new Intl.NumberFormat(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    ).format(value || 0);

}


/* =========================
   TOAST
========================= */

let toastTimer;

function showToast(message) {

    toastMessage.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


/* =========================
   ESC FECHA MODAIS
========================= */

document.addEventListener("keydown", event => {

    if (event.key !== "Escape") {
        return;
    }

    closeAuth();
    closeBooking();
    closeSuccess();

});


/* =========================
   CLIQUE FORA DO MODAL
========================= */

[authModal, bookingModal, successModal].forEach(modal => {

    modal.addEventListener("click", event => {

        if (event.target === modal) {

            modal.classList.remove("active");

            document.body.style.overflow = "";

        }

    });

});


/* =========================
   REVEAL ANIMATION
========================= */

const revealElements = document.querySelectorAll(
    ".service-card, .barber-card, .contact-card, .about-content, .about-images"
);

const observer = new IntersectionObserver(
    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

            }

        });

    },
    {
        threshold: 0.12
    }
);


revealElements.forEach(element => {

    element.classList.add("reveal");

    observer.observe(element);

});


/* =========================
   FECHAR MODAL AO REDIRECIONAR
========================= */

window.addEventListener("load", () => {

    renderCalendar();

});