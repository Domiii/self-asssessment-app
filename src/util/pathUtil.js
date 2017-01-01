// see: http://stackoverflow.com/a/29855282/2228771
export function pathJoin(parts, sep){
  parts = parts.filter(p => !!p);
  var separator = sep || '/';
  var replace   = new RegExp(separator+'{1,}', 'g');
  return parts.join(separator).replace(replace, separator);
}