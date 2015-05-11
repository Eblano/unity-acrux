#pragma strict

public var patrolSpeed : float = 2f;                          // The nav mesh agent's speed when patrolling.
public var chaseSpeed : float = 5f;                           // The nav mesh agent's speed when chasing.
public var chaseWaitTime : float = 5f;                        // The amount of time to wait when the last sighting is reached.
public var patrolWaitTime : float = 1f;                       // The amount of time to wait when the patrol way point is reached.

// patrolling references
public var room : GameObject;									// The room for reference init position

public var minRangeNextStept : float;							// The min radio for next walking stept
public var maxRangeNextStept : float;							// The max radio for next walking stept
public var goToHere : Vector3;								// The point to walk to
public var xLimits : Vector2;									//Limits of posible movement in X
public var zLimits : Vector2;									//Limits of posible movement in Z

private var enemySight : EnemySight;                          // Reference to the EnemySight script.
private var nav: NavMeshAgent;                               // Reference to the nav mesh agent.
private var player : Transform;                               // Reference to the player's transform.
//private var playerHealth : PlayerHealth;                      // Reference to the PlayerHealth script.
//private var lastPlayerSighting : LastPlayerSighting;          // Reference to the last global sighting of the player.
private var chaseTimer : float;                               // A timer for the chaseWaitTime.
private var patrolTimer : float;                              // A timer for the patrolWaitTime.