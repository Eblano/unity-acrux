#pragma strict

private var offset : Vector3;
private var center : Vector3;
private var move_loc : Vector3;
private var move_dir : int;
private var move_speed : float = 40;

function Start () {
	offset = transform.position;
	move_dir = 0;
	
	transform.position = Vector3(offset.x + center.x, offset.y + center.y, offset.z + center.z);
}

function Update () {
	if (move_dir > 0)
	{
		if (move_dir == 1)
		{
			if (center.x > move_loc.x)
			{
				center.x  = center.x - move_speed * Time.deltaTime;
			}
			else
			{
				center.x = move_loc.x;
				move_dir = 0;
			}
		}
		else if (move_dir == 2)
		{
			if (center.x < move_loc.x)
			{
				center.x = center.x + move_speed * Time.deltaTime;
			}
			else
			{
				center.x = move_loc.x;
				move_dir = 0;
			}
		}
		else if (move_dir == 3)
		{
			if (center.z > move_loc.z)
			{
				center.z  = center.z - move_speed * Time.deltaTime;
			}
			else
			{
				center.z = move_loc.z;
				move_dir = 0;
			}
		}
		else if (move_dir == 4)
		{
			if (center.z < move_loc.z)
			{
				center.z = center.z + move_speed * Time.deltaTime;
			}
			else
			{
				center.z = move_loc.z;
				move_dir = 0;
			}
		}
		
		var new_pos : Vector3 = Vector3(offset.x + center.x, offset.y + center.y, offset.z + center.z);
		transform.position = new_pos;
	}
}

public function move_to(position : Vector3) {
	move_loc = position;
	
	if (center.x > move_loc.x) { move_dir = 1; }
	else if (center.x < move_loc.x) { move_dir = 2; }
	else if (center.z > move_loc.z) { move_dir = 3; }
	else if (center.z < move_loc.z) { move_dir = 4; }
	
}

public function center_on(position : Vector3) {
	center = position;
	transform.position = Vector3(offset.x + center.x, offset.y + center.y, offset.z + center.z);
}