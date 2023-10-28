
/*
+--------------------------------------------------------------------------+
|   Main functions                                                         |
+--------------------------------------------------------------------------+
*/

// This function resets the values to start modeling
// This function performs the conversions that are needed for the calculations
function start() {
  document.getElementById("torpedo_count").value = 0; 
  document.getElementById("claw_count").value = 0; 
  document.getElementById("arm_count").value = 0; 

  // Make sure that all paremeters are converted 
  convert_to_liters("tank_volume","tank_volume_l");
  convert_to_liters("system_pneumatic_volume","system_pneumatic_volume_l");
  convert_to_liters("actuators_air_loss","actuators_air_loss_l");
  convert_to_atm("tank_max_pressure","tank_max_pressure_atm");
  convert_to_atm("tank_min_pressure","tank_min_pressure_atm");
  convert_to_K("temperature_range_c","temperature_input_k");

  // set initial colors
  document.getElementById("remaining_mov").style.color="black";
  document.getElementById("remaining_pressure_atm").style.color="black";
  document.getElementById("remaining_air_mol").style.color="black";

  // Enable the operations buttons
  controls_disabled(false);

  // Run the maths
  calculate_system_initial_status();
}


// This functions resets the system parameters to defaults values
// This function performs the conversions that are needed for the calculations
function set_defaults() {
  document.getElementById("tank_volume").value = 36 ;
  document.getElementById("tank_max_pressure").value = 3000 ;
  document.getElementById("tank_min_pressure").value = 60 ;
  document.getElementById("system_pneumatic_volume").value = 2 ;
  document.getElementById("actuators_air_loss").value = 1 ;

  // convert to working units
  convert_to_liters("tank_volume","tank_volume_l");
  convert_to_liters("system_pneumatic_volume","system_pneumatic_volume_l");
  convert_to_liters("actuators_air_loss","actuators_air_loss_l");
  convert_to_atm("tank_max_pressure","tank_max_pressure_atm");
  convert_to_atm("tank_min_pressure","tank_min_pressure_atm");

  // Disable the operations controrls since system has changed
  controls_disabled(true);
}


// This function calculates the moles in the system
// formula =>  n = PV / RT
function calculate_system_initial_status() {

  // first: calculate the total number of moles in the tank
  pressure_tank = parseFloat(document.getElementById("tank_max_pressure_atm").value);
  volume_tank = parseFloat(document.getElementById("tank_volume_l").value);
  R = 0.08206;
  temp = parseFloat(document.getElementById("temperature_input_k").value);
  moles_tank = (pressure_tank * volume_tank ) / (R * temp ); 
  
  document.getElementById("initial_tank_volume_l").value = volume_tank.toFixed(4);
  document.getElementById("initial_tank_pressure_atm").value = pressure_tank.toFixed(4);
  document.getElementById("initial_tank_temperature_k").value = temp.toFixed(4);
  document.getElementById("initial_tank_air_mol").value = moles_tank.toFixed(4);

  // second : calculate the pressure in the system once the tank is connected to the cables. Volume changes.
  pneumatic_volume = parseFloat(document.getElementById("system_pneumatic_volume_l").value);
  system_pressure = moles_tank * R * temp / (volume_tank + pneumatic_volume);
  actuator_air_loss_moles =  parseFloat(document.getElementById("actuators_air_loss_l").value) * 250.0 / ( R * temp);
  movements = moles_tank / actuator_air_loss_moles; 


  document.getElementById("initial_system_volume_l").value = (volume_tank + pneumatic_volume).toFixed(4);
  document.getElementById("initial_system_air_mol").value = moles_tank.toFixed(4);
  document.getElementById("initial_system_temperature_k").value = temp.toFixed(4);
  document.getElementById("initial_system_pressure_atm").value = system_pressure.toFixed(4);
  document.getElementById("initial_total_mov").value = Math.floor(movements); 
  
  // write the initials for the remaining table
  document.getElementById("remaining_air_mol").value = moles_tank.toFixed(4);
  document.getElementById("remaining_pressure_atm").value = system_pressure.toFixed(4);
  document.getElementById("remaining_mov").value = Math.floor(movements); 
  document.getElementById("total_mov").value =  0;  

  // Disable the operations controrls since system has changed
  controls_disabled(false);
}


