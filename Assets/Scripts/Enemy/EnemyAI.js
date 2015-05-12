#pragma strict

public var patrolSpeed : float = 2f;                          	// The nav mesh agent's speed when patrolling.
public var chaseSpeed : float = 5f;                           	// The nav mesh agent's speed when chasing.
public var chaseWaitTime : float = 5f;                        	// The amount of time to wait when the last sighting is reached.
public var patrolWaitTime : float = 1f;                       	// The amount of time to wait when the patrol way point is reached.

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
	// If the player is in sight and is alive...
	if(enemySight.playerInSight && playerHealth.health > 0f)
		Shooting();
	/*	
	// If the player has been sighted and isn't dead...
	else if(enemySight.personalLastSighting != lastPlayerSighting.resetPosition && playerHealth.health > 0f)
		// ... chase.
		Chasing();
	
	// Otherwise...
	*/
	else
		Patrolling();
}


function Shooting ()
{
	nav.Stop();
}

/*
function Chasing ()
{
	// Create a vector from the enemy to the last sighting of the player.
	Vector3 sightingDeltaPos = enemySight.personalLastSighting - transform.position;
	
	// If the the last personal sighting of the player is not close...
	if(sightingDeltaPos.sqrMagnitude > 4f)
		// ... set the destination for the NavMeshAgent to the last personal sighting of the player.
		nav.destination = enemySight.personalLastSighting;
	
	// Set the appropriate speed for the NavMeshAgent.
	nav.speed = chaseSpeed;
	
	// If near the last personal sighting...
	if(nav.remainingDistance < nav.stoppingDistance)
	{
		// ... increment the timer.
		chaseTimer += Time.deltaTime;
		
		// If the timer exceeds the wait time...
		if(chaseTimer >= chaseWaitTime)
		{
			// ... reset last global sighting, the last personal sighting and the timer.
			lastPlayerSighting.position = lastPlayerSighting.resetPosition;
			enemySight.personalLastSighting = lastPlayerSighting.resetPosition;
			chaseTimer = 0f;
		}
	}
	else
		// If not near the last sighting personal sighting of the player, reset the timer.
		chaseTimer = 0f;
}
*/

function Patrolling ()
{
	nav.speed = patrolSpeed;
	
	if(nav.remainingDistance < nav.stoppingDistance)
	{
		// ... increment the timer.
		patrolTimer += Time.deltaTime;
		
		// If the timer exceeds the wait time...
		if(patrolTimer >= patrolWaitTime)
		{

			nextWayPoint ();
			// Reset the timer.
			patrolTimer = 0;
		}
	}
	else
	{
		// If not near a destination, reset the timer.
		patrolTimer = 0;
	}
	
	// Set the destination to the patrolWayPoint.
	nav.destination = goToHere;
}

private function nextWayPoint()
{
	//Un random de algo dentro de una esfera con radio 1
	var ranCirc : Vector2 = Random.insideUnitCircle;
	var minVec : Vector3 = Vector3.Normalize (new Vector3 (ranCirc.x, 0, ranCirc.y)) * minRangeNextStept; // Vector del rango minimo con la orientacion random
	ranCirc = ranCirc * (maxRangeNextStept - minRangeNextStept);
	var newPos : Vector3 = new Vector3 (ranCirc.x, 0, ranCirc.y) + minVec;

	//Modificamos limites y arreglamos randoms
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