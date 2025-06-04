import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// 🔧 여기에 본인의 Firebase 설정으로 바꿔주세요
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
const question = "물냉 vs 비냉";

// 투표 함수
function vote(option) {
  console.log("투표됨:", option); // 디버깅용 출력
  const voteRef = ref(db, "votes/" + question + "/" + option);
  runTransaction(voteRef, current => (current || 0) + 1);
  document.querySelectorAll("button").forEach(btn => btn.disabled = true);
}
window.vote = vote; // 🔥 HTML에서 호출 가능하게 등록

// 결과 실시간 업데이트
const resultRef = ref(db, "votes/" + question);
onValue(resultRef, snapshot => {
  const data = snapshot.val() || { "물냉": 0, "비냉": 0 };
  const total = (data["물냉"] || 0) + (data["비냉"] || 0);
  const rate1 = total ? Math.round((data["물냉"] / total) * 100) : 0;
  const rate2 = 100 - rate1;

  document.getElementById("result").innerHTML = `
    <div class="label">물냉: ${data["물냉"] || 0}표 (${rate1}%)</div>
    <div class="bar" style="width: ${rate1}%; background-color: skyblue;"></div>
    <div class="label">비냉: ${data["비냉"] || 0}표 (${rate2}%)</div>
    <div class="bar" style="width: ${rate2}%; background-color: crimson;"></div>
    <div>총 투표 수: ${total}명</div>
  `;
});
