#pragma strict

public var enemy_pfbs : GameObject[];
public var boss_pfbs : GameObject[];
public var enemy_container_pfb : GameObject;
public var maxEnemiesPerRoom : int = 3;

public function enemies_for(room : GameObject) {
	var container : GameObject = Instantiate(enemy_container_pfb, room.transform.position, Quaternion.identity);
	container.name = "Enemies";
	container.transform.parent = room.transform;
	
	var num_of_enemies = Mathf.FloorToInt(Random.value * (maxEnemiesPerRoom - 1)) + 1;
	
	for (var i : int = 0; i < num_of_enemies; i++)
	{
		var esel : int = Mathf.FloorToInt(Random.value * enemy_pfbs.Length);
		var enemy : GameObject = Instantiate(enemy_pfbs[esel], room.transform.position, Quaternion.identity);
		enemy.transform.parent = container.transform;
	}
	
}

public function spawn_boss(room : GameObject) {
	var boss : GameObject = Instantiate(boss_pfbs[0], room.transform.position, Quaternion.identity);
	// boss.transform.position.y += 5;
	return boss;
}