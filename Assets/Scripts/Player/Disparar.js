
var speedBala = 100;
var canShoot = true;
public var bala : Rigidbody;
function Update () {
    if (Input.GetButton("Fire1") && canShoot){
    	
		clone = Instantiate(bala, transform.position, transform.rotation);
		clone.velocity = -transform.TransformDirection( Vector3(0,0,speedBala));
		canShoot = false;
		Invoke("enableShot",.5);
		Destroy(clone,.5);
}
}
function enableShot (){
	canShoot = true;
}