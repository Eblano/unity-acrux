#pragma strict

public var fadeSpeed : float = 1.5f;
public var nextSceneIndex : int;       
private var sceneStarting : boolean = true;     // Whether or not the scene is still fading in.

function Awake ()
{
    guiTexture.pixelInset = new Rect(0f, 0f, Screen.width, Screen.height);
}

function Update ()
{
    if(sceneStarting)
        StartScene();
}

function FadeToClear ()
{
    guiTexture.color = Color.Lerp(guiTexture.color, Color.clear, fadeSpeed * Time.deltaTime);
}

function FadeToBlack ()
{
    guiTexture.color = Color.Lerp(guiTexture.color, Color.black, fadeSpeed * Time.deltaTime);
}

function StartScene ()
{
    FadeToClear();
    
    // If the texture is almost clear...
    if(guiTexture.color.a <= 0.01f)
    {
        guiTexture.color = Color.clear;
        guiTexture.enabled = false;
        sceneStarting = false;
    }
}

public function EndScene ()
{
    guiTexture.enabled = true;
    FadeToBlack();
    if(guiTexture.color.a >= 0.95f)
        Application.LoadLevel(nextSceneIndex); // Level to next scene
}