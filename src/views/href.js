import { routePaths } from './routes';

export function hrefConceptView(ownerId, conceptId, mode) {
  if (ownerId && conceptId) {
    const url = [];
    url.push(`${routePaths.CONCEPT_VIEW}/${ownerId}/${conceptId}`);
    if (mode) {
      url.push(mode);
    }
    return url.join('/');
  }
  return '/';
}