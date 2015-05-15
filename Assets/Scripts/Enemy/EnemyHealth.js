#pragma strict

public var health : float = 100f;
public var deathClip : AudioClip;
public var hitClip : AudioClip;
public var flashColor : Color = Color.red;
public var timeFlash : float;
public var slep : boolean = true;

private var sleeping : boolean = false;
private var player : Transform;
private var childBody : Transform;
private var enemySight : EnemySight;

function Awake()
{
	player = GameObject.FindGameObjectWithTag(Tags.player).transform;
	enemySight = GetComponent(EnemySight);
	childBody = transform.Find("Body");
	timeFlash = 0;
	health++;
}

function Update()
{
	if( timeFlash >= 0)
	{
		childBody.renderer.material.color = flashColor;
		timeFlash -= Time.deltaTime;
	}
	else
	{
		childBody.renderer.material.color = Color.white;
	}
}

public function TakeDamage(dmg : float)
{	
	health -= dmg;
	enemySight.personalLastSighting = player.position;
	timeFlash = 0.2f;
}