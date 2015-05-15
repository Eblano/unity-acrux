public var speedBala = 100;
public var bala : Rigidbody;
public var shoot_bar : UI.Image;

private var canShoot = true;
public var time : float = 0;

function Update () {
    if (Input.GetButton("Fire1") && canShoot){	
		clone = Instantiate(bala, transform.position, transform.rotation);
		clone.velocity = -transform.TransformDirection( Vector3(0,0,speedBala));
		canShoot = false;
		Invoke("enableShot",.5);
		// Destroy(clone,.5);
	}
	if (!canShoot)
	{
		time += Time.deltaTime;
		
		if (time > 0.5)
			time = 0.5;
		
		shoot_bar.rectTransform.sizeDelta = Vector2(300f*time*2,10f);
	}
	else
	{
		time = 0;
		shoot_bar.rectTransform.sizeDelta = Vector2(300f,10f);
	}
	
	
}
function enableShot (){
	canShoot = true;
}