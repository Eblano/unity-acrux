#pragma strict

public var attackRate : float = 3.0f;
public var waves : int = 2;
public var bala : Rigidbody;
public var spawn_pfb : GameObject;
public var speedBala : float = 30.0f;

private var spawnClip : AudioSource;
private var enemyHealth : EnemyHealth;
private var waitToAttack : float = 0f;
private var wavesTime : float = 0f;
private var childAim : Transform;
private var player : GameObject;
private var spawn_container : GameObject;;

function Awake() {
	spawn_container = new GameObject();
	spawn_container.name = "Spawned Mobs";
	spawn_container.transform.parent = transform;
	spawnClip = GetComponent(AudioSource);
}

function Start(){
	enemyHealth = GetComponent(EnemyHealth);
	childAim = transform.Find("Aim");
	player = GameObject.FindGameObjectWithTag("Player");
}

function Update () {
	if(enemyHealth.health <= 0)
	{
		Application.LoadLevel("MainMenu");
	}
	else
	{
		if(waitToAttack >= attackRate)
		{
			Attack();
		}
		else
		{
			waitToAttack += Time.deltaTime;
		}
	}
}

function Attack(){
	// Random de 0 a 2
	var random : int = Mathf.FloorToInt(Random.Range(0,3)); 
	
	switch(random){
		case 0 : Patron1(waves); break;
		case 1 : Patron2(waves); break;
		case 2 : Patron3(waves); break;
	}
	waitToAttack = 0;
}

function Patron1(waves : int){
	for (var j = 0; j < waves * 2; j++)
	{
		for(var i = 0 ; i < 18 ; i++)
		{
			var clone = Instantiate(bala, childAim.transform.position, childAim.transform.rotation);
			clone.velocity = -childAim.transform.TransformDirection(Vector3(0,0,30));
			childAim.transform.Rotate(Vector3(0,20,0));
		}
		
		childAim.transform.Rotate(Vector3(0,5,0));
		yield WaitForSeconds(0.5);
	}
}

function Patron2(waves : int){
	for (var j = 0; j < waves * 4; j++)
	{
		childAim.transform.LookAt(player.transform.position + Vector3.up * 1.5f);
		yield WaitForSeconds(0.25);
		var clone = Instantiate(bala, childAim.transform.position, childAim.transform.rotation);
		clone.velocity = childAim.transform.TransformDirection(Vector3(0,0,30));
	}
}

function Patron3(waves : int){
	spawnClip.Play();
	for (var j : int = 0; j < waves; j++)
	{
		var add_pos : Vector3 = Vector3(-10, 0, -10 + 20*(j%2));
		var clone : GameObject = Instantiate(spawn_pfb, transform.position + add_pos, Quaternion.identity);
		clone.transform.parent = spawn_container.transform;
	}
	yield WaitForSeconds(1);
}