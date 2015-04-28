using UnityEngine;
using System.Collections;

public class EnemyAI : MonoBehaviour
{
	public float patrolSpeed = 2f;                          // The nav mesh agent's speed when patrolling.
	public float chaseSpeed = 5f;                           // The nav mesh agent's speed when chasing.
	public float chaseWaitTime = 5f;                        // The amount of time to wait when the last sighting is reached.
	public float patrolWaitTime = 1f;                       // The amount of time to wait when the patrol way point is reached.

	// patrolling references
	public GameObject room;									// The room for reference init position

	public float minRangeNextStept;							// The min radio for next walking stept
	public float maxRangeNextStept;							// The max radio for next walking stept
	public Vector3 goToHere;								// The point to walk to
	public Vector2 xLimits;									//Limits of posible movement in X
	public Vector2 zLimits;									//Limits of posible movement in Z

	private EnemySight enemySight;                          // Reference to the EnemySight script.
	private NavMeshAgent nav;                               // Reference to the nav mesh agent.
	private Transform player;                               // Reference to the player's transform.
	//private PlayerHealth playerHealth;                      // Reference to the PlayerHealth script.
	//private LastPlayerSighting lastPlayerSighting;          // Reference to the last global sighting of the player.
	private float chaseTimer;                               // A timer for the chaseWaitTime.
	private float patrolTimer;                              // A timer for the patrolWaitTime.
	private int wayPointIndex;                              // A counter for the way point array.
	
	
	void Awake ()
	{
		// Setting up the references.
		enemySight = GetComponent<EnemySight>();
		nav = GetComponent<NavMeshAgent>();
		player = GameObject.FindGameObjectWithTag(Tags.player).transform;
		//playerHealth = player.GetComponent<PlayerHealth>();
		//lastPlayerSighting = GameObject.FindGameObjectWithTag(Tags.gameController).GetComponent<LastPlayerSighting>();

		//default init
		minRangeNextStept = 5.0f;
		maxRangeNextStept = 10.0f;

		goToHere = new Vector3(0,0,0); 
		nextWayPoint ();

		float xSize = room.renderer.bounds.size.x / 2.0f;
		float zSize = room.renderer.bounds.size.z / 2.0f;
		float xPos = room.transform.position.x;
		float zPos = room.transform.position.z;

		xLimits = new Vector2 (xPos - xSize, xPos + xSize);
		zLimits = new Vector2 (zPos - zSize, zPos + zSize);
	}
	
	
	void Update ()
	{/*
		// If the player is in sight and is alive...
		if(enemySight.playerInSight && playerHealth.health > 0f)
			// ... shoot.
			Shooting();
		
		// If the player has been sighted and isn't dead...
		else if(enemySight.personalLastSighting != lastPlayerSighting.resetPosition && playerHealth.health > 0f)
			// ... chase.
			Chasing();
		
		// Otherwise...
		else*/
			// ... patrol.
			Patrolling();
	}
	
	/*
	void Shooting ()
	{
		// Stop the enemy where it is.
		nav.Stop();
	}
	*/
	/*
	void Chasing ()
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
	
	void Patrolling ()
	{
		// Set an appropriate speed for the NavMeshAgent.
		nav.speed = patrolSpeed;
		
		// If near the next waypoint or there is no destination...
		if(/*nav.destination == lastPlayerSighting.resetPosition || */nav.remainingDistance < nav.stoppingDistance)
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

	private void nextWayPoint()
	{
		//Un random de algo dentro de una esfera con radio 1
		Vector2 ranCirc = Random.insideUnitCircle;
		Vector3 minVec = Vector3.Normalize (new Vector3 (ranCirc.x, 0, ranCirc.y)) * minRangeNextStept; // Vector del rango minimo con la orientacion random
		ranCirc = ranCirc * (maxRangeNextStept - minRangeNextStept);
		Vector3 newPos = new Vector3 (ranCirc.x, 0, ranCirc.y) + minVec;

		//Modificamos limites y arreglamos randoms
		if(newPos.z < zLimits[0] || newPos.z > zLimits[1])
		{
			newPos.z = -newPos.z;
		}

		if(newPos.x < xLimits[0] || newPos.x > xLimits[1])
		{
			newPos.x = -newPos.x;
		}

		newPos = newPos + this.transform.position; // lo centramos en el enemigo

		goToHere = newPos;
	}
}