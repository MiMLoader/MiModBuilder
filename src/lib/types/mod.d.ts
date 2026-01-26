interface Mod {
  name?: string;
  description?: string;
  author?: string | string[];
  version?: string;
  homepage?: string;
  waldo?: boolean;
  main?: string | false;
  dependencies?: `${string}@${string}+${string}`[];
  priority?: number;
  tags?: string[];
}
