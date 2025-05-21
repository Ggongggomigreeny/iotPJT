import requests  # HTTP 요청을 보내기 위한 requests 모듈 임포트
from sense_hat import SenseHat  # Sense HAT 제어를 위한 SenseHat 모듈 임포트
import time  # 시간 지연을 위한 time 모듈 임포트

sense = SenseHat()  # Sense HAT 객체 생성

# Firebase에서 LED 상태를 가져올 URL
LED_URL = 'https://page-20a3b-default-rtdb.firebaseio.com/led.json'
# Firebase에서 메시지를 가져올 URL
MSG_URL = 'https://page-20a3b-default-rtdb.firebaseio.com/sense-message.json'
# Firebase에 온도 저장할 URL
TEMP_URL = 'https://page-20a3b-default-rtdb.firebaseio.com/temp.json'
# Firebase에 습도 저장할 URL
HUMI_URL = 'https://page-20a3b-default-rtdb.firebaseio.com/humi.json'

last_msg = None  # 마지막으로 출력한 메시지를 저장하는 변수

def get_temp():
    """Sense HAT에서 온도를 읽어오고, 실패 시 0 반환"""
    try:
        temp = sense.get_temperature()
        if temp is None or temp != temp:  # None 또는 NaN 체크
            return 0
        return round(temp, 2)
    except Exception:
        return 0

def get_humi():
    """Sense HAT에서 습도를 읽어오고, 실패 시 0 반환"""
    try:
        humi = sense.get_humidity()
        if humi is None or humi != humi:  # None 또는 NaN 체크
            return 0
        return round(humi, 2)
    except Exception:
        return 0

try:
    last_sensor_update = 0  # 마지막 센서 데이터 전송 시간
    sensor_interval = 5     # 온습도 갱신 주기(초)

    while True:  # 무한 반복
        # LED 상태 처리 (빠르게 반복)
        led_response = requests.get(LED_URL)
        if led_response.status_code == 200:
            led_data = led_response.json()
            if (led_data['led'] == 1):
                sense.clear(255, 0, 0)
            else:
                sense.clear()
        else:
            sense.show_message("Error", scroll_speed=0.05, text_colour=[255, 0, 0])

        # 메시지 처리 (변경된 경우에만 출력)
        msg_response = requests.get(MSG_URL)
        if msg_response.status_code == 200:
            msg = msg_response.json()
            if msg != last_msg:
                if msg:
                    sense.show_message(str(msg), scroll_speed=0.08, text_colour=[0, 255, 0])
                last_msg = msg

        # 온도/습도 갱신 주기에만 firebase로 전송
        now = time.time()
        if now - last_sensor_update >= sensor_interval:
            temp = get_temp()
            humi = get_humi()
            requests.put(TEMP_URL, json=temp)
            requests.put(HUMI_URL, json=humi)
            last_sensor_update = now

        time.sleep(0.1)  # 전체 반복은 빠르게, 0.1초마다 반복

except KeyboardInterrupt:
    print("프로그램 종료")
