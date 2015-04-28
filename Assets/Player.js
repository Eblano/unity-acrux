#pragma strict
public var damage:int = 1;
public var velocidad:int = 10;
public var defensa:int = 1;
function Start () {

}

function Update () {
	
}

public function updateAtrib(atributo:String, valor:int){
	switch (atributo){
		case "damage":
			damage += valor;
			break;
		case "velocidad":
			velocidad += valor;
			this.GetComponent(ThirdPersonController).walkSpeed = velocidad;
			break;
		case "defensa":
			break;
			defensa += valor;
	}
}