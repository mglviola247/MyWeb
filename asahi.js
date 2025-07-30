    // Харилцагчийн утасны дугаараар харилцагчийг хайж буй хэсэг.
    let btnPhoneSearch = document.querySelector("#phoneSearch");
    let phoneNumber = document.querySelector("#phoneNumber");
    let customerName = document.querySelector("#customerName");
    let urlPhone = `https://script.google.com/macros/s/AKfycbxgUVytmwrDr-ApJOMnP2qiicyWaa4ro7mtbkLqQCCff7OATzqNxvyz4OnTCP3hvj2l/exec`;
    let urlPrice = `https://script.google.com/macros/s/AKfycbx99kpMeAjKpXnsiACQ9yfib8tJRiw2tt-INFQIB4a7Cu6VyW9b0pGO4WWtu4PARsrC/exec`;
    let checkbox = document.getElementById("myCheckbox");

    let sendbutton = document.querySelector("#SendSheet");

    btnPhoneSearch.addEventListener("click", showInfo);

    async function showInfo() {
        document.getElementById("textPhone").innerHTML = "Харилцагчийг хайж байгаа тул түр хүлээн үү!!!";
      try {
        const response = await fetch(urlPhone);
        const data = await response.json();

        let user = data.find(v => v.Phonenumber == phoneNumber.value);
        if (user) {
          customerName.innerText =user.names;
          document.getElementById("textPhone").style.display = "none"
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
      let priceInput = document.getElementById("productPrice");
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
        priceInput.value = "Тоо ширхэгийг бөглөнө үү..."; // 👉 Түр зуурын мессеж

      });
      suggestionList.appendChild(li);
    });

    suggestionList.style.display = "block";
  });
  // 3 болон түүнээс дээш ширээ
    const qtyInput = document.getElementById("productQuantity");
      qtyInput.addEventListener("input", () => {
          showInfoPrice()
  });




  // Click гадна дарвал нуух
  document.addEventListener("click", (e) => {
    if (e.target !== nameInput) suggestionList.style.display = "none";
  });


    async function showInfoPrice() {
     priceInput.value = "Үнийн мэдээллийг татаж байгаа тул түр хүлээнэ үү..."; // 👉 Түр зуурын мессеж

      try {
        const responsePrice = await fetch(urlPrice);
        const dataPrice = await responsePrice.json();
        

        const price = dataPrice.find(v => v.ProductName == nameInput.value);
        console.log(price);
        if (price) {
          if (checkbox.checked) {
                  if(qtyInput.value >2){
                    priceInput.value = `${price.PriceNuatContract}`
                  }else{
                     priceInput.value = `${price.PriceNuat}`;
                  }
                 
              } else {
                  if(qtyInput.value >2){
                    priceInput.value = `${price.PriceContract}`
                  }else{
                     priceInput.value = `${price.Price}`;
                  }
              }
          
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
    const contractCustomer = document.getElementById("customerName").innerHTML;
    const totalProductPrice = productPrice * productQuantity;
    let checkNuat = "";
      if (checkbox.checked) {
                   checkNuat = "Тийм";
                    account.innerHTML = "Дансны дугаар: 459023354";
                    document.getElementById("accountIBAN").innerHTML = "IBAN дугаар: MN380004000459023354";
              } else {
                   checkNuat = "Үгүй";
                      account.innerHTML = "Дансны дугаар: 460015585";
                      document.getElementById("accountIBAN").innerHTML = "IBAN дугаар: MN370004000460015585";
              }
          

    const row = document.createElement("tr");
    row.innerHTML = `
      <td style='display:none'>${contractCustomer}</td>
      <td style='display:none'>${phoneNumber.value}</td>
      <td>${productName}</td>
      <td>${productPrice}₮</td>
      <td>${productQuantity}</td>
      <td>${totalProductPrice}₮</td>
      <td><button class="remove-btn"><i class="fas fa-minus"></i></button></td>
      <td style='display:none'>${checkNuat}</td>
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

    const headers = ['customerName', 'phoneNumber', 'productName', 'productPrice','productQuantity','totalPrice','delete',"checkbox"];

    for (let i = 1; i < rows.length; i++) {
      const rowData = {};
      const cells = rows[i].getElementsByTagName('td');
      for (let j = 0; j < cells.length; j++) {
        const key = headers[j];
        const value = cells[j].textContent.replace("₮", "").trim(); // ₮ арилгана
        rowData[key] = value;
      }
      tableData.push(rowData);
    
    }

    const json = JSON.stringify(tableData, null, 2);
    console.log(json);
    let urlTest = "https://script.google.com/macros/s/AKfycbwuWCQSGtr-ZF9HiwNkHh47NkYozdVDlEpvShX3tl__yM95NzVaYZpZLU-gNrk7olKR/exec";

    fetch(urlTest, {
      method: 'POST',
      mode:'no-cors',
      cache:'no-cache',
      headers: { 'Content-Type': 'application/json' },
      redirect:'follow',
      body:json
    })
    .then(response => response.json())
    .then(data => {
      alert("Амжилттай илгээгдлээ: " + data.message);
       alert("амжилттай илгээлээ");
      alertBox();

    })
    .catch(error => {
      console.error('Алдаа:', error.message);
      alertBox();
    });


  }
  function alertBox() {
  document.getElementById("alertBox").style.display = "block";
  document.getElementById("overlay").style.display = "block";
  
  document.querySelector("#alertButton").addEventListener("click", () => {
    location.reload();
  });
}




