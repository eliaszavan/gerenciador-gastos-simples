const tbody = document.querySelector("tbody");
const descItem = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const time = document.querySelector("#time");
const btnNew = document.querySelector("#btnNew");

const total = document.querySelector(".total");
const quantity = document.querySelector(".quantity");

let items;

function enableAlert(event, text, type) {
  event.preventDefault();
  let backgroundColor = "";
  let textColor = "";
  switch(type) {
    case "error":
      backgroundColor = "rgb(190, 55, 45)";
      textColor = "#fcfcfc";
      break;
    case "warn":
      backgroundColor = "rgb(214, 200, 3)";
      textColor = "#0e0e0e";
      break;
    case "sucess":
      backgroundColor = "rgb(1, 131, 88)";
      textColor = "#fcfcfc";
      break;
    default:
      backgroundColor = "rgba(0, 0, 0, 0.5)";
      textColor = "#fcfcfc";
      break
  }
  const divAlert = document.querySelector(".alert");

  const divMessageVerify = document.querySelector(".message");
  if (divMessageVerify != null) divMessageVerify.remove();
  const message = document.createElement("div");
  message.classList.add("message");
  message.style.backgroundColor = backgroundColor;
  message.style.color = textColor;

  message.innerText = text;
  divAlert.appendChild(message);
  setTimeout(() => {
      message.remove();
  }, 1500);
}

function formatNumber(number) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number);
}

function unformatNumber(formattedNumber) {
  // Remove vírgulas da string e converte para um número
  return parseFloat(formattedNumber.replace(/\./g, '').replace(',', '.'));
}

function formatDate(date) {
  const dateSplit = date.split("-")
  const day = dateSplit[2] == null ? "" : dateSplit[2]
  const month = dateSplit[1] == null ? "" : dateSplit[1]
  const year = dateSplit[0] == null ? "" : dateSplit[0]
  const formattedDate = "" + day + "-" + month + "-" + year + ""

  return formattedDate;
}

btnNew.onclick = (event) => {
  if (descItem.value === "" || amount.value === "" || time.value === "") {
    var brow = navigator.userAgent;
    if (/mobi/i.test(brow)) {
      return alert('Mobile Browser');
    } else {
      return enableAlert(event, "Preencha todos os campos!", "error");
    }
  }else {
    items.push({
      desc: descItem.value.toUpperCase(),
      amount: formatNumber(Math.abs(amount.value.replace("Total: R$", ""))),
      time: formatDate(time.value),
    });
  
    setItensBD();
  
    loadItens();
    enableAlert(event, "Produto adicionado com êxito.", "sucess");
  
    descItem.value = "";
    amount.value = "";
    time.value = "";
  }  
};

function deleteItem(index) {
  items.splice(index, 1);
  setItensBD();
  loadItens();
}

function insertItem(item, index) {
  let tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${item.desc}</td>
    <td>R$ ${item.amount}</td>
    <td>${item.time}</td>
    <td class="columnAction">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;

  tbody.appendChild(tr);
}

function loadItens() {
  items = getItensBD();
  tbody.innerHTML = "";
  items.forEach((item, index) => {
    insertItem(item, index);
  });

  getTotals();
}

function getTotals() {
  let amountItems = 0;
  let payments = 0;
  items.map((transaction) => {
    amountItems += Number(unformatNumber(transaction.amount))
    payments = payments + 1;
  });

  total.innerHTML = "Total: R$" + formatNumber(amountItems);
  quantity.innerHTML = "Compras: " + payments;
}

const getItensBD = () => JSON.parse(localStorage.getItem("db_items")) ?? [];
const setItensBD = () =>
  localStorage.setItem("db_items", JSON.stringify(items));

loadItens();