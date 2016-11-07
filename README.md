# MES-LuaDoc

This package created for generate documentation for Lua language. This package is meant to be one movement to simplify your life.

Create *js* file with similar code

```javascript
const MesLuaDoc = require('mes-luadoc');

MesLuaDoc.MesLuaDoc('.')
```

And for example we have .lua file with documentation

```javascript
local Diary = {};
Diary.metatable = {};
Diary.metatable.__index = Diary;

--[=====[
	@type func
	@name Diary:init
	@brief Init diary variables
--]=====]
function Diary:init()
end

--[=====[
    @type func
	@name Diary:toggle
	@param state:bool Diary will be close or open
	@brief Toggle diary visibility
--]=====]
function Diary:toggle(state)
end
```

Attention! You need have multiline comments
`--[=====[ Your docs --]=====]`

And now run doc generator!

<img src="https://s12.postimg.org/8lknm939p/cli.png">

Programm create *docs* folder with documentation

<img src="https://s18.postimg.org/deicxgk09/result.png">