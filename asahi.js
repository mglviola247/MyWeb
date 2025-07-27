  // Харилцагчийн утасны дугаараар харилцагчийг хайж буй хэсэг.
  let btnPhoneSearch = document.querySelector("#phoneSearch");
  let phoneNumber = document.querySelector("#phoneNumber");
  let customerName = document.querySelector("#customerName");
  let urlPhone = `https://script.google.com/macros/s/AKfycbxgUVytmwrDr-ApJOMnP2qiicyWaa4ro7mtbkLqQCCff7OATzqNxvyz4OnTCP3hvj2l/exec`;
  let urlPrice = `https://script.google.com/macros/s/AKfycbx99kpMeAjKpXnsiACQ9yfib8tJRiw2tt-INFQIB4a7Cu6VyW9b0pGO4WWtu4PARsrC/exec`;

  let sendbutton = document.querySelector("#SendSheet");

  btnPhoneSearch.addEventListener("click", showInfo);

  async function showInfo() {
    

    try {
      const response = await fetch(urlPhone);
      const data = await response.json();

      const user = data.find(v => v.Phonenumber == phoneNumber.value);

      if (user) {
        customerName.innerText = `Харилцагч: ${user.Name}`;
        // Бараа бүтээгдэхүүн нэмэх цонхийг дуудаж байгаа.
        openProductModal();
      } else {
        customerName.innerText = "Гэрээт харилцагчаар бүртгүүлнэ үү.";
      }

    } catch (err) {
      console.error("Алдаа:", err);
      customerName.innerText = "Сүлжээ эсвэл серверийн алдаа";
    }
  }

   function openProductModal(){
      document.getElementById("addProductModal").style.display ='block';
   }

  // Барааны нэрс татах
    const nameInput = document.getElementById("productName");
    const priceInput = document.getElementById("productPrice");
    const suggestionList = document.getElementById("suggestions");
    let allNames = [];

    fetch("https://script.google.com/macros/s/AKfycbxzORLe6Ltjn77k5oQVgjUVqEDiMb6BCWjT2Fu57p-O4mV2H7vsDF3Fxmgb90FVHyaV/exec")
    .then(res => res.json())
    .then(data => allNames = data)
    .catch(err => console.error("Барааны нэрс татахад алдаа:", err));

    // Автомат санал болгох (Product name)
  nameInput.addEventListener("input", () => {
  const value = nameInput.value.toLowerCase().trim();
  suggestionList.innerHTML = "";

  if (!value) return suggestionList.style.display = "none";

  const filtered = allNames.filter(name => name.toLowerCase().includes(value));

  if (!filtered.length) return suggestionList.style.display = "none";

  filtered.forEach(name => {
    const li = document.createElement("li");
    li.textContent = name;
    li.style.padding = "5px";
    li.style.cursor = "pointer";
    li.addEventListener("click", () => {
      nameInput.value = name;
      suggestionList.style.display = "none";
      showInfoPrice();
    });
    suggestionList.appendChild(li);
  });

  suggestionList.style.display = "block";
});

// Click гадна дарвал нуух
document.addEventListener("click", (e) => {
  if (e.target !== nameInput) suggestionList.style.display = "none";
});


  async function showInfoPrice() {
   

    try {
      const responsePrice = await fetch(urlPrice);
      const dataPrice = await responsePrice.json();

      const price = dataPrice.find(v => v.ProductName == nameInput.value);
      console.log(price);
      if (price) {
        priceInput.value = `${price.Price}`;
        // Бараа бүтээгдэхүүн нэмэх цонхийг дуудаж байгаа.
      } else {
        console.log("Үнийн мэдээлэл харуулахад алдаа илэрлээ")
      }

    } catch (err) {
      console.error("Алдаа:", err);
    }
  }
  // Бараа бүтээгдэхүүний жагсаалт 
  const productForm = document.getElementById("productForm");
  const productTableBody = document.getElementById("productTableBody");
  const totalPriceSpan = document.getElementById("totalPrice");
  let totalAmount = 0;

  productForm.onsubmit = function(event) {
  event.preventDefault();

  const productName = nameInput.value;
  const productPrice = parseFloat(document.getElementById("productPrice").value);
  const productQuantity = parseInt(document.getElementById("productQuantity").value);
  const totalProductPrice = productPrice * productQuantity;

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${productName}</td>
    <td>${productPrice}₮</td>
    <td>${productQuantity}</td>
    <td>${totalProductPrice}₮</td>
    <td><button class="remove-btn">Хасах</button></td>
  `;
  productTableBody.appendChild(row);

  // "Хасах" товч дарах үед
  row.querySelector(".remove-btn").onclick = function () {
    totalAmount -= totalProductPrice;
    totalPriceSpan.innerText = `${totalAmount.toLocaleString()} ₮`;
    productTableBody.removeChild(row);
  };

  // Хүснэгтэд нэмэх
  productTableBody.appendChild(row);

  // Нийт үнийг нэмэх
  totalAmount += totalProductPrice;
  totalPriceSpan.innerText = `${totalAmount.toLocaleString()} ₮`;

  // Формыг цэвэрлэх
  productForm.reset();
};

// Хүснэгтийн өгөгдлийг JSON болгон илгээх
function convertTableToJson() {
  const table = document.getElementById('productTable');
  const rows = table.getElementsByTagName('tr');
  const tableData = [];

  if (rows.length <= 1) {
    alert("Хүснэгт хоосон байна!");
    return;
  }

  const headers = Array.from(rows[0].getElementsByTagName('th')).map(th => th.textContent.trim());

  for (let i = 1; i < rows.length; i++) {
    const rowData = {};
    const cells = rows[i].getElementsByTagName('td');
    for (let j = 0; j < cells.length; j++) {
      const key = headers[j];
      const value = cells[j].textContent.replace("₮", "").trim(); // ₮ арилгана
      rowData[key] = value;
    }
    tableData.push(rowData);
    console.log(rowData);
  }

  const json = JSON.stringify(tableData, null, 2);
  console.log(json);

  fetch("https://script.google.com/macros/s/AKfycbxL3vLN2_lXwkCnVIs1OeUkSKBSgvB9ud7QhENc_GGLksMi-0Otnkt_5ehi2z84UI2z/exec", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: json
  })
  .then(response => {
    alert("Амжилттай илгээгдлээ!");
    location.reload();
  })
  .catch(error => {
    console.error('Алдаа:', error.message);
    alert("Илгээхэд алдаа гарлаа!");
  });

}

const urlTest = "https://script.google.com/macros/s/AKfycbwr27ZprdzwtQdVGOv1IGmxG-4aEl3n8aWjm7reCKdUb0XfvqnxSAbYvspiOfjsuMXULg/exec";

function Test(){

    const testData = [{name:JOE}]
    fetch(urlTest, {
    method: 'POST',
    mode:'no-cors',
    cache:'no-cache',
    //credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    redirect:'follow',
    //referrerPolicy: 'no-referrer',
    body: JSON.stringify({name:"Jhon"})
  })
  .then(response => {
    alert("Амжилттай илгээгдлээ!");
    location.reload();
  })
  .catch(error => {
    console.error('Алдаа:', error.message);
    alert("Илгээхэд алдаа гарлаа!");
  });
}





