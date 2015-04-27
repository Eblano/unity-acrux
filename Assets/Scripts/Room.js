#pragma strict

private var location : Vector3;
private var pos_to : float;
private var go_up : boolean;
private var go_down : boolean;
private var raise_speed : float = 30;

public var meep : String;

function Start() {
	location = transform.position;
	pos_to = 0;
	go_up = false;
	go_down = false;
}

function Update() {
	if (go_down)
	{
		if (transform.position.y > pos_to)
		{
			var new_y_d = transform.position.y - raise_speed * Time.deltaTime;
			var new_pos_d = Vector3(location.x, new_y_d, location.z);
			transform.position = new_pos_d;
		}
		else
		{
			transform.position = Vector3(location.x, pos_to, location.z);
			go_down = false;
		} 
	}
	else if (go_up)
	{
		if (transform.position.y < pos_to)
		{
			var new_y_u = transform.position.y + raise_speed * Time.deltaTime;
			var new_pos_u = Vector3(location.x, new_y_u, location.z);
			transform.position = new_pos_u;
		}
		else
		{
			transform.position = Vector3(location.x, pos_to, location.z);
			go_up = false;
		} 
	}
	
	
}

public function raise() {
	go_up = true;
	pos_to = 0;
}

public function lower() {
	go_down = true;
	pos_to = -30;
}

public function is_active() {
	return transform.position.y == 0;
}