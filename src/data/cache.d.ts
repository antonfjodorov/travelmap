import { PlaceCache } from "src/types/types";

declare module 'cache' {
  var cache: PlaceCache;
  export = cache;
}
