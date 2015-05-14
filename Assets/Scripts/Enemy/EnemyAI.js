#pragma strict

public var patrolSpeed : float = 2f;                          	// The nav mesh agent's speed when patrolling.
public var chaseSpeed : float = 5f;                           	// The nav mesh agent's speed when chasing.
public var chaseWaitTime : float = 5f;                        	// The amount of time to wait when the last sighting is reached.
public var patrolWaitTime : float = 1f;                       	// The amount of time to wait when the patrol way point is reached.
//debug
public var action : String = "";

// patrolling references
public var room : GameObject;									// The room for reference init position

public var minRangeNextStept : float;							// The min radio for next walking stept
public var maxRangeNextStept  : float;							// The max radio for next walking stept
public var goToHere : Vector3;									// The point to walk to
public var xLimits : Vector2;									//Limits of posible movement in X
public var zLimits : Vector2;									//Limits of posible movement in Z

private var enemySight : EnemySight;                          	// Reference to the EnemySight script.
private var nav : NavMeshAgent;                               	// Reference to the nav mesh agent.
private var player : Transform;                               	// Reference to the player's transform.
private var playerHealth: PlayerHealth;							// Reference to the PlayerHealth script.

private var chaseTimer : float;                               		// A timer for the chaseWaitTime.
private var patrolTimer : float;                              		// A timer for the patrolWaitTime.
private var wayPointIndex : int;                              		// A counter for the way point array.


function Awake ()
{
	enemySight = GetComponent(EnemySight);
    nav = GetComponent(NavMeshAgent);
    player = GameObject.FindGameObjectWithTag(Tags.player).transform;
    playerHealth = player.GetComponent(PlayerHealth);

	//default init
	minRangeNextStept = 5.0f;
	maxRangeNextStept = 10.0f;

	goToHere = new Vector3(0,0,0); 
	nextWayPoint ();

	var xSize : float = room.renderer.bounds.size.x / 2.0f;
	var zSize : float = room.renderer.bounds.size.z / 2.0f;
	var xPos : float = room.transform.position.x;
	var zPos : float = room.transform.position.z;

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
	action = "Shooting";
	nav.Stop();
	transform.LookAt(player.position + Vector3.up * 1.5f);
}


function Chasing ()
{
	action = "Chasing";
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
	action = "Patroling";
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