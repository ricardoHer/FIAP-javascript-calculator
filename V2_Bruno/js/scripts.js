// Operation functions
const sum = (val1, val2) => val1 + val2;
const subtract = (val1, val2) => val1 - val2;
const multiply = (val1, val2) => val1 * val2;
const divide = (val1, val2) => {
  if (val2 === 0) {
    alert("Não é possível efetuar a divisão por zero");
    return;
  }
  return val1 / val2;
};
const firstInput = document.getElementById("first-input");
const secondInput = document.getElementById("second-input");

const validateInput = (input) => {
  if (input === "E" || input === "e") return false;
  return true;
};

firstInput.addEventListener("keypress", function (evt) {
  if (!validateInput(evt.key)) evt.preventDefault();
});

secondInput.addEventListener("keypress", function (evt) {
  if (!validateInput(evt.key)) evt.preventDefault();
});

const handleOperation = (e) => {
  const { name } = e.target;

  if (firstInput.value.trim() === "") {
    alert("Informe o primeiro valor para calcular");
    return;
  }

  if (secondInput.value.trim() === "") {
    alert("Informe o segundo valor para calcular");
    return;
  }

  const firstValue = Number(firstInput.value);
  const secondValue = Number(secondInput.value);

  let result;

  switch (name) {
    case "sum":
      result = sum(firstValue, secondValue);
      firstInput.value = "";
      secondInput.value = "";
      break;
    case "subtract":
      result = subtract(firstValue, secondValue);
      firstInput.value = "";
      secondInput.value = "";
      break;
    case "multiply":
      result = multiply(firstValue, secondValue);
      firstInput.value = "";
      secondInput.value = "";
      break;
    case "divide":
      result = divide(firstValue, secondValue);
      firstInput.value = "";
      secondInput.value = "";
      break;

    default:
      break;
  }

  const spanElement = document.getElementById("result");

  spanElement.innerText = result ?? "Valor inválido";
};

// Add listeners to buttons
const buttons = Array.from(document.getElementsByTagName("button"));

buttons.forEach((button) =>
  button.addEventListener("click", (e) => handleOperation(e))
);
