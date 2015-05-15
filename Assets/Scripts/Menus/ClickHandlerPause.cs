using UnityEngine;
using System.Collections;
using UnityEngine.UI;


namespace FMG
{
	public class ClickHandlerPause : MonoBehaviour {
		public GameObject mainMenu;
		public GameObject levelSelectMenu;
		public GameObject optionsMenu;
		public GameObject creditsMenu;
		
		public bool useLevelSelect = true;
		public bool useExitButton = true;
		
		public GameObject exitButton;
		
		
		public void onCommand(string str)
		{
			if(str.Equals("Quit"))
			{
				float temp = PlayerPrefs.GetFloat("MusicVolume",1);
				PlayerPrefs.SetFloat("MusicVolume",0);
				AudioVolume[] audioVolumes = (AudioVolume[])GameObject.FindObjectsOfType(typeof(AudioVolume));
				for(int i=0; i<audioVolumes.Length; i++)
				{
					audioVolumes[i].updateVolume();
				}
				
				PlayerPrefs.SetFloat("MusicVolume", temp);
				Application.LoadLevel("MainMenu");
				
			}
			
			if(str.Equals("LevelSelectBack"))
			{
				Constants.fadeInFadeOut(mainMenu,levelSelectMenu);
				
			}
			if(str.Equals("Exit"))
			{
				Application.Quit();
			}
			if(str.Equals("Credits"))
			{
				Constants.fadeInFadeOut(creditsMenu,mainMenu);
				
			}
			if(str.Equals("CreditsBack"))
			{
				Constants.fadeInFadeOut(mainMenu,creditsMenu);
			}
			
			
			if(str.Equals("OptionsBack"))
			{
				Constants.fadeInFadeOut(mainMenu,optionsMenu);
				
			}
			if(str.Equals("Options"))
			{
				Constants.fadeInFadeOut(optionsMenu,mainMenu);
			}
			
			
		}
	}
}
