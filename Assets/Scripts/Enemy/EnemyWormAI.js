#pragma strict

public var patrolSpeed : float = 5f;                          	// The nav mesh agent's speed when patrolling.
public var afterHitSpeed : float = 5f;
public var chaseSpeed : float = 10f;                           	// The nav mesh agent's speed when chasing.
public var chaseWaitTime : float = 1f;                        	// The amount of time to wait when the last sighting is reached.
public var patrolWaitTime : float = 1f;                       	// The amount of time to wait when the patrol way point is reached.
public var attackDelayTime : float = 1f;

public var type;

// patrolling references
public var floor : GameObject;

public var minRangeNextStept : float = 5.0f; 
public var maxRangeNextStept  : float = 10.0f;
public var goToHere : Vector3;
public var xLimits : Vector2;
public var zLimits : Vector2;

private var enemySight : EnemySight;
private var nav : NavMeshAgent;
private var player : Transform;
private var playerHealth: PlayerHealth;
private var enemyHealth: EnemyHealth;

private var chaseTimer : float;
private var patrolTimer : float;
private var wayPointIndex : int;

private var prepareToAttack : float;
private var damageToPlayer : float;
function Awake ()
{
	
	enemySight = GetComponent(EnemySight);
    nav = GetComponent(NavMeshAgent);
    player = GameObject.FindGameObjectWithTag(Tags.player).transform;
    playerHealth = player.GetComponent(PlayerHealth);
	enemyHealth = GetComponent(EnemyHealth);
	damageToPlayer = enemyHealth.damageToPlayer;
	prepareToAttack = attackDelayTime;

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
	
	if(prepareToAttack < attackDelayTime)
		prepareToAttack += Time.deltaTime;
}

function Shooting ()
{
	//miramos y nos dirigimos hacia el jugador
	transform.LookAt(player.position + Vector3.up * 1.5f);
	nav.destination = player.position;
	
	if(nav.remainingDistance < 1.0f) // pseudo tocamos al jugador
	{
		player.gameObject.GetComponent(PlayerHealth).TakeDamage(damageToPlayer);
		prepareToAttack = 0;
	}
	if(prepareToAttack < attackDelayTime)
	{
		nav.speed = afterHitSpeed;
	}else {
		nav.speed = chaseSpeed;
	}
}

function Chasing ()
{
	var sightingDeltaPos : Vector3 = enemySight.personalLastSighting - transform.position;
	
	if(sightingDeltaPos.sqrMagnitude > 4f)
		nav.destination = enemySight.personalLastSighting;
	
	if(prepareToAttack >= attackDelayTime)
		nav.speed = chaseSpeed;
	else
		nav.speed = patrolSpeed;
	
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
