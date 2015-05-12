#pragma strict

public var fieldOfViewAngle : float = 110f;
public var playerInSight : boolean;
public var personalLastSighting : Vector3;              // Last place this enemy spotted the player.


private var nav : NavMeshAgent;                         // Reference to the NavMeshAgent component.
private var col : SphereCollider;                       // Reference to the sphere collider trigger component.
private var anim : Animator;                            // Reference to the Animator.
private var player : GameObject;                        // Reference to the player.
private var playerAnim : Animator;                      // Reference to the player's animator component.
private var playerHealth : PlayerHealth;                // Reference to the player's health script.
private var hash : HashIDs;                             // Reference to the HashIDs.
private var previousSighting : Vector3;                 // Where the player was sighted last frame.

function Awake ()
{
    // Setting up the references.
    nav = GetComponent(NavMeshAgent);
    col = GetComponent(SphereCollider);
    anim = GetComponent(Animator);
    player = GameObject.FindGameObjectWithTag(Tags.player);
    playerAnim = player.GetComponent(Animator);
    playerHealth = player.GetComponent(PlayerHealth);
    hash = GameObject.FindGameObjectWithTag(Tags.gameController).GetComponent(HashIDs);
    
    // Set the personal sighting and the previous sighting to the reset position.
    personalLastSighting = new Vector3(1000f, 1000f, 1000f);
    previousSighting = new Vector3(1000f, 1000f, 1000f);
}


function Update ()
{    
    // If the player is alive...
    /*if(playerHealth.health > 0f)
        // ... set the animator parameter to whether the player is in sight or not.
        anim.SetBool(hash.playerInSightBool, playerInSight);
    else
        // ... set the animator parameter to false.
        anim.SetBool(hash.playerInSightBool, false);*/
}


function OnTriggerStay (other : Collider)
{
    if(other.gameObject == player) // dentro del rango
    {
        playerInSight = false;
        
        var direction : Vector3 = other.transform.position - transform.position;
        var angle : float = Vector3.Angle(direction, transform.forward); // Solo tiene vision en cierto angulo
        
        if(angle < fieldOfViewAngle * 0.5f) // si el player esa en cierto angulo
        {
            var hit : RaycastHit;
            // Queremos saber si hay algun otro objeto atravezad (up para n partir desde el piso)
            if(Physics.Raycast(transform.position + transform.up, direction.normalized, hit, col.radius)) 
            {
                if(hit.collider.gameObject == player)
                {
                    playerInSight = true;
                    personalLastSighting = player.transform.position;
                }
            }
        }
    }
}


function OnTriggerExit (other : Collider)
{
    if(other.gameObject == player)
        playerInSight = false;
}


function CalculatePathLength (targetPosition : Vector3)
{
    // Create a path and set it based on a target position.
    var path : NavMeshPath = new NavMeshPath();
    if(nav.enabled)
        nav.CalculatePath(targetPosition, path);
    
    // Create an array of points which is the length of the number of corners in the path + 2.
    var allWayPoints : Vector3[] = new Vector3[path.corners.Length + 2];
    
    // The first point is the enemy's position.
    allWayPoints[0] = transform.position;
    
    // The last point is the target position.
    allWayPoints[allWayPoints.Length - 1] = targetPosition;
    
    // The points inbetween are the corners of the path.
    for(var i = 0; i < path.corners.Length; i++)
    {
        allWayPoints[i + 1] = path.corners[i];
    }
    
    // Create a float to store the path length that is by default 0.
    var pathLength : float = 0;
    
    // Increment the path length by an amount equal to the distance between each waypoint and the next.
    for(var j = 0; j < allWayPoints.Length - 1; j++)
    {
        pathLength += Vector3.Distance(allWayPoints[j], allWayPoints[j + 1]);
    }
    
    return pathLength;
}