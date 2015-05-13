#pragma strict

public var next_room : GameObject;
public var prev_room : GameObject;
public var game_cam : GameObject;

private var gcscript : LevelCreator;

function Start() {
	var gc : GameObject = GameObject.Find("GameController");
	gcscript = gc.GetComponent(LevelCreator);
}

function OnTriggerEnter (other : Collider) {
	if (other.tag == "Player")
	{
		var pscript = other.GetComponentInChildren(ThirdPersonController);
		if (next_room.GetComponent(Room).is_active())
		{
			next_room.GetComponent(Room).lower(); 
			prev_room.GetComponent(Room).raise(); 
			game_cam.GetComponent(CamController).move_to(prev_room.transform.position);
			notify_map_move( 
				(prev_room.transform.position.z/-45)+1,
				(prev_room.transform.position.x/-45)-1
			);
		}
		else
		{
			next_room.GetComponent(Room).raise(); 
			prev_room.GetComponent(Room).lower(); 
			game_cam.GetComponent(CamController).move_to(next_room.transform.position);
			notify_map_move(
				(next_room.transform.position.z/-45)+1,
				(next_room.transform.position.x/-45)-1
			);
		}
		pscript.isControllable = false;
		yield WaitForSeconds (1);
		pscript.isControllable = true;
	}
}

function notify_map_move(x : int, y : int) {
	gcscript.move_p_node(x,y);
}