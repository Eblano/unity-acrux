#pragma strict

function Start () {
	room_sleep();
}

public function room_wakeup() {
	for (var child : Transform in transform) 
	{
		child.gameObject.active = true;
	}
} 

public function room_sleep() {
	for (var child : Transform in transform) 
	{
		child.gameObject.active = false;
	}
} 