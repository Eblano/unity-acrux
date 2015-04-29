#pragma strict

public var next_room : GameObject;
public var prev_room : GameObject;
public var game_cam : GameObject;

function OnTriggerEnter (other : Collider) {
	if (other.tag == "Player")
	{
		var pscript = other.GetComponent(ThirdPersonController);
		if (next_room.GetComponent(Room).is_active())
		{
			next_room.GetComponent(Room).lower(); 
			prev_room.GetComponent(Room).raise(); 
			game_cam.GetComponent(CamController).move_to(prev_room.transform.position);
		}
		else
		{
			next_room.GetComponent(Room).raise(); 
			prev_room.GetComponent(Room).lower(); 
			game_cam.GetComponent(CamController).move_to(next_room.transform.position);
		}
		pscript.isControllable = false;
		yield WaitForSeconds (1);
		pscript.isControllable = true;
	}
}