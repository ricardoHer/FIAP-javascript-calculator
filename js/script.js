const result = document.getElementById("operations");
const historyList = document.getElementById("history-list");
const history = [];
const operations = ["+", "-", "/", "*"];
const regex = new RegExp(`[${operations.join("")}]`, "g");
let operationFinished = false;

result.addEventListener("keypress", function (event) {
  handleAdd(event);
});

function insert(num) {
  if (operations.includes(num) && !canAddOperators()) return;
  handleFirstCalculation(num);
  result.value += num;
}

function clearResult() {
  result.value = "";
}

function backspace() {
  if (result.value.length > 0) result.value = result.value.slice(0, -1);
}

function calculate() {
  clearTheValueForCalculation();

  let expression = result.value;
  if (expression) {
    try {
      let operationResult = eval(expression);
      operationFinished = true;
      if (operationResult == Infinity || operationResult === -Infinity) {
        operationResult = "Divisão por 0";
      }
      result.value = operationResult;
      handleHistory(`${expression} = ${operationResult}`);
    } catch (error) {
      console.log(error);
      result.value = "Error";
    }
  }
}

const handleAdd = (event) => {
  let key = event.keyCode || event.which;
  let character = String.fromCharCode(key);
  // Enter, +, -, *, /, (, ), . e ,
  let allowedKeys = [13, 43, 45, 42, 47, 44, 46];

  let regex = /^\d+([\.,]\d+)?([+\-*/]\d+([\.,]\d+)?)*$/;
  console.log("Regex result: ", regex.test(result.value + character));
  if (!regex.test(result.value + character) && !allowedKeys.includes(key)) {
    event.preventDefault();
  }

  if (allowedKeys.includes(key) && !canAddOperators()) {
    event.preventDefault();
    return;
  }

  handleFirstCalculation(character);

  if (key === 61 || key === 13) {
    // do the calculation
    calculate();
  }
};

const clearTheValueForCalculation = () => {
  if (operations.includes(result.value.slice(-1))) {
    result.value = result.value.slice(0, -1);
  }
};

const canAddOperators = () => {
  if (mountCount().length >= 1) {
    return true;
  }
  return false;
};

const handleHistory = (historyToAdd) => {
  historyList.innerHTML = "";
  history.push(historyToAdd);

  history.forEach((hist) => {
    const ul = document.createElement("li");
    ul.innerText = hist;
    historyList.appendChild(ul);
  });
};

const mountCount = () => {
  return result.value
    .split(regex)
    .map((num) => parseFloat(num))
    .filter((num) => !isNaN(num));
};

const handleFirstCalculation = (value) => {
  if (operationFinished && /^[0-9]$/.test(value)) {
    result.value = "";
  }
  operationFinished = false;
};
