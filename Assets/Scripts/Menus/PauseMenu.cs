using UnityEngine;
using System.Collections;

public class PauseMenu : MonoBehaviour {
	public GameObject canvas;
	public Camera gameCamera;
	public GameObject planet;
	public GameObject fullGame;
	public Camera pauseCamera;
	private bool isPaused;
	// Use this for initialization
	void Start () {
		canvas.SetActive (false);
		planet.SetActive (false);
		fullGame.SetActive (true);
		gameCamera.enabled = true;
		pauseCamera.enabled = false;
		isPaused = false;

	}

	public void changeCamera(){
		isPaused = !isPaused;
		gameCamera.enabled = isPaused;
		pauseCamera.enabled = !isPaused;
		fullGame.SetActive(isPaused);
		canvas.SetActive(!isPaused);
		planet.SetActive(!isPaused);
		}
	
	// Update is called once per frame
	void Update () {
		if (Input.GetKeyUp(KeyCode.P)) {
			changeCamera();
		}
	}
}
