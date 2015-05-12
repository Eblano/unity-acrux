#pragma strict

public var maximumDamage : float = 120f;
public var minimumDamage : float = 45f;
public var shotClip : AudioClip;
public var flashIntensity : float = 3f;
public var fadeSpeed : float = 10f;
public var shot : float = 1;


private var anim : Animator;
private var hash : HashIDs;
private var laserShotLine : LineRenderer;
private var laserShotLight : Light;
private var col : SphereCollider;
private var player : Transform;
private var playerHealth : PlayerHealth;
private var shooting : boolean;
private var scaledDamage : float;


function Awake ()
{
    anim = GetComponent(Animator);
    laserShotLine = GetComponentInChildren(LineRenderer);
    laserShotLight = laserShotLine.gameObject.light;
    col = GetComponent(SphereCollider);
    player = GameObject.FindGameObjectWithTag(Tags.player).transform;
    playerHealth = player.gameObject.GetComponent(PlayerHealth);
    hash = GameObject.FindGameObjectWithTag(Tags.gameController).GetComponent(HashIDs);
    
    laserShotLine.enabled = false;
    laserShotLight.intensity = 0f;
    scaledDamage = maximumDamage - minimumDamage;
}


function Update ()
{
    //var shot : float = anim.GetFloat(hash.shotFloat);
    
    // If the shot curve is peaking and the enemy is not currently shooting...
    if(shot > 0.5f && !shooting){
        // ... shoot
        Shoot();
        shot = 0;
    }
    
    // If the shot curve is no longer peaking...
    if(shot < 0.5f)
    {
        // ... the enemy is no longer shooting and disable the line renderer.
        shooting = false;
        laserShotLine.enabled = false;
        shot += Time.deltaTime / 10;
    }
    
    // Fade the light out.
    laserShotLight.intensity = Mathf.Lerp(laserShotLight.intensity, 0f, fadeSpeed * Time.deltaTime);
}


/*function OnAnimatorIK (layerIndex : int)
{
    var aimWeight : float = anim.GetFloat(hash.aimWeightFloat);
    
    anim.SetIKPosition(AvatarIKGoal.RightHand, player.position + Vector3.up);
    
    anim.SetIKPositionWeight(AvatarIKGoal.RightHand, aimWeight);
}*/


function Shoot ()
{
    shooting = true;
    
    var fractionalDistance : float = (col.radius - Vector3.Distance(transform.position, player.position)) / col.radius;

    var damage : float = scaledDamage * fractionalDistance + minimumDamage;

    playerHealth.TakeDamage(damage);
    
    ShotEffects();
}


function ShotEffects ()
{
    laserShotLine.SetPosition(0, laserShotLine.transform.position);
    
    laserShotLine.SetPosition(1, player.position + Vector3.up * 1.5f);
    
    laserShotLine.enabled = true;
    
    laserShotLight.intensity = flashIntensity;
    
    AudioSource.PlayClipAtPoint(shotClip, laserShotLight.transform.position);
}