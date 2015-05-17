#pragma strict

public var health : float = 100f;
public var deathClip : AudioClip;
public var hitClip : AudioClip;
public var flashColor : Color = Color.cyan;
public var flashTime : float = 0.1f;
public var damageToPlayer : float = 10.0f;

private var player : Transform;
public var childBody : Transform;
private var enemySight : EnemySight;
private var timeFlash : float;
private var backColor : Color;

function Awake()
{
	player = GameObject.FindGameObjectWithTag(Tags.player).transform;
	enemySight = GetComponent(EnemySight);
	childBody = transform.Find("Body").transform.Find("Poly");
	timeFlash = 0;
	backColor = childBody.renderer.material.color;
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
		childBody.renderer.material.color = backColor;
	}
	if(health <= 0){
		justDie();
	}
}

private function justDie(){
	Destroy(this.gameObject);
}

public function TakeDamage(dmg : float)
{	
	health -= dmg;
	enemySight.personalLastSighting = player.position;
	timeFlash = flashTime;
}