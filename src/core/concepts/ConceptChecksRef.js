import { makeRefWrapper } from 'src/firebaseUtil';
import _ from 'lodash';

export const ConceptReferenceType = {
  i: 'img',
  l: 'link',
  s: 'googleSearch',
  gi: 'googleImage',
  v: 'googleVideo'
};

export function parseConceptReferences(txt) {
  if (!txt) return null;

  const refs = {};
  const lines = txt.split('\n');
  for (let i = 0; i < lines.length; ++i) {
    let line = lines[i].trim();
    if (line.length === 0 || line.startsWith('#')) {
      // ignore empty and comment lines
      continue;
    }

    const idx = line.indexOf(' ');
    const type = line.substring(0, idx);
    const data = line.substring(idx + 1);

    const typeName = ConceptReferenceType[type];
    if (!typeName) {
      console.error('line "' + line + '" does not start with valid type: ' + type + ' - valid: ' +
        Object.keys(ConceptReferenceType).join(', '));
      continue;
    }

    let arr = refs[type];
    if (!arr) {
      arr = refs[type] = [];
    }
    arr.push(data);
  }
  return refs;
}

const ConceptChecksRef = makeRefWrapper({
  pathTemplate: '/conceptChecks',
  updatedAt: null,

  children: {
    ofConcept: {
      pathTemplate: '$(conceptId)',

      children: {
        conceptCheck: {
          pathTemplate: '$(conceptCheckId)',
          updatedAt: 'updatedAt',

          children: {
            title_en: 'title_en',
            title_zh: 'title_zh',
            num: 'num',
            responseTypeId: 'responseTypeId',
            references: 'references',
            referencesRaw: 'referencesRaw'
          }
        }
      }
    }
  }
});

export default ConceptChecksRef;