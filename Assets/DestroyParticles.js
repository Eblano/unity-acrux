#pragma strict

public var destroy_after : float = 1;

function Start () {
	Destroy(this.gameObject, destroy_after);
}