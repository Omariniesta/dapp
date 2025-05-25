// main.js
// Import the Firebase SDK modules
export { db }; // if needed
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Your Firebase config (replace these values)
const firebaseConfig = {
  apiKey: "AIzaSyD9PkKSpJ2SWn5pCagyxHruRX9RTUmH_kA",
  authDomain: "zyper-mini-app.firebaseapp.com",
  projectId: "zyper-mini-app",
  storageBucket: "zyper-mini-app.appspot.com",
  messagingSenderId: "368820417143",
  appId: "1:368820417143:web:175aab745035276fa48c72",
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const TonConnect = window.TonConnectSDK.TonConnect; 

async function loadUserData(username) {
  const userRef = doc(db, "users", username);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const userData = userSnap.data();
    document.getElementById("points").textContent = userData.points;
    document.getElementById("referrals").textContent = userData.referrals;

    // ✅ Mark completed tasks in UI
    (userData.completedTasks || []).forEach((taskId) => {
      const taskEl = document.querySelector(`[data-task-id="${taskId}"]`);
      if (taskEl) {
        taskEl.classList.add("completed");
        taskEl.innerHTML = "✅ Completed";
        taskEl.disabled = true; // optional: prevent re-click
      }
    });
  } else {
    await setDoc(userRef, {
      points: 0,
      referrals: 0,
      completedTasks: [],
    });
    document.getElementById("points").textContent = 0;
    document.getElementById("referrals").textContent = 0;
  }
}



const stakeNFTs = [];

document.addEventListener("DOMContentLoaded", function () {
  const tg = window.Telegram.WebApp;
  tg.ready();

  lucide.createIcons();

  // Telegram user info
  if (tg.initDataUnsafe?.user) {
    const user = tg.initDataUnsafe.user;
    document.getElementById("username").innerText =
      "Username: @" + (user.username || "unknown");
  }

  const username = tg.initDataUnsafe?.user?.username || "guest";
loadUserData(username);

  // Navigation footer buttons
  document.querySelectorAll(".footer button[data-tab]").forEach((button) => {
    button.addEventListener("click", function () {
      const tab = this.getAttribute("data-tab");
      switchTab(tab);
    });
  });

  // Main section buttons
  document.querySelectorAll('#home button[data-tab]').forEach(button => {
    button.addEventListener('click', function () {
      const tab = this.getAttribute('data-tab');
      switchTab(tab);
    });
  });

  // Button listeners
  document.getElementById("stakeNFTBtn")?.addEventListener("click", stakeNFT);

    // ✅ TonConnect SDK integration
  const connector = new TonConnect({
    manifestUrl: 'https://raw.githubusercontent.com/Omariniesta/dapp/main/tonconnect-manifest.json',
    walletsList: {
      type: 'remote',
      url: 'https://raw.githubusercontent.com/Omariniesta/dapp/main/wallets-v2.json'
    }
  });

  window.connector = connector;

  setupTonWallet();
  async function setupTonWallet() {
  await connector.restoreConnection();

  const walletAddressEl = document.getElementById("walletAddress");
  const walletBtn = document.getElementById("connectWalletBtn");

  connector.onStatusChange(async (walletInfo) => {
    if (walletInfo && walletInfo.account?.address) {
      walletAddressEl.textContent = walletInfo.account.address;
      walletBtn.textContent = "Disconnect Wallet";

      // ✅ Save wallet address to Firestore under the current user
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      if (user?.username) {
        const userRef = doc(db, "users", user.username);
        await updateDoc(userRef, {
          walletAddress: walletInfo.account.address,
        });
      }
    } else {
      walletAddressEl.textContent = "Not connected";
      walletBtn.textContent = "Connect Wallet";
    }
  });

  walletBtn.addEventListener("click", async () => {
    if (!connector.connected) {
      const wallets = await connector.getWallets();
      if (wallets.length > 0) {
        connector.connect({
          universalLink: wallets[0].universalLink,
          bridgeUrl: wallets[0].bridgeUrl,
        });
      } else {
        alert("No TON wallets found.");
      }
    } else {
      connector.disconnect();
    }
  });
}




});

// Tab switching
function switchTab(tab) {
  document.querySelectorAll(".main").forEach((div) => div.classList.remove("active"));
  const targetSection = document.getElementById(tab);
  if (targetSection) targetSection.classList.add("active");

  document.querySelectorAll(".footer button").forEach((btn) => btn.classList.remove("active"));
  const activeBtn = document.querySelector(`.footer button[data-tab="${tab}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  lucide.createIcons();
}

// Stake NFT (local simulation)
async function stakeNFT() {
  const walletAddress = document.getElementById("walletAddress").innerText;
  if (walletAddress === "Not connected") {
    alert("Please connect your wallet first.");
    return;
  }

  const nftId = document.getElementById("nftIdInput").value.trim();
  if (!nftId) {
    alert("Enter NFT ID to stake");
    return;
  }

  stakeNFTs.push(nftId);

  const stakedNFTsContainer = document.getElementById("stakedNFTs");
  stakedNFTsContainer.innerHTML = "";
  stakeNFTs.forEach((id) => {
    stakedNFTsContainer.innerHTML += `<li>Staked NFT ID: ${id}</li>`;
  });

  alert(`NFT ${nftId} staked successfully!`);
}

export async function completeTask(username, taskId, points) {
  const userRef = doc(db, "users", username);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const userData = userSnap.data();
    const alreadyCompleted = userData.completedTasks?.includes(taskId);

    if (!alreadyCompleted) {
      const updatedPoints = (userData.points || 0) + points;
      const updatedTasks = [...(userData.completedTasks || []), taskId];

      await updateDoc(userRef, {
        points: updatedPoints,
        completedTasks: updatedTasks,
      });

      document.getElementById("points").textContent = updatedPoints;
    }
  }
}

