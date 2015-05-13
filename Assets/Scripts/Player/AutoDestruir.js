public var particles_pfb : GameObject;

function Start () {
	Destroy(this.gameObject, 1);
}

function Update() {
	var fwd = transform.TransformDirection (Vector3.forward);
	var hit : RaycastHit;
	if (Physics.Raycast(transform.position, fwd, hit, 2))
	{
		if (hit.collider.tag != "Player")
		{
			var particle : GameObject = Instantiate(particles_pfb, transform.position, Quaternion.identity);
			particle.transform.Rotate(-90,0,0);
			Destroy(this.gameObject);
		}
	}
}