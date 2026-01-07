## Credits

uses various palettes from [KGolid's chromotome](https://github.com/kgolid/chromotome) (via https://nice-colours-quicker.netlify.app/)

## deployment notes

I'm having issues with setting a sourcemap for orbitcontrols while maintaining type-checking, so at deploy, change the code to import from here:

```js
import { OrbitControls } from "orbitControls";
```
