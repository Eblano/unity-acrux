#pragma strict

public var patrolSpeed : float = 5f;
public var chaseSpeed : float = 10f;
public var chaseWaitTime : float = 0.1f;
public var patrolWaitTime : float = 0.3f;

// patrolling references
public var floor : GameObject;

public var minRangeNextStept : float = 5.0f;
public var maxRangeNextStept  : float = 10.0f;
private var goToHere : Vector3;
private var xLimits : Vector2;
private var zLimits : Vector2;

private var enemySight : EnemySight;
private var nav : NavMeshAgent;
private var player : Transform;
private var playerHealth: PlayerHealth;

private var chaseTimer : float;
private var patrolTimer : float;
private var wayPointIndex : int;

function Awake ()
{
	enemySight = GetComponent(EnemySight);
	enemySight.fieldOfViewAngle = 180;
    nav = GetComponent(NavMeshAgent);
    player = GameObject.FindGameObjectWithTag(Tags.player).transform;
    playerHealth = player.GetComponent(PlayerHealth);

	goToHere = new Vector3(0,0,0); 
	nextWayPoint ();

	var xSize : float = floor.renderer.bounds.size.x / 2.0f;
	var zSize : float = floor.renderer.bounds.size.z / 2.0f;
	var xPos : float = floor.transform.position.x;
	var zPos : float = floor.transform.position.z;

	xLimits = new Vector2 (xPos - xSize, xPos + xSize);
	zLimits = new Vector2 (zPos - zSize, zPos + zSize);
}


function Update ()
{
	if(enemySight.playerInSight && playerHealth.health > 0f)
		Shooting();
		
	else if(enemySight.personalLastSighting != enemySight.resetSighting && playerHealth.health > 0f)
		Chasing();
	
	else
		Patrolling();
}

function Shooting ()
{
	Chasing();
	transform.LookAt(player.position + Vector3.up * 1.5f);
}


function Chasing ()
{
	var sightingDeltaPos : Vector3 = enemySight.personalLastSighting - transform.position;
	
	if(sightingDeltaPos.sqrMagnitude > 4f)
		nav.destination = enemySight.personalLastSighting;
	
	nav.speed = chaseSpeed;
	
	if(nav.remainingDistance < nav.stoppingDistance)
	{
		chaseTimer += Time.deltaTime;
		
		if(chaseTimer >= chaseWaitTime)
		{
			enemySight.personalLastSighting = enemySight.resetSighting;
			chaseTimer = 0f;
		}
	}
	else
		chaseTimer = 0f;
}


function Patrolling ()
{
	nav.speed = patrolSpeed;
	
	if(nav.remainingDistance < nav.stoppingDistance)
	{
		patrolTimer += Time.deltaTime;
		
		if(patrolTimer >= patrolWaitTime)
		{

			nextWayPoint ();
			patrolTimer = 0;
		}
	}
	else
	{
		patrolTimer = 0;
	}
	
	nav.destination = goToHere;
}

private function nextWayPoint()
{
	var ranCirc : Vector2 = Random.insideUnitCircle;
	var minVec : Vector3 = Vector3.Normalize (new Vector3 (ranCirc.x, 0, ranCirc.y)) * minRangeNextStept; // Vector del rango minimo con la orientacion random
	ranCirc = ranCirc * (maxRangeNextStept - minRangeNextStept);
	var newPos : Vector3 = new Vector3 (ranCirc.x, 0, ranCirc.y) + minVec;

	if(newPos.z < zLimits[0] || newPos.z > zLimits[1])
	{
		newPos.z = -newPos.z;
	}

	if(newPos.x < xLimits[0] || newPos.x > xLimits[1])
	{
		newPos.x = -newPos.x;
	}

	newPos = newPos + this.transform.position; 

	goToHere = newPos;
	
}
