## deployment notes

I'm having issues with setting a sourcemap for orbitcontrols while maintaining type-checking, so at deploy, change the code to import from here:

```js
import { OrbitControls } from "orbitControls";
```
