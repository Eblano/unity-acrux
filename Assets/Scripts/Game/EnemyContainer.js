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

public function add_boss(boss : GameObject) {
	//clear
	for (var child : Transform in transform) 
	{
		Destroy(child.gameObject);
	}
	
	//put boss in room
	boss.transform.parent = transform;	
}