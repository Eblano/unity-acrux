#pragma strict

public var damage : int = 10;

function Update() {
	var fwd = transform.TransformDirection (Vector3.forward);
	var hit : RaycastHit;
	if (Physics.Raycast(transform.position, fwd, hit, 2))
	{
		var col = hit.collider;
		
		if (col.tag != "EnemySphere" && col.tag != "Enemy")
		{
			
			if (col.tag == "Player")
			{
				col.GetComponent(PlayerHealth).TakeDamage(damage);	
			}
			
			Destroy(this.gameObject);
		}
	}
}