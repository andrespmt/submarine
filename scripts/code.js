
// This function resets the values to start modeling
function start() {
  document.getElementById("torpedo_count").value = 0; 
  document.getElementById("claw_count").value = 0; 
  document.getElementById("arm_count").value = 0; 
  calculate();
}


// This function executes submarine model
function calculate() {
  tank_volume = parseInt(document.getElementById("Tank_volume").value);
  system_volume = parseInt(document.getElementById("System_pneumatic_volume").value);
  tank_max_pressure = parseInt(document.getElementById("Tank_max_pressure").value);
  actuator_air_loss = parseInt(document.getElementById("Actuators_air_loss").value);
  claw_count = parseInt(document.getElementById("claw_count").value);
  arm_count = parseInt(document.getElementById("arm_count").value);
  torpedo_count = parseInt(document.getElementById("torpedo_count").value);

  total_movements = claw_count + arm_count + torpedo_count;
  remaining_air = tank_volume - system_volume - actuator_air_loss * total_movements ; 
  remaining_movements = remaining_air / actuator_air_loss  ;

  document.getElementById("total_mov").value =  total_movements; 
  document.getElementById("remaining_mov").value = Math.floor( remaining_movements); 
  document.getElementById("remaining_air").value = remaining_air;
}


// This is an alert for when the maths are wrong
function bad_data() {
  alert("Please review your model inputs!");
}


// This functions resets Temperature = 25
function temperature_reset(id_in, id_out) {
  document.getElementById("temperature_output").value = 25;  
  document.getElementById("temperature_input").value = 25;  
  convert_to_K(id_in, id_out);
}

// This functions updates the Temperature output
function temperature_change(id_in, id_out) {
  document.getElementById("temperature_output").value = document.getElementById("temperature_input").value;  
  convert_to_K(id_in, id_out);
}

// This functions resets Depth = 3
function depth_reset() {
  document.getElementById("depth_output").value = 3;  
  document.getElementById("depth_input").value = 3;
}

// This functions updates the Depth output
function depth_change() {
  document.getElementById("depth_output").value = document.getElementById("depth_input").value;  
}

// This functions resets the system parameters to defaults values
function defaults() {
  document.getElementById("Tank_volume").value = 36 ;
  document.getElementById("Tank_max_pressure").value = 3000 ;
  document.getElementById("Tank_min_pressure").value = 60 ;
  document.getElementById("System_pneumatic_volume").value = 2 ;
  document.getElementById("Actuators_air_loss").value = 1 ;
}

function move_claw() {
  tmp = parseInt(document.getElementById("claw_count").value);
  tmp += 1;
  document.getElementById("claw_count").value = tmp; 
  calculate();
}

function move_arm() {
  tmp = parseInt(document.getElementById("arm_count").value);
  tmp += 1;
  document.getElementById("arm_count").value = tmp;
  calculate(); 
}

function launch_torpedo() {
  tmp = parseInt(document.getElementById("torpedo_count").value);
  tmp += 1;
  document.getElementById("torpedo_count").value = tmp; 
  calculate();
}

function convert_to_liters (id,id_out) {
  tmp = parseFloat(document.getElementById(id).value);
  tmp = tmp * 0.016387064 ;
  document.getElementById(id_out).value = tmp.toFixed(4); 
}

function convert_to_atm (id,id_out) {
  tmp = parseFloat(document.getElementById(id).value);
  tmp = tmp * 0.0680459639 ;
  document.getElementById(id_out).value = tmp.toFixed(4); 
}

function convert_to_K (id,id_out) {
  tmp = parseFloat(document.getElementById(id).value);
  tmp = tmp + 273.15 ;
  document.getElementById(id_out).value = tmp.toFixed(4); 
}