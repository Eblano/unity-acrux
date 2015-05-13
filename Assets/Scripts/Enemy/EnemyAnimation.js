#pragma strict

public var deadZone : float = 5f;

private var player : Transform;
private var enemySight : EnemySight;
private var nav : NavMeshAgent;
private var anim : Animator;
private var hash : HashIDs;
//private var animSetup : AnimatorSetup;


function Awake ()
{
    player = GameObject.FindGameObjectWithTag(Tags.player).transform;
    enemySight = GetComponent(EnemySight);
    nav = GetComponent(NavMeshAgent);
    anim = GetComponent(Animator);
    hash = GameObject.FindGameObjectWithTag(Tags.gameController).GetComponent(HashIDs);
    
    nav.updateRotation = false;
    
    //animSetup = new AnimatorSetup(anim, hash);
    
    anim.SetLayerWeight(1, 1f);
    anim.SetLayerWeight(2, 1f);
    
    deadZone *= Mathf.Deg2Rad;
}


function Update () 
{
    NavAnimSetup();
}


function OnAnimatorMove ()
{
    nav.velocity = anim.deltaPosition / Time.deltaTime;
    
    transform.rotation = anim.rootRotation;
}


function NavAnimSetup ()
{
    var speed : float;
    var angle : float;
    
    if(enemySight.playerInSight)
    {
        speed = 0f;
        
        angle = FindAngle(transform.forward, player.position - transform.position, transform.up);
    }
    else
    {
        speed = Vector3.Project(nav.desiredVelocity, transform.forward).magnitude;
        
        angle = FindAngle(transform.forward, nav.desiredVelocity, transform.up);
        
        if(Mathf.Abs(angle) < deadZone)
        {
            transform.LookAt(transform.position + nav.desiredVelocity);
            angle = 0f;
        }
    }
    
    //animSetup.Setup(speed, angle);
}


function FindAngle (fromVector : Vector3, toVector : Vector3, upVector : Vector3) : float
{
    if(toVector == Vector3.zero)
        return 0f;
    
    var angle : float = Vector3.Angle(fromVector, toVector);
    
    var normal : Vector3 = Vector3.Cross(fromVector, toVector);
    
    angle *= Mathf.Sign(Vector3.Dot(normal, upVector));
    
    angle *= Mathf.Deg2Rad;

    return angle;
}