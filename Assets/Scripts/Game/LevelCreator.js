#pragma strict

public var room_pfb : GameObject;
// public var d_room_pfb : GameObject;
public var tnode_pfb : GameObject;
public var wall_pfb : GameObject;
public var game_cam : GameObject;
public var player : GameObject;
public var grid_size : int = 2;


private var rooms_grid : GameObject[,];
private var room_num : float;
private var pref_rooms : float;

private var room_container : GameObject;
private var node_container : GameObject;


function Start () {
	room_container = new GameObject();
	node_container = new GameObject();

	room_container.name = "Rooms";
	node_container.name = "Transition Nodes";

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
	room_num = 0;

	create_grid ();
	add_transitions ();

	var center : GameObject = rooms_grid[grid_size/2,grid_size/2];
	center.transform.position = Vector3(center.transform.position.x, 0, center.transform.position.z);
	player.transform.position = Vector3(center.transform.position.x, 2.1, center.transform.position.z);
	game_cam.GetComponent(CamController).center_on(center.transform.position);
	
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
					create_wall(room.transform.position.x + 21.8, room.transform.position.y + 4, room.transform.position.z + 0.35, 0, room, true);	
				}
				
				//izquierda
				if (is_empty(rooms_grid[i,j-1]))
				{
					create_wall(room.transform.position.x - 0.35, room.transform.position.y + 4, room.transform.position.z + 21.8, 270, room, true);
				}
				
				//derecha
				if (is_empty(rooms_grid[i,j+1]))
				{
					create_wall(room.transform.position.x + 0.35, room.transform.position.y + 4, room.transform.position.z - 21.8, 90, room, true);	
				}
				else
				{
					create_node(room.transform.position.x, room.transform.position.z - 22.5, rooms_grid[i,j+1], room, true);
				}
				
				//abajo
				if (is_empty(rooms_grid[i+1,j]))
				{
					create_wall(room.transform.position.x - 21.8, room.transform.position.y + 4, room.transform.position.z - 0.35, 180, room, false);
				}
				else
				{
					create_node(room.transform.position.x - 22.5, room.transform.position.z, rooms_grid[i+1,j], room, false);
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
	wall.transform.Rotate(0,rot_dir,0);
	wall.transform.parent = parent.transform;
	wall.GetComponent(Renderer).enabled = visible;
}