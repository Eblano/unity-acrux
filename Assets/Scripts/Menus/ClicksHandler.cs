using UnityEngine;
using System.Collections;

public class ClicksHandler : MonoBehaviour {

	public void onCommand(string str)
	{
		if(str.Equals("Menu"))
		{

			Application.LoadLevel("MainMenu");
			
		}
		
		else if(str.Equals("Game"))
		{
			Application.LoadLevel("Main copia");
			
		}
	
		
		
	}
}
