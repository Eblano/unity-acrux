#pragma strict

public var room_pfb : GameObject;
// public var d_room_pfb : GameObject;
public var tnode_pfb : GameObject;
public var wall_pfb : GameObject;
public var down_arrow_pfb : GameObject;
public var map_node_pfb : GameObject[];

public var grid_size : int = 2;

private var rooms_grid : GameObject[,];
private var map_grid : GameObject[,];
private var room_num : float;
private var pref_rooms : float;
private var room_container : GameObject;
private var node_container : GameObject;
private var map_container : GameObject;
private var map_p_node : GameObject;
private var enemy_creator : EnemyCreator;
private var game_cam : GameObject;
private var player : GameObject;

function Awake() {
	game_cam = GameObject.Find("GameCamera");
	player = GameObject.Find("Player");
}

function Start () {
	room_container = new GameObject();
	node_container = new GameObject();
	map_container = new GameObject();

	room_container.name = "Rooms";
	node_container.name = "Transition Nodes";
	map_container.name = "Map";
	
	var canvas = GameObject.Find("Canvas");
	map_container.transform.parent = canvas.transform;
	
	enemy_creator = this.gameObject.GetComponent(EnemyCreator);
	
	create_level ();
}

function Update() {
	if (Input.GetKeyUp(KeyCode.R))
	{
		create_level();
	}
}

function create_level() {
	clear_level();
	
	pref_rooms = (grid_size * grid_size) / 2;
	grid_size += 2;
	rooms_grid = new GameObject[grid_size,grid_size];
	map_grid = new GameObject[grid_size,grid_size];
	room_num = 0;

	create_grid ();
	add_transitions ();
	spawn_boss(find_room_far(grid_size/2, grid_size/2));

	var center : GameObject = rooms_grid[grid_size/2,grid_size/2];
	
	for (var child : Transform in center.transform) 
	{
		if (child.name == "Enemies")
		{
			Destroy(child.gameObject);
		}
	}
	
	center.transform.position = Vector3(center.transform.position.x, 0, center.transform.position.z);
	player.transform.position = Vector3(center.transform.position.x, 2.1, center.transform.position.z);
	game_cam.GetComponent(CamController).center_on(center.transform.position);
	game_cam.GetComponent(CamController).move_to(center.transform.position);
	
	add_map_img(grid_size/2, grid_size/2, 1);
	map_grid[grid_size/2,grid_size/2].active = true;
				
	grid_size -= 2;
}

function clear_level() {
	for (var child : Transform in room_container.transform) 
	{
		Destroy(child.gameObject);
	}
	for (var child : Transform in node_container.transform) 
	{
		Destroy(child.gameObject);
	}
	for (var child : Transform in map_container.transform) 
	{
		Destroy(child.gameObject);
	}
}

function create_grid_dumb() {
	for (var i : int = 1; i < grid_size - 1; i++)
	{
		for (var j : int = 1; j < grid_size - 1; j++)
		{
			create_room(i,j);
		}
	}
}

function get_prob(x : int, y : int, cx : int, cy: int) {
	if (x == 0 || x == grid_size - 1 || y == 0 || y == grid_size - 1)
	{
		return 0;
	}
	
	var adj_count : float = 0;
	
	if (!is_empty(rooms_grid[x-1,y])) { adj_count++; }
	if (!is_empty(rooms_grid[x+1,y])) { adj_count++; }
	if (!is_empty(rooms_grid[x,y-1])) { adj_count++; }
	if (!is_empty(rooms_grid[x,y+1])) { adj_count++; }
	
	var pa : float = 1.0f - adj_count / 5.0f;
	var pr : float = 1.0f - room_num / pref_rooms;
	pr = pr < 0 ? 0 : pr;
	var px : float = Mathf.Abs(x - cx);
	var py : float = Mathf.Abs(y - cy);
	var pp : float = 1.0f - ((px + py) / ((cx + cy) * 1.0f));
	
	var full_p : float = pp * 0.1 + pr * 0.2 + pa * 0.7 - 0.2;
	
	return full_p;
}

