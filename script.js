function ledOn() {
  // 콘솔에 "led 켜짐" 메시지 출력
  console.log("led 켜짐")
  // Firebase의 'led' 경로에 참조 생성
  var ref = database.ref('led');
  // led 값을 1로 업데이트하여 LED를 켬
  ref.update({ led: 1 })
}

function ledOff() {
  // 콘솔에 "led 꺼짐" 메시지 출력
  console.log("led 꺼짐")
  // Firebase의 'led' 경로에 참조 생성
  var ref = database.ref('led');
  // led 값을 0으로 업데이트하여 LED를 끔
  ref.update({ led: 0 })
}

// Firebase 프로젝트 설정 정보 객체
var config = {
    apiKey: "AIzaSyCTElvOqjzcz_cP7qCt_VXVuRplYL_Fnrw", // API 키
    authDomain: "page-20a3b.firebaseapp.com", // 인증 도메인
    databaseURL: "https://page-20a3b-default-rtdb.firebaseio.com", // 데이터베이스 URL
    projectId: "page-20a3b", // 프로젝트 ID
    storageBucket: "page-20a3b.firebasestorage.app", // 스토리지 버킷
    messagingSenderId: "358964190185", // 메시징 발신자 ID
    appId: "1:358964190185:web:a8c4f20981e83acd858978" // 앱 ID
};

// Firebase 앱 초기화
firebase.initializeApp(config);
// Firebase 실시간 데이터베이스 객체 생성
database = firebase.database();

// 'led' 경로의 데이터 참조 생성
var ref = database.ref("led");
// 'led' 값이 변경될 때마다 gotData 함수 호출
ref.on("value", gotData);

function gotData(data) {
  // 데이터 스냅샷에서 값 추출
  var val = data.val();

  // led 값이 0이면 ledoff.png 이미지를 표시
  if (val.led == 0){
    document.getElementById("img").src = "ledoff.png";}
  // led 값이 1이면 ledon.png 이미지를 표시
  else {
    document.getElementById("img").src = "ledon.png";}

  // 현재 led 상태를 콘솔에 출력
  console.log(val)
}

// 텍스트 입력창(userInput)에서 값이 변경(change 이벤트)되면 실행
document.getElementById("userInput").addEventListener("change", function() {
  // 입력된 메시지 값 가져오기
  var msg = this.value;
  // 'sense-message' 경로의 데이터 참조 생성
  var msgRef = database.ref('sense-message');
  // 입력된 메시지를 firebase에 저장
  msgRef.set(msg);
});

// 메시지 전송 함수(입력창의 값을 firebase에 저장)
function sendMessageToFirebase() {
  // 입력창의 값 가져오기
  var msg = document.getElementById("userInput").value;
  // 'sense-message' 경로의 데이터 참조 생성
  var msgRef = database.ref('sense-message');
  // 입력된 메시지를 firebase에 저장
  msgRef.set(msg);
}

// 입력창에서 엔터키를 누르면 메시지 전송 함수 호출
document.getElementById("userInput").addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    sendMessageToFirebase();
  }
});

// send 버튼 클릭 시 메시지 전송 함수 호출
document.getElementById("sendBtn").addEventListener("click", function() {
  sendMessageToFirebase();
});

// 온도/습도 정보를 저장할 변수
let currentTemp = null;
let currentHumi = null;

// 온도와 습도 데이터를 firebase에서 실시간으로 받아옴
function listenSensorData() {
  var tempRef = database.ref('temp');
  var humiRef = database.ref('humi');

  // 온도 값이 변경될 때마다 실행
  tempRef.on('value', function(tempSnap) {
    currentTemp = tempSnap.val();
    updateSensorMsgOnPage();
  });

  // 습도 값이 변경될 때마다 실행
  humiRef.on('value', function(humiSnap) {
    currentHumi = humiSnap.val();
    updateSensorMsgOnPage();
  });
}

// 온도/습도 메시지 창에 값을 표시하는 함수
function updateSensorMsgOnPage() {
  if (currentTemp !== null && currentHumi !== null) {
    var msg = "현재 온도: " + currentTemp + "℃ / 습도: " + currentHumi + "%";
    var sensorMsgDiv = document.getElementById("sensorMsg");
    if (sensorMsgDiv) {
      sensorMsgDiv.textContent = msg;
    }
  }
}

// 페이지 로드 시 센서 데이터 리스닝 시작
window.addEventListener('DOMContentLoaded', listenSensorData);