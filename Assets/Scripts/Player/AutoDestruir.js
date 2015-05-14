#pragma strict
public var particles_pfb : GameObject;

public var damage : float;
public var player : GameObject;

function Start () {
	player = GameObject.FindGameObjectWithTag(Tags.player);
	damage = player.GetComponent(Player).damage;
	Destroy(this.gameObject, 1);
}

function Update() {
	var fwd = transform.TransformDirection (Vector3.forward);
	var hit : RaycastHit;
	if (Physics.Raycast(transform.position, fwd, hit, 2))
	{
		var col = hit.collider;
		if (col.tag != "Player")
		{
			if(col.tag == "Enemy")
			{
				col.GetComponentInParent(EnemyHealth).TakeDamage(damage);
			}
			var particle : GameObject = Instantiate(particles_pfb, transform.position, Quaternion.identity);
			particle.transform.Rotate(-90,0,0);
			Destroy(this.gameObject);
		}
	}
}