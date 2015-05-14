#pragma strict

function Update() {
		transform.Rotate(Vector3.right * Time.deltaTime * 40);
		transform.Rotate(Vector3.up * Time.deltaTime * 40, Space.World);
}

function OnTriggerEnter ( other:Collider){
	if (other.name == "Player" ){
		other.GetComponent(Player).updateAtrib("defensa", 1);
		Destroy(this.gameObject, 0);
	}	
}