#pragma strict

public var attackRate : float = 3.0f;
public var waves : int = 2;
public var bala : Rigidbody;
public var speedBala : float = 30.0f;

private var enemyHealth : EnemyHealth;
private var waitToAttack : float = 0f;
private var wavesTime : float = 0f;
private var childAim : Transform;

function Start(){
	enemyHealth = GetComponent(EnemyHealth);
	childAim = transform.Find("Aim");
}

function Update () {
	if(enemyHealth.health <= 0)
	{
		Application.LoadLevel("MainMenu");
	}else{
		if(waitToAttack >= attackRate)
		{
			Attack();
		}else
		{
			waitToAttack += Time.deltaTime;
		}
	}
}

function Attack(){
	var random : int = parseInt(Random.Range(0,0)); // Random de 0.001 - 2.999
	
	switch(random){
		case 0 : StartCoroutine(Patron1(waves)); break;
		case 1 : StartCoroutine(Patron2(waves)); break;
		case 2 : StartCoroutine(Patron3(waves)); break;
	}
	waitToAttack = 0;
}

function Patron1(waves : int){
	for(var i = 0 ; i < 18 ; i++)
	{
		var clone = Instantiate(bala, childAim.transform.position, childAim.transform.rotation);
		clone.velocity = -childAim.transform.TransformDirection( Vector3(0,0,30));
		childAim.transform.Rotate(new Vector3(0,20,0));
	}
	yield WaitForSeconds(1);
}

function Patron2(waves : int){	
	yield WaitForSeconds(1);
}

function Patron3(waves : int){
	yield WaitForSeconds(1);
}