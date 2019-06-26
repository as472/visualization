from flask import Flask
from flask_socketio import SocketIO,emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret'
socketio = SocketIO(app)

driver=[

    [{"latitude": 28.48734514641103, "vehicle_number": "HR27BC5540", "longitude": 77.09270176291466, "time": "1556796892"}],
    [{"latitude": 12.922200767694047, "vehicle_number": "KA51AC5262", "longitude": 77.65949539040922, "time": "1556796802"}],
    [{"latitude": 27.12, "vehicle_number": "hbc", "longitude": 77.033945, "time": "1556796802"}],
    

    [{"latitude": 28.48180104599075 , "vehicle_number": "HR27BC5540", "longitude": 77.10117284953594, "time": "1556796802"}],
    [{"latitude": 12.920833690394865, "vehicle_number": "KA51AC5262", "longitude": 77.6647585807153, "time": "1556796892"}],
    [{"latitude": 27.12, "vehicle_number": "hbc", "longitude": 77.033945, "time": "1556796802"}],

    [{"latitude": 28.49148826291825, "vehicle_number": "HR27BC5540", "longitude": 77.08826087415218, "time": "1556796932"}],
    [{"latitude": 12.92083540926825, "vehicle_number": "KA51AC5262", "longitude": 77.66475686184191, "time": "1556796932"}],
    [{"latitude": 27.12, "vehicle_number": "hbc", "longitude": 77.033945, "time": "1556796802"}],

    [{"latitude": 28.497614867096544, "vehicle_number": "HR27BC5540", "longitude": 77.0888663828373, "time": "1556797014"}],
    [{"latitude": 12.919320508857924, "vehicle_number": "KA51AC5262", "longitude": 77.66803360747227, "time": "1556797014"}],
    [{"latitude": 27.12, "vehicle_number": "hbc", "longitude": 77.033945, "time": "1556796802"}],

    [{"latitude": 28.494026993994076, "vehicle_number": "HR27BC5540", "longitude": 77.08521576517808, "time": "1556797078"}],
    [{"latitude": 12.918227305384814, "vehicle_number": "KA51AC5262", "longitude": 77.67086688376918, "time": "1556797082"}],
    [{"latitude": 27.12, "vehicle_number": "hbc", "longitude": 77.033945, "time": "1556796802"}],

    [{"latitude": 28.490737093280806, "vehicle_number": "HR27BC5540", "longitude": 77.08191041026839, "time": "1556797014"}],
    [{"latitude": 12.917930513246937, "vehicle_number": "KA51AC5262", "longitude": 77.67147020832746, "time": "1556797122"}],
    [{"latitude": 27.12, "vehicle_number": "hbc", "longitude": 77.033945, "time": "1556796802"}],

    [{"latitude": 28.485982928148168, "vehicle_number": "HR27BC5540", "longitude": 77.07740849578158, "time": "1556796932"}],
    [{"latitude": 12.91720400276271, "vehicle_number": "KA51AC5262", "longitude": 77.67282525351294, "time": "1556797169"}],
    [{"latitude": 27.12, "vehicle_number": "hbc", "longitude": 77.033945, "time": "1556796802"}],

    [{"latitude": 28.46152430788579, "vehicle_number": "HR27BC5540", "longitude": 77.05134361982346, "time": "1556796892"}],
    [{"latitude": 12.917018937394884, "vehicle_number": "KA51AC5262", "longitude": 77.67320856227788, "time": "1556797209"}],
    [{"latitude": 27.12, "vehicle_number": "hbc", "longitude": 77.033945, "time": "1556796802"}],

    [{"latitude": 28.440453026835023, "vehicle_number": "HR27BC5540", "longitude": 77.04159922897816, "time": "1556796802"}],
    [{"latitude": 12.916992008378513, "vehicle_number": "KA51AC5262", "longitude": 77.67312892114437, "time": "1556797241"}],
    [{"latitude": 27.12, "vehicle_number": "hbc", "longitude": 77.033945, "time": "1556796802"}],
    
]

@socketio.on('connect')
def test_connect():
    print('someone connected to websocket')
    emit('responseMessage', {'data': 'Connected! ayy'})

@socketio.on('message')
def handle_message():
    print('someone sent to the websocket')

@socketio.on_error_default  
def default_error_handler(e):
    print('An error occured:')
    print(e)

@socketio.on('my event')
def handle_my_custom_event(json):
    print (json)
    i=0
    while i<27:
        emit('my response', driver[i]+driver[i+1]+driver[i+2])
        i=i+3
        socketio.sleep(1)
        if(i==27):
            i=0
        
if __name__ == '__main__':
    socketio.run(app, debug=True)