import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors'; 
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
// Khai báo một mảng để lưu các phần thưởng đã nhận được từ các lượt quay trước đó
const receivedPrizes = [];
// xử lý jwt token
function authenToken(req, res, next) {
  const authorizationHeader = req.headers['authorization'];
  // 'Bearer [token]'
  const token = authorizationHeader.split(' ')[1];
  if (!token) res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
    console.log(err, data);
    if (err) res.sendStatus(403);
    next();
  });
}
// end xử lý jwt token

const gifts = [
  {
    id: 1,
    name: 'Iphone',
    author: 'Iphone 14 pro max',
  },
  {
    id: 2,
    name: 'Macbook',
    author: 'Macbook 2023 pro ',
  },
  {
    id: 3,
    name: 'Ti Vi',
    author: 'Tivi 80 inch ',
  },
  {
    id: 4,
    name: 'Ipad',
    author: 'ipad 10 pro',
  },
  {
    id: 5,
    name: 'Airpods',
    author: 'Airpods 10 pro',
  },
  
];

// Initialize remaining spins and last spin timestamp
let remainingSpins = 5; // You can set any initial number of spins you want
let lastSpinTime = 0;
const COOLDOWN_TIME = 3000; // Cooldown period in milliseconds (3 seconds)
const RECHARGE_INTERVAL = 60 * 60 * 1000; // Recharge spins every hour

// Function to select a random prize from the gifts array
function selectRandomPrize() {
  const randomIndex = Math.floor(Math.random() * gifts.length);
  return gifts[randomIndex];
}

// Spin function to handle spinning logic and select a random prize
function spin() {
  const currentTime = Date.now();
  if (remainingSpins > 0 && currentTime - lastSpinTime >= COOLDOWN_TIME) {
    remainingSpins--;
    lastSpinTime = currentTime;
    return { remainingSpins, prize: selectRandomPrize() };
  } else if (remainingSpins === 0 && currentTime - lastSpinTime >= RECHARGE_INTERVAL) {
    remainingSpins = 5; // Recharge spins to the initial value when the recharge interval has passed
    lastSpinTime = currentTime;
    return { remainingSpins, prize: null };
  } else {
    return { remainingSpins, prize: 'Chúc bạn may mắn lần sau' }; 
  }
}
const SPIN_PRICE = 100;
// Function to handle purchasing spins
function purchaseSpins(req, res) {
  // Implement your logic to check the user's virtual currency or points balance
  // and deduct the SPIN_PRICE from the balance for each spin purchased
  // For this example, let's assume the user has enough balance to purchase spins

  const purchasedSpins = 1; // Let's assume the user purchases 3 spins
  remainingSpins += purchasedSpins;

  res.json({ status: 'Success', purchasedSpins, remainingSpins });
}
// Purchase additional spins
app.post('/purchaseSpins', authenToken, purchaseSpins);
// Vòng quay
app.post('/spin', authenToken, (req, res) => {
  const { remainingSpins, prize } = spin(); // Call the spin function to update remaining spins and get a random prize
  if (prize && prize !== 'Chúc bạn may mắn lần sau') {
    // Nếu có phần thưởng và phần thưởng không phải là 'Chúc bạn may mắn lần sau', thêm phần thưởng vào mảng receivedPrizes
    receivedPrizes.push(prize);
  }
  res.json({ status: 'Success', remainingSpins, prize });
});
// end vòng quay
// API gifts - Hiển thị danh sách các phần thưởng đã nhận từ các lượt quay trước đó
app.get('/gifts', (req, res) => {
  res.json({ gifts: receivedPrizes });
});
//end gifts
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
