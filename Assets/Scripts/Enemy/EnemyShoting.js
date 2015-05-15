public var maximumDamage : float = 120f;
public var minimumDamage : float = 45f;
public var flashIntensity : float = 3f;
public var fadeSpeed : float = 10f;
public var ShootsPerSecond : float = 0.5f;
public var ShootClip : AudioClip;
public var waitTime : float = 0;
public var ebullet_pfb : Rigidbody;
public var speedBala = 100;

private var awake = true; // should be false by default
private var enemySight : EnemySight;
private var anim : Animator;
private var hash : HashIDs;
private var laserShootLine : LineRenderer;
public var laserShootLight : Light;
private var col : SphereCollider;
private var player : Transform;
private var playerHealth : PlayerHealth;
private var scaledDamage : float;

function Awake ()
{
    anim = GetComponent(Animator);
    enemySight = GetComponent(EnemySight);
    laserShootLine = GetComponentInChildren(LineRenderer);
    laserShootLight = laserShootLine.gameObject.light;
    col = GetComponent(SphereCollider);
    player = GameObject.FindGameObjectWithTag(Tags.player).transform;
    playerHealth = player.gameObject.GetComponent(PlayerHealth);
    hash = GameObject.FindGameObjectWithTag(Tags.gameController).GetComponent(HashIDs);
    
    laserShootLine.enabled = false;
    laserShootLight.intensity = 0f;
    scaledDamage = maximumDamage - minimumDamage;
}

function Update ()
{
	if(enemySight.playerInSight)
	{
		laserShootLine.SetPosition(0, laserShootLine.transform.position);
	    laserShootLine.SetPosition(1, player.position + Vector3.up * 1.5f);
	    laserShootLine.enabled = true;
	    if(waitTime <= 0)
	    {
	    	Shoot();
	    }
	}
	else 
	{
		laserShootLine.enabled = false;
	}
	if(waitTime > 0)
	{
		waitTime -= Time.deltaTime;
		laserShootLight.intensity = Mathf.Lerp(laserShootLight.intensity, 0f, fadeSpeed * Time.deltaTime);
	}
}

function Shoot ()
{
	waitTime = 1.0/ShootsPerSecond;
    var fractionalDistance : float = (col.radius - Vector3.Distance(transform.position, player.position)) / col.radius;
    var damage : float = scaledDamage * fractionalDistance + minimumDamage;
    AudioSource.PlayClipAtPoint(ShootClip, laserShootLight.transform.position);
    laserShootLight.intensity = flashIntensity;
    
    //
	var clone : Rigidbody = Instantiate(ebullet_pfb, transform.position, transform.rotation);
	clone.velocity = transform.TransformDirection(Vector3(0,0,30)); 
}