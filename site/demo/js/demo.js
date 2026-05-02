(() => {
  const wizardForm = document.getElementById("demoWizardForm");
  if (!wizardForm) return;

  const steps = Array.from(wizardForm.querySelectorAll(".wizard-step"));

  const backButton = wizardForm.querySelector('[data-action="back"]');
  const nextButton = wizardForm.querySelector('[data-action="next"]');

  const stepCurrent = wizardForm.querySelector("[data-step-current]");
  const stepTotal = wizardForm.querySelector("[data-step-total]");
  const errorMessage = wizardForm.querySelector("[data-wizard-error]");

  let age = null
  let gender = null
  let currentStep = 0;
  const lastStep = steps.length - 1;

  const nextButtonLabels = new Map([
    [0, "Listen Music"],
    [1, "Proceed to Face Scan"],
    [2, "Give feedback"],
    [3, "Calculate Scores"],
    [4, "Done"],
  ]);

  if (stepTotal) stepTotal.textContent = String(steps.length);

  // Input validation for age and gender input
  const getActiveFields = () =>
    Array.from(steps[currentStep].querySelectorAll("input, select, textarea"));

  const validateStep = () => {
    const activeFields = getActiveFields();

    console.log("ActiveFields", activeFields);

    for (const field of activeFields) {
      if (!field.checkValidity()) {
        console.log("Current Field", field, field.checkValidity());
        field.reportValidity();
        return false;
      }
    }
    return true;
  };

  // Updated the next step in the withard when the next button is clicked
  const updateStep = (targetStep) => {
    if (targetStep == 1) {
      callUserInformationSubmitted();
    }

    if (nextButton) {
      nextButton.textContent = nextButtonLabels.get(targetStep) ?? "Next";
    }

    currentStep = targetStep;

    steps.forEach((step, index) => {
      const isActive = index === currentStep;

      console.log("Current active", step, isActive);

      step.classList.toggle("is-active", isActive);
      step.setAttribute("aria-hidden", String(!isActive));
    });

    if (stepCurrent) stepCurrent.textContent = String(currentStep + 1);
    if (errorMessage) errorMessage.textContent = "";

    const isFirst = currentStep === 0;
    const isLast = currentStep === lastStep;

    console.log("is last", isLast);

    if (backButton) backButton.disabled = isFirst;
    // if (nextButton) nextButton.hidden = isLast;

    const nextFocusable = steps[currentStep].querySelector(
      "input, select, textarea, button",
    );
    if (nextFocusable) nextFocusable.focus();
  };

  const callUserInformationSubmitted = () => {
    age = wizardForm.querySelector("[name=age]").value;
    gender = wizardForm.querySelector("[name=gender]").value;

    console.log("Age and Gender", age, gender)
  };

  //   Listener for both back and next button
  backButton?.addEventListener("click", () => {
    if (currentStep > 0) updateStep(currentStep - 1);
  });

  nextButton?.addEventListener("click", () => {
    if (!validateStep()) {
      if (errorMessage)
        errorMessage.textContent =
          "Please complete this step before continuing.";
      return;
    }
    if (currentStep < lastStep) updateStep(currentStep + 1);
  });

  updateStep(0);
})();
