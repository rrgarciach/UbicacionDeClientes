/* 
 Chat Example for Bluetooth Serial PhoneGap Plugin
 http://github.com/don/BluetoothSerial
 
 Copyright 2013 Don Coleman
 
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
var bluetoothSerial = cordova.require('bluetoothSerial');

var app = {
    initialize: function() {
        this.bind();
        listButton.style.display = "none";
    },
    bind: function() {
        document.addEventListener('deviceready', this.deviceready, false);
    },
    deviceready: function() {
        // note that this is an event handler so the scope is that of the event
        // so we need to call app.foo(), and not this.foo()

        // wire buttons to functions        
        connectButton.ontouchstart = app.connect;
        listButton.ontouchstart = app.list;

        printButton.ontouchstart = app.sendString;
//        sendData.onsubmit = app.sendData;
        //temperatureform.onsubmit = app.getTemperature;

        disconnectButton.ontouchstart = app.disconnect;

        // listen for messages
        bluetoothSerial.subscribe("\n", app.onmessage, app.generateFailureFunction("Subscribe Failed"));

        // get a list of peers
        setTimeout(app.list, 2000);
    },
    list: function(event) {
        deviceList.firstChild.innerHTML = "Discovering...";
        app.setStatus("Buscando dispositivos...");
        bluetoothSerial.list(app.ondevicelist, app.generateFailureFunction("List Failed"));
    },
    connect: function() {
        var device = deviceList[deviceList.selectedIndex].value;
        //alert(device);
        app.disable(connectButton);
        app.setStatus("Conectando...");
        console.log("Requesting connection to " + device);
        bluetoothSerial.connect(device, app.onconnect, app.ondisconnect);
    },
    disconnect: function(event) {
        if (event) {
            event.preventDefault();
        }

        app.setStatus("Desconectando...");
        bluetoothSerial.disconnect(app.ondisconnect);
    },
    sendString: function(event) {
        event.preventDefault();
        alert('enviando datos...');
//        var text = document.getElementById('message').value;
        var success = function() {
//            message.value = "";
//            messages.value += ("Us: " + text);
//            messages.scrollTop = messages.scrollHeight;
        }
        
        bluetoothSerial.write('PRODUCTOS EN CONSIGNACION;', success);
        bluetoothSerial.write(';', success);
        
        setTimeout(function() {
            $('#table-renglones tbody > tr').each(function(index, item) {
//            alert($('#id_producto').html());
                var text = "";
                text = $('#cantidad').html();
                text = text + "   " + $('#id_producto').html();
                text = text + ";";
//                alert('enviado: ' + text);
                bluetoothSerial.write(text, success);
                text = "";
                text = text + $('#descripcion').html();
                text = text + ";";
//                alert('enviado: ' + text);
                bluetoothSerial.write(text, success);
                text = "";
                text = text + "                         $ " + $('#precio').html();
                text = text + "; ;";
//                alert('enviado: ' + text);
                bluetoothSerial.write(text, success);
            });
            bluetoothSerial.write('ID CONSIGNACION:;', success);
//            bluetoothSerial.write('barras;1234;', success);
//            bluetoothSerial.write('1234;', success);
            bluetoothSerial.write(' ; ; ;', success);
//            bluetoothSerial.write('barras;1234;', success);
        }, 1000);
//        alert($('#ip').val());
//        var text = str;
//        var text = "Folio: 12345;Cliente: 135;NOMBRE1;APELLIDO1;barras;";
//            var text = '1';
//        messages.value += text;
        
//        setTimeout(function() {
////        var text = $('#input-texto').val();
//        var text = "1234;";
////            var text = '1';
//            messages.value += text;
//            var success = function() {
//                message.value = "";
//                messages.value += ("Us: " + text);
//                messages.scrollTop = messages.scrollHeight;   
//            };
//            bluetoothSerial.write(text, success);
//        }, 3000);

//        setTimeout(function() {
//            text = '1234;';
//            messages.value += text;
//            bluetoothSerial.write(text, success);
//        }, 3000);
//
//        setTimeout(function() {
//            text = 'Apellido';
//            messages.value += 'Apellido';
//            bluetoothSerial.write(text, success);
//        }, 5000);
//
//        setTimeout(function() {
//            text = '1';
//            messages.value += '1';
//            bluetoothSerial.write(text, success);
//        }, 7000);
//
//        setTimeout(function() {
//            text = '1234';
//            messages.value += '1234';
//            bluetoothSerial.write(text, success);
//        }, 9000);
        
        
        return false;
    },
    getHumidity: function(event) {
        event.preventDefault();

        var text = "h";
        var success = function() {
            //message.value = "";
            //messages.value += ("Us: " + text);
            //messages.scrollTop = messages.scrollHeight;   
        };

        bluetoothSerial.write(text, success);
        return false;
    },
    hatchOpen: function(event) {
        event.preventDefault();

        //var text = message.value + "\n";
        var text = "o";
        messages.value = "Abriendo compuerta cenital.";
        var success = function() {
            message.value = "";
            messages.value = "Compuerta cenital abierta.";
            messages.scrollTop = messages.scrollHeight;
        };

        bluetoothSerial.write(text, success);
        return false;
    },
    hatchClose: function(event) {
        event.preventDefault();

        //var text = message.value + "\n";
        var text = "c";
        messages.value = "Cerrando compuerta cenital.";
        var success = function() {
            message.value = "";
            messages.value = "Compuerta cenital cerrada.";
            messages.scrollTop = messages.scrollHeight;
        };

        bluetoothSerial.write(text, success);
        return false;
    },
    ondevicelist: function(devices) {
        var option;

        // remove existing devices
        deviceList.innerHTML = "";
        app.setStatus("");

        devices.forEach(function(device) {

            option = document.createElement('option');
            if (device.hasOwnProperty("uuid")) {
                option.value = device.uuid;
            } else if (device.hasOwnProperty("address")) {
                option.value = device.address;
            } else {
                option.value = "ERROR " + JSON.stringify(device);
            }
            option.innerHTML = device.name;
            deviceList.appendChild(option);
        });

        if (devices.length === 0) {

            option = document.createElement('option');
            option.innerHTML = "No Bluetooth Devices";
            deviceList.appendChild(option);

            if (device.platform === "iOS") { // BLE
                app.setStatus("Ningun dispositivo encontrado.");
            } else { // Android 
                app.setStatus("Por favor sincronice un dispositivo.");
            }

            app.disable(connectButton);
            listButton.style.display = "";
        } else {
            app.enable(connectButton);
            listButton.style.display = "none";
            app.setStatus("" + devices.length + " dispositivos encontrados" + (devices.length === 1 ? "." : "."));
        }
    },
    onconnect: function() {
        connection.style.display = "none";
        chat.style.display = "block";
        app.setStatus("Conectado");
    },
    ondisconnect: function(reason) {
        var details = "";
        if (reason) {
            details += ": " + JSON.stringify(reason);
        }
        connection.style.display = "block";
        app.enable(connectButton);
        chat.style.display = "none";
        app.setStatus("Desconectado");
    },
    onmessage: function(message) {
        //messages.value += "Them: " + message;
//        var command = message.substring(0, 5);
//        var value = message.substring(5);
//        switch (command)
//        {
//            case "temp=":
//                value = parseFloat(value);
//                value = value / 100;
//                messages.value = "Temperatura: " + value.toPrecision(4) + "º C";
//                break;
//            case "humi=":
//                value = parseInt(value);
//                messages.value = "Humedad: " + value + " \%";
//                break;
//        }
        messages.value += "bt: " + message;
//        messages.value = "Them: " + message;
//         messages.scrollTop = messages.scrollHeight;
    },
    setStatus: function(message) { // setStatus
        console.log(message);

        window.clearTimeout(app.statusTimeout);
        statusMessage.innerHTML = message;
        statusMessage.className = 'fadein';

        // automatically clear the status with a timer
        app.statusTimeout = setTimeout(function() {
            statusMessage.className = 'fadeout';
        }, 5000);
    },
    enable: function(button) {
        button.className = button.className.replace(/\bis-disabled\b/g, '');
    },
    disable: function(button) {
        if (!button.className.match(/is-disabled/)) {
            button.className += " is-disabled";
        }
    },
    generateFailureFunction: function(message) {
        var func = function(error) {
            var details = "";
            if (reason) {
                details += ": " + JSON.stringify(reason);
            }
            app.setStatus(message + details);
        };
        return func;
    }
};