// This function executes submarine model
// parameter number of movements done in between calls
function calculate_live(mov) {

  remaining_pressure = parseFloat(document.getElementById("remaining_pressure_atm").value);
  remaining_air = parseFloat(document.getElementById("remaining_air_mol").value);

  tank_volume = parseFloat(document.getElementById("tank_volume_l").value);
  system_volume = parseFloat(document.getElementById("system_pneumatic_volume_l").value);
  min_pressure_atm = parseFloat(document.getElementById("tank_min_pressure_atm").value);

  actuator_air_loss_moles =  parseFloat(document.getElementById("actuators_air_loss_l").value) * 250.0 / ( R * temp);
  claw_count = parseInt(document.getElementById("claw_count").value);
  arm_count = parseInt(document.getElementById("arm_count").value);
  torpedo_count = parseInt(document.getElementById("torpedo_count").value);

  total_movements = claw_count + arm_count + torpedo_count;

  remaining_air = remaining_air - actuator_air_loss_moles * mov ;  // moles

  if (remaining_air < actuator_air_loss_moles) {
    document.getElementById("remaining_air_mol").style.color="red";
    controls_disabled(true);
  }

  remaining_movements = remaining_air / actuator_air_loss_moles  ;
  if (remaining_movements < 1) {
    document.getElementById("remaining_mov").style.color="red";
    controls_disabled(true);
  }

  R = 0.08206;
  temp = parseFloat(document.getElementById("temperature_input_k").value);
  remaining_pressure =  (remaining_air * R * temp ) / (tank_volume + system_volume ) ; 
  if (remaining_pressure < min_pressure_atm ) {
    document.getElementById("remaining_pressure_atm").style.color="red";
    controls_disabled(true);
  }

  // Update outputs
  document.getElementById("total_mov").value =  total_movements; 
  document.getElementById("remaining_mov").value = Math.floor( remaining_movements); 
  document.getElementById("remaining_air_mol").value = remaining_air.toFixed(4);
  document.getElementById("remaining_pressure_atm").value = remaining_pressure.toFixed(4);

}


/*-----------------------------------------------*/
/*-- Functions for temperature and depth       --*/
/*-----------------------------------------------*/

// This function resets Temperature = 25
function temperature_reset() {
  document.getElementById("temperature_input_c").value = 25;  
  document.getElementById("temperature_range_c").value = 25;  
  convert_to_K("temperature_input_c", "temperature_input_k");
  calculate_live(0);
}

// This function updates the Temperature output
function temperature_change() {
  document.getElementById("temperature_input_c").value = document.getElementById("temperature_range_c").value;  
  convert_to_K("temperature_input_c", "temperature_input_k");
  calculate_live(0);
}

// This function resets Depth = 3
function depth_reset() {
  document.getElementById("depth_output").value = 3;  
  document.getElementById("depth_input").value = 3;
}

// This function updates the Depth output
function depth_change() {
  document.getElementById("depth_output").value = document.getElementById("depth_input").value;  
}


/*-----------------------------------------------*/
/*-- Functions for the "control & operations"  --*/
/*-----------------------------------------------*/

// Enable / Disable the control buttons
 // Enable the operations buttons
 // value = TRUE -> disables
 // value = FALSE -> enablesd=
 function controls_disabled(value) {
  document.getElementById("btn_torpedo").disabled=value;
  document.getElementById("btn_arm").disabled=value;
  document.getElementById("btn_claw").disabled=value;
 }

 // Action that happens when the claw is moved
function move_claw() {
  tmp = parseInt(document.getElementById("claw_count").value);
  tmp += 1;
  document.getElementById("claw_count").value = tmp; 
  calculate_live(1);   // one movement
}

// Action that happens when the arm is moved
function move_arm() {
  tmp = parseInt(document.getElementById("arm_count").value);
  tmp += 1;
  document.getElementById("arm_count").value = tmp;
  calculate_live(1);  // one movement
}

// Action that happens when the torpedo is launched
function launch_torpedo() {
  tmp = parseInt(document.getElementById("torpedo_count").value);
  tmp += 1;
  document.getElementById("torpedo_count").value = tmp; 
  calculate_live(1); // one movement
}

/*-------------------------------------------*/
/*-- auxiliary funtions for conversion     --*/
/*-------------------------------------------*/

// convert from in3 to liters
// input, output
function convert_to_liters (id,id_out) {
  tmp = parseFloat(document.getElementById(id).value);
  tmp = tmp * 0.016387064 ;
  document.getElementById(id_out).value = tmp.toFixed(4); 
  // system changed
  controls_disabled(true);
}


// convert from PSI to atm
// input, output
function convert_to_atm (id,id_out) {
  tmp = parseFloat(document.getElementById(id).value);
  tmp = tmp * 0.0680459639 ;
  document.getElementById(id_out).value = tmp.toFixed(4); 
  // system changed
  controls_disabled(true);
}


// convert from Centigrates to Kelvin
// input, output
function convert_to_K (id,id_out) {
  tmp = parseFloat(document.getElementById(id).value);
  tmp = tmp + 273.15 ;
  document.getElementById(id_out).value = tmp.toFixed(4); 
}

// This is an alert for when the maths are wrong
function bad_data() {
  alert("Please review your model inputs!");
}
