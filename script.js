"use strict";

document.addEventListener("DOMContentLoaded", function () {
  initializeMobileNavigation();
  initializeLoginModal();
  initializeContactForm();
  initializeAdministratorDashboard();
  updateCopyrightYear();
});

/*
  Mobile navigation
*/

function initializeMobileNavigation() {
  const menuButton = document.getElementById("mobile-menu-button");
  const navigation = document.getElementById("main-navigation");

  if (!menuButton || !navigation) {
    return;
  }

  menuButton.addEventListener("click", function () {
    const navigationIsOpen = navigation.classList.toggle("open");

    menuButton.setAttribute(
      "aria-expanded",
      navigationIsOpen.toString()
    );
  });

  const navigationItems = navigation.querySelectorAll("a, button");

  navigationItems.forEach(function (item) {
    item.addEventListener("click", function () {
      navigation.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

/*
  Login modal
*/

function initializeLoginModal() {
  const modal = document.getElementById("login-modal");
  const loginForm = document.getElementById("login-form");
  const loginMessage = document.getElementById("login-form-message");

  if (!modal) {
    return;
  }

  const openButtons = document.querySelectorAll("[data-open-login]");
  const closeButtons = document.querySelectorAll("[data-close-login]");

  let previouslyFocusedElement = null;

  openButtons.forEach(function (button) {
    button.addEventListener("click", openLoginModal);
  });

  closeButtons.forEach(function (button) {
    button.addEventListener("click", closeLoginModal);
  });

  document.addEventListener("keydown", function (event) {
    if (!modal.classList.contains("open")) {
      return;
    }

    if (event.key === "Escape") {
      closeLoginModal();
    }
  });

  if (loginForm) {
    loginForm.addEventListener("submit", handleLoginSubmission);
  }

  function openLoginModal() {
    previouslyFocusedElement = document.activeElement;

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    const usernameInput =
      document.getElementById("login-username");

    if (usernameInput) {
      setTimeout(function () {
        usernameInput.focus();
      }, 0);
    }
  }

  function closeLoginModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    if (loginMessage) {
      displayMessage(loginMessage, "", "");
    }

    if (loginForm) {
      loginForm.reset();
    }

    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
  }

  function handleLoginSubmission(event) {
    event.preventDefault();

    const username = loginForm.username.value.trim();
    const password = loginForm.password.value;

    if (username.length < 3) {
      displayMessage(
        loginMessage,
        "The username must contain at least three characters.",
        "error"
      );

      return;
    }

    if (password.length < 8) {
      displayMessage(
        loginMessage,
        "The password must contain at least eight characters.",
        "error"
      );

      return;
    }

    /*
      Demonstration login only.

      This is not secure authentication. Anyone can inspect this
      JavaScript file and view the demonstration credentials.
    */

    if (username === "admin" && password === "password") {
      sessionStorage.setItem("demoLoggedIn", "true");

      displayMessage(
        loginMessage,
        "Demonstration login successful. Opening the dashboard...",
        "success"
      );

      setTimeout(function () {
        window.location.href = "account.html";
      }, 700);
    } else {
      displayMessage(
        loginMessage,
        "Use username admin and password password for the demonstration.",
        "error"
      );
    }
  }
}

/*
  Contact form validation
*/

function initializeContactForm() {
  const contactForm = document.getElementById("contact-form");
  const message = document.getElementById(
    "contact-form-message"
  );

  if (!contactForm) {
    return;
  }

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const details = contactForm.details.value.trim();

    if (name.length < 2) {
      displayMessage(
        message,
        "Please enter your name.",
        "error"
      );

      return;
    }

    if (!emailAddressIsValid(email)) {
      displayMessage(
        message,
        "Please enter a valid email address.",
        "error"
      );

      return;
    }

    if (details.length < 20) {
      displayMessage(
        message,
        "Please provide at least 20 characters of project information.",
        "error"
      );

      return;
    }

    displayMessage(
      message,
      "Your information passed validation. Connect this form to a backend server before public deployment.",
      "success"
    );

    contactForm.reset();
  });
}

/*
  Administrator dashboard demonstration
*/

function initializeAdministratorDashboard() {
  const loginPanel = document.getElementById(
    "account-login-panel"
  );

  const dashboard = document.getElementById(
    "administrator-dashboard"
  );

  const previewButton = document.getElementById(
    "preview-dashboard-button"
  );

  const logoutButton = document.getElementById(
    "logout-button"
  );

  const dashboardMessage = document.getElementById(
    "dashboard-message"
  );

  if (!loginPanel || !dashboard) {
    return;
  }

  const demoLoggedIn =
    sessionStorage.getItem("demoLoggedIn") === "true";

  if (demoLoggedIn) {
    loginPanel.style.display = "none";
    dashboard.classList.add("visible");
  } else {
    loginPanel.style.display = "block";
    dashboard.classList.remove("visible");
  }

  if (previewButton) {
    previewButton.addEventListener("click", function () {
      loginPanel.style.display = "none";
      dashboard.classList.add("visible");
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      sessionStorage.removeItem("demoLoggedIn");

      dashboard.classList.remove("visible");
      loginPanel.style.display = "block";

      displayMessage(
        dashboardMessage,
        "You have signed out of the demonstration dashboard.",
        "success"
      );
    });
  }

  const dashboardTabs = document.querySelectorAll(
    "[data-dashboard-tab]"
  );

  const dashboardPanels = document.querySelectorAll(
    "[data-dashboard-panel]"
  );

  dashboardTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      const selectedPanel = tab.dataset.dashboardTab;

      dashboardTabs.forEach(function (currentTab) {
        currentTab.classList.remove("active");
      });

      dashboardPanels.forEach(function (panel) {
        panel.classList.remove("active");
      });

      tab.classList.add("active");

      const matchingPanel = document.querySelector(
        '[data-dashboard-panel="' +
        selectedPanel +
        '"]'
      );

      if (matchingPanel) {
        matchingPanel.classList.add("active");
      }
    });
  });

  const administratorButtons = document.querySelectorAll(
    "[data-administrator-action]"
  );

  administratorButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const requestedAction =
        button.dataset.administratorAction;

      displayMessage(
        dashboardMessage,
        requestedAction +
          " selected. A production version must authorize this action on the server and save the change in the database.",
        "success"
      );
    });
  });
}

/*
  Helper functions
*/

function displayMessage(element, message, messageType) {
  if (!element) {
    return;
  }

  element.textContent = message;
  element.className = "form-message";

  if (messageType) {
    element.classList.add(messageType);
  }
}

function emailAddressIsValid(emailAddress) {
  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailPattern.test(emailAddress);
}

function updateCopyrightYear() {
  const yearElements =
    document.querySelectorAll(".current-year");

  const currentYear = new Date().getFullYear();

  yearElements.forEach(function (element) {
    element.textContent = currentYear;
  });
}
