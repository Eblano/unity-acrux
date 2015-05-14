#pragma strict

public var health : float = 100f;
public var deathClip : AudioClip;
public var hitClip : AudioClip;

private var player : Transform;
private var colors : Color[] = new Color[2];
private var enemySight : EnemySight;

function Awake()
{
	player = GameObject.FindGameObjectWithTag(Tags.player).transform;
	enemySight = GetComponent(EnemySight);
	colors[0] = Color.red;
	colors[1] = Color.white;
}

public function TakeDamage(dmg : float)
{
	health -= dmg;
	enemySight.personalLastSighting = player.position;
	renderer.material.color = colors[0];
	yield WaitForSeconds(0.5);
	renderer.material.color = colors[1];
}