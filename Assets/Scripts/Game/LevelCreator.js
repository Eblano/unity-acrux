#pragma strict

public var room_pfb : GameObject;
public var tnode_pfb : GameObject;
public var game_cam : GameObject;
public var player : GameObject;
public var grid_size : int = 2;

private var rooms_grid : GameObject[,];

function Start () {
	grid_size += 2;
	rooms_grid = new GameObject[grid_size,grid_size];

	create_grid ();
	add_transitions ();

	var center : GameObject = rooms_grid[grid_size/2,grid_size/2];
	center.transform.position = Vector3(center.transform.position.x, 0, center.transform.position.z);
	player.transform.position = Vector3(center.transform.position.x, 2.1, center.transform.position.z);
	game_cam.GetComponent(CamController).center_on(center.transform.position);
}

function create_grid() {
	// magia pagana con randoms
	// hard coded por ahora
	for (var i : int = 1; i < grid_size - 1; i++)
	{
		for (var j : int = 1; j < grid_size - 1; j++)
		{
			var pos : Vector3 =  Vector3((i-1)*45, -30, (j-1)*-45);
			
			var room : GameObject = Instantiate(room_pfb, pos, Quaternion.identity);
			rooms_grid[i,j] = room;
		}
	}
}

function add_transitions() {
	for (var i : int = 1; i < grid_size - 1; i++)
	{
		for (var j : int = 1; j < grid_size - 1; j++)
		{
			var room : GameObject = rooms_grid[i,j];
			if (!is_empty(room))
			{
				
				//arriba
				/*
				if (is_empty(rooms_grid[i-1,j]))
				{
					
				}
				*/
				
				//izquierda
				/*
				if (is_empty(rooms_grid[i,j-1]))
				{
					
				}
				*/
				
				//derecha
				if (is_empty(rooms_grid[i,j+1]))
				{
					
				}
				else
				{
					var tn_pos_r : Vector3 = Vector3(room.transform.position.x, -0.5, room.transform.position.z - 22.5);
					var trans_node_r : GameObject = Instantiate(tnode_pfb, tn_pos_r, Quaternion.identity);
					var tn_script_r : Transition = trans_node_r.GetComponentInChildren(Transition);
					tn_script_r.next_room = rooms_grid[i,j+1];
					tn_script_r.prev_room = room;
					tn_script_r.game_cam = game_cam;
				}
				
				//abajo
				if (is_empty(rooms_grid[i+1,j]))
				{
					
				}
				else
				{
					var tn_pos_d : Vector3 = Vector3(room.transform.position.x + 22.5, -0.5, room.transform.position.z);
					var trans_node_d : GameObject = Instantiate(tnode_pfb, tn_pos_d, Quaternion.identity);
					var tn_script_d : Transition = trans_node_d.GetComponentInChildren(Transition);
					tn_script_d.next_room = rooms_grid[i+1,j];
					tn_script_d.prev_room = room;
					tn_script_d.game_cam = game_cam;
				}
				
			}
		}
	}
}

function is_empty(obj : GameObject) {
	if (obj != null)
		return obj.GetComponents(Component).length == 1;
	else
		return true;
}