#pragma strict

private var location : Vector3;
private var pos_to : float;
private var go_up : boolean;
private var go_down : boolean;
private var raise_speed : float = 30;

private var e_script : EnemyContainer;
private var searched : boolean = false;

function Start() {
	location = transform.position;
	pos_to = 0;
	go_up = false;
	go_down = false;
}

function search_for_script(activate : boolean) {
	if (!searched)
	{
		searched = true;
		for (var child : Transform in transform) 
		{
			if (child.name == "Enemies")
			{
				e_script = child.GetComponent(EnemyContainer);
			}
		}
	}
	
	
	if (e_script)
	{
		if (activate)
		{
			e_script.room_wakeup();
		}
		else
		{
			e_script.room_sleep();
		}
	}
	
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
	search_for_script(true);
}

public function lower() {
	go_down = true;
	pos_to = -30;
	search_for_script(false);
}

public function is_active() {
	return transform.position.y == 0;
}