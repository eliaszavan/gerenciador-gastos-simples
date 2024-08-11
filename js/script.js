const tbody = document.querySelector("tbody");
const descItem = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const time = document.querySelector("#time");
const btnNew = document.querySelector("#btnNew");

const total = document.querySelector(".total");
const quantity = document.querySelector(".quantity");

let items;

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

btnNew.onclick = () => {
  if (descItem.value === "" || amount.value === "" || time.value === "") {
    return alert("Preencha todos os campos!");
  }

  items.push({
    desc: descItem.value.toUpperCase(),
    amount: formatNumber(Math.abs(amount.value.replace("Total: R$", ""))),
    time: formatDate(time.value),
  });

  setItensBD();

  loadItens();

  descItem.value = "";
  amount.value = "";
  time.value = "";
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