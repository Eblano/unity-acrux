#pragma strict
	
public var dashBool : int;
public var deathBool : int;
public var walkBool : int;
public var speedFloat : int;

public var walkState : int;
public var dashState : int;

function Awake ()
{
    dashBool = Animator.StringToHash("Player Dash");
    deathBool = Animator.StringToHash("Player Death");
    walkBool = Animator.StringToHash("Player Walk");
    speedFloat = Animator.StringToHash("Player Speed");
    
    walkState = Animator.StringToHash("Player Base Layer.Walk");
    dashState = Animator.StringToHash("Player Base Layer.Dash");
}