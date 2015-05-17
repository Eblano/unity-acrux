#pragma strict

public var health : float = 100f;
public var deathClip : AudioClip;
public var hitClip : AudioClip;
public var flashColor : Color = Color.cyan;
public var flashTime : float = 0.1f;
public var damageToPlayer : float = 10.0f;

private var player : Transform;
public var childBody : Transform;
public var body : GameObject;
private var enemySight : EnemySight;
private var playerHealth : PlayerHealth;
private var timeFlash : float;
private var backColor : Color;

function Start()
{
	player = GameObject.FindGameObjectWithTag(Tags.player).transform;
	playerHealth = player.gameObject.GetComponent(PlayerHealth);
	enemySight = GetComponent(EnemySight);
	childBody = transform.Find("Body").transform.Find("Poly");
	timeFlash = 0;
	if (childBody) 
	{ 
		backColor = childBody.renderer.material.color;
	}
	else
	{
		backColor = Color.white;
	}
}


function Update()
{
	if( timeFlash >= 0)
	{
		if (childBody) { childBody.renderer.material.color = flashColor; }
		timeFlash -= Time.deltaTime;
	}
	else
	{
		if (childBody) { childBody.renderer.material.color = backColor; }
	}
	if(health <= 0){
		justDie();
	}
	if(Vector3.Distance(transform.position,player.position) < 4.0f)
	{
		playerHealth.TakeDamage(damageToPlayer);
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