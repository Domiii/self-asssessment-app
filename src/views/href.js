import { routePaths } from './routes';

export function hrefConceptView(ownerId, conceptId, mode) {
  const url = [];

  console.log([ownerId, conceptId, mode]);

  url.push(routePaths.CONCEPT_VIEW);
  if (ownerId && conceptId) {
    url.push(`${ownerId}/${conceptId}`);
  }
  else if (!mode) {
    return '/';
  }

  if (mode) {
    url.push(mode);
  }
  return url.join('/');
}