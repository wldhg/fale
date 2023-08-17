export const serverDefaultCode = `# 할 일 : 서버가 받은 데이터를 표시용 데이터로 정제/산출하는 코드를 작성합니다.
#
#   1. get_data(식별자, 개수) 함수로 최신 입력 데이터를 원하는 만큼 불러올 수 있습니다.
#      여기서 식별자는 센서 코드에서 send() 함수에 적어 준 식별자와 같아야 합니다.
#      저장된 데이터 수보다 더 많은 개수를 요청하면 저장된 데이터 수만큼만 리턴됩니다.
#      (리턴 값: "(밀리초 에포크, 데이터)" 튜플의 배열)
#
#   2. 표시할 값을 완성하면 display(이름, 표시값) 함수로 모니터에 표시할 수 있습니다.
#      * 표시값이 "숫자, 불리언 혹은 문자열"이면 그 값이 크게 표시되며,
#        예) display("my number", 123)
#      * 표시값이 1차원 "y축 값의 배열"이면 그 값이 그래프로 표시됩니다.
#        예) display("graph1", list(range(10)))
#      * 표시값이 1차원 배열 두 개의 튜플인 경우, 즉, "(x축 값 배열, y축 값 배열)"
#        튜플인 경우 그 값이 그래프로 표시됩니다.
#        예) display("graph2", (list(range(10)), list(range(20, 30))))
#      * 표시값이 문자열을 키로 하고 위 그래프를 표시하는 두 종류 값 중 하나를 밸류로 하는
#        딕셔너리인 경우 각 그래프들이 한 그래프에 표시됩니다.
#        예) display("graph3", {"graph1": list(range(10)), "graph2": list(range(20, 30))})
#
#   3. 아래 함수들을 사용해서 액츄에이터를 제어할 수 있습니다.
#      * act_led("이름", "색상값") : LED를 제어합니다. 색상값은 헥스코드를 사용할 수 있습니다.
#                                    (예: "#f00"은 빨간색, "#0f0"은 초록색, "#000"은 끄기)
#      * act_buzzer("이름", 헤르츠주파수, 밀리초길이) : 부저를 제어합니다.
#      * act_motor("이름", 속도) : 모터를 제어합니다. 속도는 RPM 단위입니다.
#      * act_servo("이름", 각도) : 서보모터를 제어합니다. 각도는 0~360 사이의 실수입니다.
#

# 아래는 센서로부터 마지막으로 보고받은 시간을 단순히 표시하는 예시입니다.

import time

last_reported_time = get_data("timestamp", 1)
if len(last_reported_time) > 0:
    display("마지막 보고 시간", last_reported_time[0][1])

time.sleep(0.5)
`;

export const clientDefaultCode = `# 할 일 : get_* 함수를 사용하여 센서 데이터를 가져오고, send 함수를 사용하여 데이터를 서버로 보내세요.
#
#   1. get_* 함수 사용법:
#        x = get_accel_x()  <- 인자 없이 함수를 호출하면 숫자 하나가 바로 리턴됩니다.
#
#   2. 사용할 수 있는 get_* 함수 (숫자 하나 리턴):
#        get_accel_x, get_accel_y, get_accel_z, get_gyro_x, get_gyro_y, get_gyro_z,
#        get_gyro_accum_x, get_gyro_accum_y, get_gyro_accum_z
#
#   3. 이외에 사용할 수 있는 get_* 함수 (x, y, z를 묶어서 숫자 세 개의 튜플 리턴)
#        get_accel, get_gyro, get_gyro_accum
#        예) acc_x, acc_y, acc_z = get_accel()
#
#   4. send 함수 사용법:
#        send("식별자", 데이터 하나)  <- 데이터는 숫자, 문자열, 불리언 타입 중 하나여야 합니다.
#

# 아래는 센서 데이터를 사용하지 않고, 단순히 센서의 시계를 서버로 보내는 예시입니다.

import time
import datetime

now_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")

print("현재 시간", type(now_time), now_time)
send("timestamp", now_time)

time.sleep(1)
`;
