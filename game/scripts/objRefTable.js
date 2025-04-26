const C3 = self.C3;
self.C3_GetObjectRefTable = function () {
	return [
		C3.Plugins.TiledBg,
		C3.Plugins.Sprite,
		C3.Behaviors.Platform,
		C3.Plugins.Keyboard,
		C3.Plugins.Mouse,
		C3.Plugins.Text,
		C3.Plugins.Touch,
		C3.Plugins.Mouse.Cnds.OnClick,
		C3.Plugins.Keyboard.Cnds.OnKey,
		C3.Behaviors.Platform.Acts.SetVectorY,
		C3.Plugins.System.Cnds.Every,
		C3.Plugins.System.Acts.CreateObject,
		C3.Plugins.System.Exps.random,
		C3.Plugins.Sprite.Exps.Y,
		C3.Plugins.System.Cnds.EveryTick,
		C3.Plugins.Sprite.Acts.SetX,
		C3.Plugins.Sprite.Exps.X,
		C3.Plugins.System.Exps.dt,
		C3.Plugins.Text.Acts.SetText,
		C3.Plugins.Sprite.Cnds.OnCollision,
		C3.Plugins.System.Acts.RestartLayout,
		C3.Plugins.System.Acts.ResetEventVar,
		C3.Plugins.Sprite.Cnds.IsOnScreen,
		C3.Plugins.Sprite.Cnds.CompareX,
		C3.Plugins.System.Cnds.TriggerOnce,
		C3.Plugins.System.Acts.AddVar,
		C3.Plugins.Sprite.Cnds.CompareY,
		C3.Plugins.Touch.Cnds.OnTapGesture
	];
};
self.C3_JsPropNameTable = [
	{fundo: 0},
	{player: 0},
	{Platform: 0},
	{Jogador: 0},
	{Keyboard: 0},
	{Mouse: 0},
	{CANO: 0},
	{pontos: 0},
	{Touch: 0}
];

self.InstanceType = {
	fundo: class extends self.ITiledBackgroundInstance {},
	player: class extends self.ISpriteInstance {},
	Jogador: class extends self.ISpriteInstance {},
	Keyboard: class extends self.IInstance {},
	Mouse: class extends self.IInstance {},
	CANO: class extends self.ISpriteInstance {},
	pontos: class extends self.ITextInstance {},
	Touch: class extends self.IInstance {}
}