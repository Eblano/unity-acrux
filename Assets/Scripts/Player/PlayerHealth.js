#pragma strict

public var health : float = 100f;
public var resetAfterDeathTime : float = 5f;
public var deathClip : AudioClip;

private var anim : Animator;
private var playerMovement : ThirdPersonController;
private var hash : HashIDs;
private var sceneFadeInOut : SceneFadeInOut;
private var timer : float;
private var playerDead : boolean;


function Awake ()
{
    // Setting up the references.
    anim = GetComponent(Animator);
    playerMovement = GetComponent(ThirdPersonController);
    hash = GameObject.FindGameObjectWithTag(Tags.gameController).GetComponent(HashIDs);
    sceneFadeInOut = GameObject.FindGameObjectWithTag(Tags.fader).GetComponent(SceneFadeInOut);
}


function Update ()
{
    // If health is less than or equal to 0...
    if(health <= 0f)
    {
        // ... and if the player is not yet dead...
        if(!playerDead)
            // ... call the PlayerDying function.
            PlayerDying();
        else
        {
            // Otherwise, if the player is dead, call the PlayerDead and LevelReset functions.
            PlayerDead();
            LevelReset();
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
    // If the player is in the dying state then reset the dead parameter.
    if(anim.GetCurrentAnimatorStateInfo(0).nameHash == hash.dyingState)
        anim.SetBool(hash.deadBool, false);
    
    // Disable the movement.
    anim.SetFloat(hash.speedFloat, 0f);
    playerMovement.enabled = false;
    
    // Stop the footsteps playing.
    audio.Stop();
}


function LevelReset ()
{
    // Increment the timer.
    timer += Time.deltaTime;
    
    //If the timer is greater than or equal to the time before the level resets...
    if(timer >= resetAfterDeathTime)
        // ... reset the level.
        sceneFadeInOut.EndScene();
}


public function TakeDamage (amount : float)
{
    // Decrement the player's health by amount.
    health -= amount;
}