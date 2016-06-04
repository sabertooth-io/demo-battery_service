/*
* We require in the web-bluetooth library.
*/
const BluetoothDevice = require('web-bluetooth');
/*
* We set up our bluetooth device variable that'll be used to initialize a bluetooth device object.
*/
var blue;

/**
* The below callback function handles connecting to a device when a user clicks on a the connect button.
* We initiate the device with the user provided name or namePrefix required to request and connect to
* a Bluetooth Low Energy device.
*
* After the device is initialized by calling the 'new Device' method, we call the '.connect()' method.
* The connect method requests the device and connects to it.
*/
$('#connect').on('touchstart click', (event) => {
  console.log('in connect from client')
  var name = $('#nameFilter').val();
  var prefix = $('#prefixFilter').val();
  var filterObj = {}
  filterObj['services'] = ['battery_service'];
  if (name) filterObj['name'] = name;
  if (prefix) filterObj['namePrefix'] = prefix;

  blue = new BluetoothDevice(filterObj);
  console.log('in connect from client-blue', blue);

  blue.connect().then(device => {
    console.log(device);
    $('#load').hide();
    $('#connect').hide();
    $('#getvalue').show();
    $('#disconnect').show();
    $('#status').text('Connected!');
  }).catch(error => {
    console.log(error);
  })
  $('#load').show();
});

/**
* The below callback function handles disconnecting from the device by calling the 'disconnect()' method.
* disconnect() returns a Boolean indicating whether disconnecting was successful or not.
*/
$('#disconnect').on('touchstart click', (event) => {
  if (blue.disconnect()) {
    $('#status').text('Disconnected!');
    $('#connect').show();
    $('#disconnect').hide();
    $('#getvalue').hide();
  } else {
    $('#status').text('Disconnect failed!');
  }
});

/**
* The below callback function handles reading a characteristic off of the device.
* In this demo example, we pass in 'battery_service', one of the adopted services to the 'getValue()' method.
* The getValue method will do the heavy lifting to read the value from the device, parse the array buffer that's
* returned from the device and send back a value stored on an object. The object returned by the getValue
* method stores two things: 1. parsed value and 2. the original value (allows developers to parse as they need to).
*/
$('#getvalue').on('touchstart click', (event) => {
  let characteristic = 'battery_service';
  blue.getValue(characteristic)
    .then(value => {
      $('#level').text(`${value}%`);
      batteryFill(value);
    })
    .catch(error => {
      console.log(error);
    })
});

/**
* The below callback function handles cancelling the request from the device by calling the 'disconnect()' method.
* disconnect() returns a Boolean indicating whether disconnecting was successful or not.
* A user can also cancel connecting via the browser provided controls.
*/
$('#cancel').on('click', event => {
  event.preventDefault();
  $('#load').hide();
  $('#connect').show();
  $('#disconnect').hide();
  if (blue.disconnect()) $('#status').text('Not connected');
});

/**
* The below function simply updates the battery graphic with the value read from the device.
*/
function batteryFill(percentage) {
  $('#battery-fill').velocity({
    height: `${percentage}%`
  }, {
    duration: 1000,
    easing: 'linear'
  });
}
