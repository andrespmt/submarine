/*! JS code for submarine web | MIT License  */

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
  convert_to_atm("tank_max_pressure","tank_max_pressure_atm");
  convert_to_atm("tank_min_pressure","tank_min_pressure_atm");
  convert_to_atm("regulator_pressure","regulator_pressure_atm");
  convert_tube_to_liters("tube_diameter","tube_L1_length","tube_L1_volume_l");
  convert_tube_to_liters("tube_diameter","tube_L2_length","tube_L2_volume_l");
  convert_tube_to_liters("tube_diameter","tube_L3_length","tube_L3_volume_l");
  convert_to_liters("actuator_volume","actuator_volume_l");
  convert_to_atm("actuator_max_pressure","actuator_max_pressure_atm");
  convert_to_K("temperature_range_c","temperature_input_k");

  // set initial colors
  document.getElementById("remaining_mov").style.color="black";
  document.getElementById("remaining_pressure_atm").style.color="black";
  document.getElementById("remaining_air_mol").style.color="black";

  // Enable the operations buttons
  controls_disabled(false);

  // Run the maths
  calculate_system_initial_status_model_A();
}


// This functions resets the system parameters to defaults values
// This function performs the conversions that are needed for the calculations
function set_defaults() {
  document.getElementById("tank_volume").value = 36 ;
  document.getElementById("tank_max_pressure").value = 3000 ;
  document.getElementById("tank_min_pressure").value = 60 ;
  document.getElementById("regulator_pressure").value = 100 ;
  document.getElementById("tube_diameter").value = 1 ;
  document.getElementById("tube_L1_length").value = 10 ;
  document.getElementById("tube_L2_length").value = 15 ;
  document.getElementById("tube_L3_length").value = 15 ;
  document.getElementById("actuator_volume").value = 5 ;
  document.getElementById("actuator_max_pressure").value = 250 ;

  // convert to working units
  // Make sure that all paremeters are converted 
  convert_to_liters("tank_volume","tank_volume_l");
  convert_to_atm("tank_max_pressure","tank_max_pressure_atm");
  convert_to_atm("tank_min_pressure","tank_min_pressure_atm");
  convert_to_atm("regulator_pressure","regulator_pressure_atm");
  convert_tube_to_liters("tube_diameter","tube_L1_length","tube_L1_volume_l");
  convert_tube_to_liters("tube_diameter","tube_L2_length","tube_L2_volume_l");
  convert_tube_to_liters("tube_diameter","tube_L3_length","tube_L3_volume_l");
  convert_to_liters("actuator_volume","actuator_volume_l");
  convert_to_atm("actuator_max_pressure","actuator_max_pressure_atm");

  // Disable the operations controrls since system has changed
  controls_disabled(true);
}


// This function calculates the moles in the system
// Model A : No regulator, actuator sets MAX PRE to 250. 
//           This mean that each "actuator usage" uses a fix number of moles
//           The system will work until mols are gone or pressure is less than TANK_MIN_PRE or ACTUATOR_MAX_PRE
// formula =>  n = PV / RT
function calculate_system_initial_status_model_A() {

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
  
  // second : calculate the pressure in the system once the tank is connected to L1 Tube. Volume changes.
  L1_volume = parseFloat(document.getElementById("tube_L1_volume_l").value); 
  L1_pressure = pressure_tank * volume_tank  / (volume_tank + L1_volume);   // Ps.Vs = nt . RT   =>  Ps.Vs = ( Pt.Vt / RT ) * RT  =>  Ps = Pt.Vt / Vs 
  
  // Esto es donde tenemos que aclarar una cosa. Si consideramos que el sistema aguanta la presion inicial del tanque, los numero de moles del actuador cambian .... y las dos formulas siguientes no vales
  // Si consideramos que el actuador tiene una PRESION max y fija , entonces la formula siguente vale... pero tendremos algo raro , diferencia de presion en dos lados... tiene regulador? 
  actuator_air_loss_moles =  parseFloat(document.getElementById("actuator_volume_l").value) * parseFloat(document.getElementById("actuator_max_pressure_atm").value) / ( R * temp);   
  movements = moles_tank / actuator_air_loss_moles; 

  document.getElementById("actuator_mol_loss").value = actuator_air_loss_moles.toFixed(4);
  document.getElementById("initial_tank_L1_volume_l").value = (volume_tank + L1_volume).toFixed(4);
  document.getElementById("initial_tank_L1_air_mol").value = moles_tank.toFixed(4);
  document.getElementById("initial_system_temperature_k").value = temp.toFixed(4);
  document.getElementById("initial_tank_L1_pressure_atm").value = L1_pressure.toFixed(4);
  document.getElementById("initial_total_mov").value = Math.floor(movements); 
  
  // write the initials for the remaining table
  document.getElementById("remaining_air_mol").value = moles_tank.toFixed(4);
  document.getElementById("remaining_pressure_atm").value = L1_pressure.toFixed(4);
  document.getElementById("remaining_mov").value = Math.floor(movements); 
  document.getElementById("total_mov").value =  0;  

  // Disable the operations controrls since system has changed
  controls_disabled(false);
}


