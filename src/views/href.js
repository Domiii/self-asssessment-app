import { routePaths } from './routes';

export function hrefConceptView(ownerId, conceptId) {
  return `${routePaths.CONCEPT_VIEW}/${ownerId}/${conceptId}`;
}