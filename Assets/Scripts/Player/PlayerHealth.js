#pragma strict

public var health : float = 100f;
public var resetAfterDeathTime : float = 5f;
public var inmuneAfterHitTime : float = 1f;
public var timeFlashing : float = 0.2;
public var deathClip : AudioClip;
public var hitClip : AudioClip;
public var flashColor : Color = Color.red;

private var inmune : boolean = false;
private var anim : Animator;
private var playerMovement : ThirdPersonController;
private var hash : HashIDs;
private var sceneFadeInOut : SceneFadeInOut;
private var timer : float;
private var playerDead : boolean;
private var flash : float;
private var childBody : Transform;

public var lifebar : UI.Image;

function Awake ()
{
    anim = GetComponent(Animator);
    playerMovement = GetComponent(ThirdPersonController);
    hash = GameObject.FindGameObjectWithTag(Tags.gameController).GetComponent(HashIDs);
    sceneFadeInOut = GameObject.FindGameObjectWithTag(Tags.fader).GetComponent(SceneFadeInOut);
    childBody = transform.Find("NembusCuerpo");
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
			childBody.renderer.material.color = flashColor;
			flash += Time.deltaTime;
		}
		else{
			childBody.renderer.material.color = Color.white;
		}
	}
}

function PlayerDying ()
{
    // The player is now dead.
    playerDead = true;
    
    // Set the animator's dead parameter to true also.
    anim.SetBool(hash.deadBool, playerDead);
    
    // Play the dying sound effect at the player's location.
    AudioSource.PlayClipAtPoint(deathClip, transform.position);
}

function PlayerDead ()
{
    if(anim.GetCurrentAnimatorStateInfo(0).nameHash == hash.dyingState)
        anim.SetBool(hash.deadBool, false);
    
    anim.SetFloat(hash.speedFloat, 0f);
    playerMovement.enabled = false;
    
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
/*
function Fade (start : float, end : float, length : float, currentObject : GameObject) { //define Fade parmeters 
	if (currentObject.guiTexture.color.a == start){
		for (i = 0.0; i < 1.0; i += Time.deltaTime*(1/length)) { //for the length of time 
			currentObject.guiTexture.color.a = Mathf.Lerp(start, end, i); //lerp the value of the transparency from the start value to the end value in equal increments yield; 
			currentObject.guiTexture.color.a = end; // ensure the fade is completely finished (because lerp doesn't always end on an exact value) 
		} //end for
	}
}

function FlashWhenHit (){
	Fade (0, 0.8, 0.5, GUITextureobjectname); 
	yield WaitForSeconds (.01); Fade (0.8, 0, 0.5, GUITextureobjectname); }*/