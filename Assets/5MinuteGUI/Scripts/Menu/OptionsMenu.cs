using UnityEngine;
using System.Collections;
using UnityEngine.UI;
namespace FMG
{
	public class OptionsMenu : MonoBehaviour {

		public Text MusicText;
		public Text EffectsText;
		public string musicPrefix = "Music: ";
		public string EffectsPrefix = "Sound effects: ";
		public string audioOff = "Off";

		public string audioOn = "On";

		public void Awake()
		{
			updateAudioText();
		}

		void updateAudioText()
		{
			float currentVol = Constants.getMusicVolume();
			if(currentVol==0)
			{
				MusicText.text = musicPrefix  + audioOff;
			}else{
				MusicText.text = musicPrefix  + audioOn;
				
			}
			currentVol = Constants.getEffectsVolume();
			if(currentVol==0)
			{
				EffectsText.text = EffectsPrefix  + audioOff;
			}else{
				EffectsText.text = EffectsPrefix  + audioOn;
				
			}

		}
		public void onCommand(string str)
		{

			if(str.Equals("MusicToggle"))
			{
				float currentMusic =  Constants.getMusicVolume();
				if(currentMusic==0)
				{
					Constants.setMusicVolume(1);
				}else{
					Constants.setMusicVolume(0);
				}
				AudioVolume[] audioVolumes = (AudioVolume[])GameObject.FindObjectsOfType(typeof(AudioVolume));
				for(int i=0; i<audioVolumes.Length; i++)
				{
					audioVolumes[i].updateVolume();
				}

				updateAudioText();
			}
			if(str.Equals("EffectsToggle"))
			{
				float currentEffects =  Constants.getEffectsVolume();
				if(currentEffects==0)
				{
					Constants.setEffectsVolume(1);
				}else{
					Constants.setEffectsVolume(0);
				}
				updateAudioText();
			
			}
		}
	}
}