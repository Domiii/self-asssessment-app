export const routeNames = {
  ROOT: '/',
  SIGN_IN: 'sign-in',
  USER_PROFILE: 'user',
  CONCEPTS: '',
  CONCEPT_VIEW: 'concept',
  CONCEPT_PLAY: 'play',
  NOTIFICATIONS: 'notifications',
  SUBMISSIONS: 'submissions',
  TEST: 'test'
};

export const routePaths = {
  ROOT: '/',
  SIGN_IN: `/${routeNames.SIGN_IN}`,
  USER_PROFILE: `/${routeNames.USER_PROFILE}`,
  CONCEPTS: `/${routeNames.CONCEPTS}`,
  CONCEPT_VIEW: `/${routeNames.CONCEPT_VIEW}`,
  CONCEPT_PLAY: `/${routeNames.CONCEPT_PLAY}`,
  NOTIFICATIONS: `/${routeNames.NOTIFICATIONS}`,
  SUBMISSIONS: `/${routeNames.SUBMISSIONS}`,
  TEST: `/${routeNames.TEST}`
};

export const routeTemplates = {
  ROOT: `${routeNames.ROOT}`,
  SIGN_IN: `${routeNames.SIGN_IN}`,
  USER_PROFILE: `${routeNames.USER_PROFILE}`,
  CONCEPTS: `${routeNames.CONCEPTS}`,
  CONCEPT_MODE: `${routeNames.CONCEPT_VIEW}/:mode`,
  CONCEPT_VIEW: `${routeNames.CONCEPT_VIEW}/:ownerId/:conceptId`,
  CONCEPT_VIEW_MODE: `${routeNames.CONCEPT_VIEW}/:ownerId/:conceptId/:mode`,
  CONCEPT_PLAY: `${routeNames.CONCEPT_PLAY}/:ownerId/:conceptId`,
  NOTIFICATIONS: `${routeNames.NOTIFICATIONS}`,
  SUBMISSIONS: `/${routeNames.SUBMISSIONS}`,
  TEST: `/${routeNames.TEST}`
};