// This function executes submarine model
// parameter number of movements done in between calls
// Model A : No regulator, actuator sets MAX PRE to 250. 
//           This mean that each "actuator usage" uses a fix number of moles
//           The system will work until mols are gone or pressure is less than TANK_MIN_PRE or ACTUATOR_MAX_PRE
//
// TODO:
//        use mov index to use L2 or L3 in pressure MAX
//        add fucntion to calculate number of movements and limiting factor without having to press buttons... (this is done once, so we can compare is true after)
function calculate_live_model_A(mov) {

  remaining_pressure = parseFloat(document.getElementById("remaining_pressure_atm").value);
  remaining_air = parseFloat(document.getElementById("remaining_air_mol").value);

  volume_tank = parseFloat(document.getElementById("tank_volume_l").value);
  L1_volume = parseFloat(document.getElementById("tube_L1_volume_l").value); 
  L2_volume = parseFloat(document.getElementById("tube_L2_volume_l").value); 
  actuator_volume = parseFloat(document.getElementById("actuator_volume_l").value); 
  min_pressure_atm = parseFloat(document.getElementById("tank_min_pressure_atm").value);

  R = 0.08206;
  temp = parseFloat(document.getElementById("temperature_input_k").value);

  actuator_air_loss_moles =  parseFloat(document.getElementById("actuator_volume_l").value) * parseFloat(document.getElementById("actuator_max_pressure_atm").value) / ( R * temp);   
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

  
  remaining_pressure = (remaining_air * R * temp ) / (volume_tank + L1_volume + L2_volume + actuator_volume ) ; 
  if (remaining_pressure < min_pressure_atm ||  remaining_pressure < parseFloat(document.getElementById("actuator_max_pressure_atm").value)  ) {
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
  calculate_live_model_A(0);
}

// This function updates the Temperature output
function temperature_change() {
  document.getElementById("temperature_input_c").value = document.getElementById("temperature_range_c").value;  
  convert_to_K("temperature_input_c", "temperature_input_k");
  calculate_live_model_A(0);
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
  calculate_live_model_A(1);   // one movement
}

// Action that happens when the arm is moved
function move_arm() {
  tmp = parseInt(document.getElementById("arm_count").value);
  tmp += 1;
  document.getElementById("arm_count").value = tmp;
  calculate_live_model_A(1);  // one movement
}

// Action that happens when the torpedo is launched
function launch_torpedo() {
  tmp = parseInt(document.getElementById("torpedo_count").value);
  tmp += 1;
  document.getElementById("torpedo_count").value = tmp; 
  calculate_live_model_A(1); // one movement
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

function convert_tube_to_liters(id_dia, id, id_out) {
  diameter = parseFloat(document.getElementById(id_dia).value);
  length = parseFloat(document.getElementById(id).value);
  volume = 3.14159 * length * ( diameter * diameter ) / 4 ;   
  volume = volume * 0.016387064; // convert to liters
  document.getElementById(id_out).value = volume.toFixed(4); 
  // system changed
  controls_disabled(true);
}

// This is an alert for when the maths are wrong
function bad_data() {
  alert("Please review your model inputs!");
}
