#pragma strict
	
public var dashingBool : int;
public var walkBool : int;
public var speedFloat : int;

function Awake ()
{
    walkBool = Animator.StringToHash("Walk");
    dashingBool = Animator.StringToHash("Dash");
    speedFloat = Animator.StringToHash("Speed");
}