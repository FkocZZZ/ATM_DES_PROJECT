import { DES } from "./classes/DES.js";


// document.getElementById('login-form').addEventListener('submit', async function (e) {
//     e.preventDefault(); 
  
//     const cardNumber = document.getElementById('cardNumber').value;
//     const cardHolder = document.getElementById('cardHolder').value;

//     const des = new DES();
  
//     try {
//       const response = await fetch('http://localhost:8000/api/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           cardNumber: des.runEncrypt(cardNumber, '301004FU'), // Mã hóa cardNumber
//           cardHolder: des.runEncrypt(cardHolder, '301004FU')  // Mã hóa cardHolder
//         }),
//       });
  
//       const result = await response.json();
  
//       if (response.status === 200 && result.isValid) {
//         document.getElementById('response').innerText = `Đăng nhập thành công: ${result.data.cardHolder}`;
//       } else {
//         document.getElementById('response').innerText = `Lỗi: Thông tin không hợp lệ`;
//       }
//     } catch (error) {
//       // console.error("Lỗi khi gọi API:", error); // In chi tiết lỗi
//       document.getElementById('response').innerText = 'Lỗi khi kết nối đến server';
//     }
// });
  
document.getElementById('login-form').addEventListener('submit', async function (e) {
  e.preventDefault(); 

  const cardNumber = document.getElementById('cardNumber').value;
  const cardHolder = document.getElementById('cardHolder').value;

  const des = new DES();

  try {
    console.log('Dữ liệu trước khi mã hóa:', cardNumber, cardHolder);
    const encryptedCardNumber = des.runEncrypt(cardNumber, '301004FU');
    const encryptedCardHolder = des.runEncrypt(cardHolder, '301004FU');

    console.log('Dữ liệu đã mã hóa:', encryptedCardNumber, encryptedCardHolder);

    const response = await fetch('http://localhost:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cardNumber: encryptedCardNumber,
        cardHolder: encryptedCardHolder
      }),
    });

    if (!response.ok) {
      throw new Error(`Lỗi từ server: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.isValid) {
      document.getElementById('response').innerText = `Đăng nhập thành công: ${cardHolder}`;
    } else {
      document.getElementById('response').innerText = `Lỗi: Thông tin không hợp lệ`;
    }
  } catch (error) {
    console.error("Lỗi khi gọi API:", error.message); // In chi tiết lỗi
    document.getElementById('response').innerText = 'Lỗi khi kết nối đến server';
  }
});


  const fetchAPI = async () => {
    const des = new DES();
    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardNumber: des.runEncrypt('111122233334444', '301004FU'),
          cardHolder: des.runEncrypt('Kim Phu', '301004FU'),
          mode: des.runEncrypt('topup', '301004FU'),
          currency: des.runEncrypt('3000000', '301004FU') 
        }),
      });
  
      const result = await response.json();
      
      // In kết quả trả về từ server để kiểm tra
      console.log("Kết quả từ server:", result);
      
      // Kiểm tra dữ liệu trả về trước khi giải mã
      if (result && result.status && result.id && result.cardNumber && result.cardHolder && result.mode && result.currency) {
        const decryptedResult = {
          status: des.runDecrypt(result.status, '301004FU'),
          id: des.runDecrypt(result.id, '301004FU'),
          cardNumber: des.runDecrypt(result.cardNumber, '301004FU'),
          cardHolder: des.runDecrypt(result.cardHolder, '301004FU'),
          mode: des.runDecrypt(result.mode, '301004FU'),
          currency: des.runDecrypt(result.currency, '301004FU'),
        };
        console.log(decryptedResult);
      } else {
        console.error("Dữ liệu trả về từ server không hợp lệ hoặc thiếu.");
      }
  
    } catch (error) {
      console.error("Lỗi khi gọi API hoặc xử lý dữ liệu: ", error);
    }
  };
  
  fetchAPI();
  