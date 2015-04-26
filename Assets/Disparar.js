var speed = 1000.0;
var speedBala = 100;
public var bala : Rigidbody;
function Update () {
    if (Input.GetButton("Fire1")){
		clone = Instantiate(bala, transform.position, transform.rotation);
		clone.velocity = transform.TransformDirection( Vector3(0,0,speedBala));
	
	Destroy(clone,.5);
}
}