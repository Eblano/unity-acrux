#pragma strict
public var clip:AudioClip;
var audioClip:AudioSource;
function Awake () {
	audioClip = GetComponent.<AudioSource>();
	audioClip.clip = clip;
	audioClip.volume = 1;
}

function playSound () {
	if (PlayerPrefs.GetFloat("EffectsVolume",1) == 1){
		audioClip.Play();
	}
}