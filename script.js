import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// 여기에 본인의 Firebase 설정 정보로 교체하세요 🔽
const firebaseConfig = {
  apiKey: "AIzaSyABEHJmEVZzwfCLxh-ppNwCpUaR_1L2DNQ",
  authDomain: "balance-game-d0283.firebaseapp.com",
  databaseURL: "https://balance-game-d0283-default-rtdb.firebaseio.com",
  projectId: "balance-game-d0283",
  storageBucket: "balance-game-d0283.firebasestorage.app",
  messagingSenderId: "944077079494",
  appId: "1:944077079494:web:b2881eebce94818d7ce8c7"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const question = "치킨 vs 피자";

function vote(option) {
  const voteRef = ref(db, "votes/" + question + "/" + option);
  runTransaction(voteRef, current => (current || 0) + 1);
  document.querySelectorAll("button").forEach(btn => btn.disabled = true);
}

window.vote = vote;

const resultRef = ref(db, "votes/" + question);
onValue(resultRef, snapshot => {
  const data = snapshot.val() || { "치킨": 0, "피자": 0 };
  const total = (data["치킨"] || 0) + (data["피자"] || 0);
  const rate1 = total ? Math.round((data["치킨"] / total) * 100) : 0;
  const rate2 = 100 - rate1;

  document.getElementById("result").innerHTML = `
    <div class="label">치킨: ${data["치킨"] || 0}표 (${rate1}%)</div>
    <div class="bar" style="width: ${rate1}%; background-color: orange;"></div>
    <div class="label">피자: ${data["피자"] || 0}표 (${rate2}%)</div>
    <div class="bar" style="width: ${rate2}%; background-color: tomato;"></div>
    <div>총 투표 수: ${total}명</div>
  `;
});
