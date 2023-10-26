
// This function resets the values to start modeling
// This function performs the conversions that are needed for the calculations
function start() {
  document.getElementById("torpedo_count").value = 0; 
  document.getElementById("claw_count").value = 0; 
  document.getElementById("arm_count").value = 0; 

  // Make sure that all paremeters were converted 
  convert_to_liters("Tank_volume","Tank_volume_l");
  convert_to_liters("System_pneumatic_volume","System_pneumatic_volume_l");
  convert_to_liters("Actuators_air_loss","Actuators_air_loss_l");
  convert_to_atm("Tank_max_pressure","Tank_max_pressure_atm");
  convert_to_atm("Tank_min_pressure","Tank_min_pressure_atm");
  convert_to_K("temperature_input","temperature_input_K");

  // Enable the operations buttons
  controls_disabled(false);

  // Run the maths
  Calculate_system_initial_status();
}




// This functions resets the system parameters to defaults values
function set_defaults() {
  document.getElementById("Tank_volume").value = 36 ;
  document.getElementById("Tank_max_pressure").value = 3000 ;
  document.getElementById("Tank_min_pressure").value = 60 ;
  document.getElementById("System_pneumatic_volume").value = 2 ;
  document.getElementById("Actuators_air_loss").value = 1 ;

  // convert to working units
  convert_to_liters("Tank_volume","Tank_volume_l");
  convert_to_liters("System_pneumatic_volume","System_pneumatic_volume_l");
  convert_to_liters("Actuators_air_loss","Actuators_air_loss_l");
  convert_to_atm("Tank_max_pressure","Tank_max_pressure_atm");
  convert_to_atm("Tank_min_pressure","Tank_min_pressure_atm");

  // Disable the operations controrls since system has changed
  controls_disabled(true);
}

// This function calculates the moles in the system
// formula =>  n = PV / RT
function Calculate_system_initial_status() {
  pressure = parseFloat(document.getElementById("Tank_max_pressure_atm").value);
  volume_tank = parseFloat(document.getElementById("Tank_volume_l").value);
  volume_system = parseFloat(document.getElementById("System_pneumatic_volume_l").value);
  R = 0.08206;
  temp = parseFloat(document.getElementById("temperature_input_K").value);

  // initial_air_mol
  moles = ((pressure * (volume_tank + volume_system) ) / (R * temp )).toFixed(4); 
  document.getElementById("initial_air_mol").value = moles;
  document.getElementById("remaining_air").value = moles;

  // initial_pressure
  document.getElementById("initial_pressure").value = pressure;
  document.getElementById("remaining_pressure").value = pressure;

  // initial_movements
  actuator_air_loss_moles = 0.1;
  movements = moles / actuator_air_loss_moles; 
  document.getElementById("initial_total_mov").value = Math.floor(movements);
  document.getElementById("total_mov").value =  0; 
  document.getElementById("remaining_mov").value = Math.floor(movements); 

  // Disable the operations controrls since system has changed
  controls_disabled(false);

}
// This function executes submarine model
// parameter number of movements done in between calls
function calculate_live(mov) {

  remaining_pressure = parseFloat(document.getElementById("remaining_pressure").value);
  remaining_air = parseFloat(document.getElementById("remaining_air").value);

  tank_volume = parseInt(document.getElementById("Tank_volume").value);
  system_volume = parseInt(document.getElementById("System_pneumatic_volume").value);

  
  actuator_air_loss = 0.1;   // parseInt(document.getElementById("Actuators_air_loss").value);
  claw_count = parseInt(document.getElementById("claw_count").value);
  arm_count = parseInt(document.getElementById("arm_count").value);
  torpedo_count = parseInt(document.getElementById("torpedo_count").value);



  total_movements = claw_count + arm_count + torpedo_count;
  remaining_air = remaining_air - actuator_air_loss * mov ;  // moles
  remaining_movements = remaining_air / actuator_air_loss  ;
  R = 0.08206;
  temp = parseFloat(document.getElementById("temperature_input_K").value);
  remaining_pressure =  (remaining_air * R * temp ) / (tank_volume + system_volume ) ; 

  // Update outputs
  document.getElementById("total_mov").value =  total_movements; 
  document.getElementById("remaining_mov").value = Math.floor( remaining_movements); 
  document.getElementById("remaining_air").value = remaining_air.toFixed(4);
  document.getElementById("remaining_pressure").value = remaining_pressure.toFixed(4);
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
  calculate_live(0);
}

// This functions updates the Temperature output
function temperature_change(id_in, id_out) {
  document.getElementById("temperature_output").value = document.getElementById("temperature_input").value;  
  convert_to_K(id_in, id_out);
  calculate_live(0);
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

// Enable / Disable the control buttons
 // Enable the operations buttons
 // value = TRUE -> disables
 // value = FALSE -> enablesd=
 function controls_disabled(value) {
  document.getElementById("btn_torpedo").disabled=value;
  document.getElementById("btn_arm").disabled=value;
  document.getElementById("btn_claw").disabled=value;
 }


function move_claw() {
  tmp = parseInt(document.getElementById("claw_count").value);
  tmp += 1;
  document.getElementById("claw_count").value = tmp; 
  calculate_live(1);   // one movement
}

function move_arm() {
  tmp = parseInt(document.getElementById("arm_count").value);
  tmp += 1;
  document.getElementById("arm_count").value = tmp;
  calculate_live(1);  // one movement
}

function launch_torpedo() {
  tmp = parseInt(document.getElementById("torpedo_count").value);
  tmp += 1;
  document.getElementById("torpedo_count").value = tmp; 
  calculate_live(1); // one movement
}

function convert_to_liters (id,id_out) {
  tmp = parseFloat(document.getElementById(id).value);
  tmp = tmp * 0.016387064 ;
  document.getElementById(id_out).value = tmp.toFixed(4); 
  // system changed
  controls_disabled(true);
}

function convert_to_atm (id,id_out) {
  tmp = parseFloat(document.getElementById(id).value);
  tmp = tmp * 0.0680459639 ;
  document.getElementById(id_out).value = tmp.toFixed(4); 
  // system changed
  controls_disabled(true);
}

function convert_to_K (id,id_out) {
  tmp = parseFloat(document.getElementById(id).value);
  tmp = tmp + 273.15 ;
  document.getElementById(id_out).value = tmp.toFixed(4); 
}