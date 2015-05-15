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
	if(timeFlash >= 0)
	{
		if(!sleeping)
			sleep();
		else
			wakeUp();
		if( timeFlash >= 0.8)
			childBody.renderer.material.color = flashColor;
		else
		{
			childBody.renderer.material.color = Color.white;
			timeFlash = 0;
		}
		timeFlash -= Time.deltaTime;
	}
}

public function TakeDamage(dmg : float)
{	
	health -= dmg;
	enemySight.personalLastSighting = player.position;
	timeFlash = 1.0f;
}

public function wakeUp()
{
	sleeping = false;
	this.gameObject.SetActive(!sleeping);
}

public function sleep()
{
	sleeping = true;
	this.gameObject.SetActive(!sleeping);
}