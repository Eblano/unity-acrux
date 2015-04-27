using UnityEngine;
using System.Collections;

public class LevelCreator : MonoBehaviour {

	public GameObject room_pfb;
	public GameObject tnode_pfb;
	public GameObject game_cam;
	public int grid_size = 2;

	private GameObject[][] rooms_grid;

	void Start () {
		grid_size += 2;
		rooms_grid = new GameObject[grid_size][];

		create_grid ();

		GameObject center = rooms_grid[grid_size/2][grid_size/2];
		center.transform.position = new Vector3(center.transform.position.x, 0, center.transform.position.z);
	}

	void create_grid() {
		// magia pagana con randoms
		// hard coded por ahora
		for (int i = 1; i < grid_size - 1; i++)
		{
			rooms_grid[i] = new GameObject[grid_size];
			for (int j = 1; j < grid_size - 1; j++)
			{
				Vector3 pos =  new Vector3((i-1)*45, -30, (j-1)*45);
				rooms_grid[i][j] = (GameObject) Instantiate(room_pfb,pos, Quaternion.identity);
			}
		}
	}

	void add_transitions() {
		for (int i = 1; i < grid_size - 1; i++)
		{
			for (int j = 1; j < grid_size - 1; j++)
			{
				
			}
		}
	}
}
