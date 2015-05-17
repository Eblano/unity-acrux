#pragma strict

public var health : float = 100f;
public var resetAfterDeathTime : float = 5f;
public var inmuneAfterHitTime : float = 1f;
public var timeFlashing : float = 0.2;
public var deathClip : AudioClip;
public var hitClip : AudioClip;
public var flashColor : Color = Color.red;
public var lifebar : UI.Image;

private var backColor : Color;
private var inmune : boolean = false;
//Anim stuff
private var anim : Animator;
private var playerMovement : ThirdPersonController;
private var hash : HashIDs;

private var sceneFadeInOut : SceneFadeInOut;
private var timer : float;
private var playerDead : boolean;
private var flash : float;
private var childBody : Transform;


function Awake ()
{
    anim = GetComponent(Animator);
    playerMovement = GetComponent(ThirdPersonController);
    hash = GameObject.FindGameObjectWithTag(Tags.gameController).GetComponent(HashIDs);
    sceneFadeInOut = GameObject.FindGameObjectWithTag(Tags.fader).GetComponent(SceneFadeInOut);
    childBody = transform.Find("Body").transform.Find("Poly");
    backColor = childBody.renderer.material.color;
}


function Update ()
{
	lifebar.rectTransform.sizeDelta = Vector2(health*3,30);
    if(health <= 0f)
    {
        if(!playerDead)
            PlayerDying();
        else
        {
            PlayerDead();
            LevelReset();
        }
    }
    if(inmune){
    	if(inmuneAfterHitTime <= 0)
    	{
    		inmune = false;
    	}else{
    		inmuneAfterHitTime -= Time.deltaTime;
    	}
    }
    if(inmune) // inmune time MUST be greater than timeFlashing
    {
	    if(flash < timeFlashing)
		{
			if(childBody) { childBody.renderer.material.color = flashColor; }
			flash += Time.deltaTime;
		}
		else
		{
			childBody.renderer.material.color = backColor;
		}
	}
}

function PlayerDying ()
{
	/*
    playerDead = true;
    anim.SetBool(hash.deadBool, playerDead);
    */
    // AudioSource.PlayClipAtPoint(deathClip, transform.position);
    Application.LoadLevel("GameOver");
}

function PlayerDead ()
{
	/*
    if(anim.GetCurrentAnimatorStateInfo(0).nameHash == hash.dyingState)
        anim.SetBool(hash.deadBool, false);
    
    anim.SetFloat(hash.speedFloat, 0f);
    playerMovement.enabled = false;
    */
    audio.Stop();
}

function LevelReset ()
{
    timer += Time.deltaTime;
    
    if(timer >= resetAfterDeathTime)
        sceneFadeInOut.EndScene();
}

public function TakeDamage (amount : float)
{
	if(!inmune){
		inmuneAfterHitTime = 1;
		inmune = true;
	    health -= amount;
	    flash = 0f;
    }
}
