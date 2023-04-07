import { Cachefile } from "../types/types";

declare module 'cache' {
  var cache: Cachefile;
  export = cache;
}
