function ledOn() {
  console.log("led 켜짐")
  var ref = database.ref('led');
  ref.update({ led: 1 })
}

function ledOff() {
  console.log("led 꺼짐")
  var ref = database.ref('led');
  ref.update({ led: 0 })
}

var config = {
    apiKey: "AIzaSyCTElvOqjzcz_cP7qCt_VXVuRplYL_Fnrw",
    authDomain: "page-20a3b.firebaseapp.com",
    databaseURL: "https://page-20a3b-default-rtdb.firebaseio.com",
    projectId: "page-20a3b",
    storageBucket: "page-20a3b.firebasestorage.app",
    messagingSenderId: "358964190185",
    appId: "1:358964190185:web:a8c4f20981e83acd858978"
};

//Firebase 데이터베이스 만들기
firebase.initializeApp(config);
database = firebase.database();

// Firebase 데이터베이스 정보 가져오기
var ref = database.ref("led");
ref.on("value", gotData);

function gotData(data) {
  var val = data.val();

  if (val.led == 0){
    document.getElementById("img").src = "ledoff.png";}
  else {
    document.getElementById("img").src = "ledon.png";}

  console.log(val)
}