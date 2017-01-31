export function lookupLocalized(lang, obj, entry) {
  const val = obj[entry + '_' + lang];
  if (val !== undefined) {
    return val;
  }
  return obj[entry + '_en'] || obj[entry + '_zh'];
}