function create_grid() {
	var room_stack = new Stack();
	
	//cuarto base
	var last_room : GameObject = create_room(grid_size/2,grid_size/2);
	var center_i : int = Mathf.FloorToInt(last_room.transform.position.x / -45) + 1;
	var center_j : int = Mathf.FloorToInt(last_room.transform.position.z / -45) + 1;
	
	for (var c : int = 0; c < 3 && room_num < pref_rooms; c++)
	{
		room_stack.Push(last_room);
	
		while (room_stack.Count > 0)
		{
			var room : GameObject = room_stack.Pop();
			var i : int = Mathf.FloorToInt(room.transform.position.x / -45) + 1;
			var j : int = Mathf.FloorToInt(room.transform.position.z / -45) + 1;
			
			// gen rooms
			if (is_empty(rooms_grid[i+1,j]) && Random.value < get_prob(i+1, j, center_i, center_j))
			{
				last_room = create_room(i+1, j);
				room_stack.Push(last_room);
			}
			if (is_empty(rooms_grid[i-1,j]) && Random.value < get_prob(i-1, j, center_i, center_j))
			{
				last_room = create_room(i-1, j);
				room_stack.Push(last_room);
			}
			if (is_empty(rooms_grid[i,j+1]) && Random.value < get_prob(i, j+1, center_i, center_j))
			{
				last_room = create_room(i, j+1);
				room_stack.Push(last_room);
			}
			if (is_empty(rooms_grid[i,j-1]) && Random.value < get_prob(i, j-1, center_i, center_j))
			{
				last_room = create_room(i, j-1);
				room_stack.Push(last_room);
			}
		}
	}
	
	/*
	for (i = 0; i < grid_size; i++)
	{
		for (j = 0; j < grid_size; j++)
		{
			if (is_empty(rooms_grid[i,j]))
			{
				create_debug_room(i,j);
			}
		}
	}
	*/
	
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
				if (is_empty(rooms_grid[i-1,j]))
				{
					create_wall(room.transform.position.x + 21.8, room.transform.position.y + 4, room.transform.position.z, 0, room, true);	
				}
				
				//izquierda
				if (is_empty(rooms_grid[i,j-1]))
				{
					create_wall(room.transform.position.x, room.transform.position.y + 4, room.transform.position.z + 21.8, 270, room, true);
				}
				
				//derecha
				if (is_empty(rooms_grid[i,j+1]))
				{
					create_wall(room.transform.position.x, room.transform.position.y + 4, room.transform.position.z - 21.8, 90, room, true);	
				}
				else
				{
					create_node(room.transform.position.x, room.transform.position.z - 22.5, rooms_grid[i,j+1], room, true);
				}
				
				//abajo
				if (is_empty(rooms_grid[i+1,j]))
				{
					create_wall(room.transform.position.x - 21.8, room.transform.position.y + 4, room.transform.position.z, 180, room, false);
				}
				else
				{
					// create down arrow
					var d_a_pos : Vector3 = room.transform.position;
					d_a_pos.x -= 16;
					
					var d_arrow : GameObject = Instantiate(down_arrow_pfb, d_a_pos, Quaternion.identity);
					d_arrow.transform.parent = room.transform;
					d_arrow.transform.Rotate(0,-90,0);
					
					//
					create_node(room.transform.position.x - 22.5, room.transform.position.z, rooms_grid[i+1,j], room, false);
				}
				
				
				add_map_img(j, i, 0);
				enemy_creator.enemies_for(room);
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

function create_room(i : int, j : int) {
	var pos : Vector3 =  Vector3((i-1)*-45, -30, (j-1)*-45);
	var room : GameObject = Instantiate(room_pfb, pos, Quaternion.identity);
	rooms_grid[i,j] = room;
	room_num++;
	room.transform.parent = room_container.transform;
	return room;
}

/*
function create_debug_room(i : int, j : int) {
	var pos : Vector3 =  Vector3((i-1)*-45, -30, (j-1)*-45);
	var d_room : GameObject = Instantiate(d_room_pfb, pos, Quaternion.identity);
}
*/

function create_node(x : float, z:float, next_room : GameObject, prev_room : GameObject, rotate : boolean) {
	var tn_pos : Vector3 = Vector3(x, -0.5, z);
	var trans_node : GameObject = Instantiate(tnode_pfb, tn_pos, Quaternion.identity);
	if (rotate) { trans_node.transform.Rotate(0,90,0); }
	trans_node.transform.parent = node_container.transform;
	var tn_script : Transition = trans_node.GetComponentInChildren(Transition);
	tn_script.next_room = next_room;
	tn_script.prev_room = prev_room;
	tn_script.game_cam = game_cam;
}

function create_wall(x: float, y : float, z : float, rot_dir : float, parent : GameObject, visible : boolean) {
	var w_pos : Vector3 = Vector3(x,y,z);
	var wall : GameObject = Instantiate(wall_pfb, w_pos, Quaternion.identity);
	wall.transform.Rotate(-90,rot_dir,0);
	wall.transform.parent = parent.transform;
	wall.GetComponent(Renderer).enabled = visible;
}

function add_map_img(x: int, y : int, type : int) {
	var map_node : GameObject = Instantiate(map_node_pfb[type], Vector3(x*16, grid_size*16-y*16, 0), Quaternion.identity);
	map_node.transform.SetParent(map_container.transform, true);
	
	if (type == 0)
	{
		map_node.active = false;
		map_grid[x,y] = map_node;
	}
	else
	{
		map_p_node = map_node;
	}
}

function move_p_node(x : int, y : int) {
	map_p_node.transform.position = Vector3(x*16, grid_size*16-y*16, 0);
	
	map_grid[x,y+2].active = true;
}

function find_room_far(cx : int, cy : int) {
	var max_dist : int = 0;
	var froom : GameObject = rooms_grid[cx,cy];

	for (var i : int = 0; i < grid_size - 2; i++)
	{
		for (var j : int = 0; j < grid_size - 2; j++)
		{
		
			if (!is_empty(rooms_grid[i,j]))
			{
				var dist : int = (cx - j) + (cy - i);
				
				if (dist > max_dist)
				{
					max_dist = dist;
					froom = rooms_grid[i,j];
				}
			}
		}
	}
	
	return froom;
}

function spawn_boss(room : GameObject) {
	for (var child : Transform in room.transform) 
	{
		if (child.name == "Enemies")
		{
			child.GetComponent(EnemyContainer).add_boss(enemy_creator.spawn_boss(room));
		}
	}
}