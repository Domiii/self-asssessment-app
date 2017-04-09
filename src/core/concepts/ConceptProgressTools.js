

function addConceptProgress(allProgress, concepts, checkResponses, dstConceptId, srcConceptId) {
  let conceptProgress = allProgress[dstConceptId];
  if (!conceptProgress) {
    allProgress[dstConceptId] = conceptProgress = { nTotal: 0, nCurrent: 0 };
  }

  const srcConcept = concepts[srcConceptId];
  if (!srcConcept) {
    console.error('referenced concept does not exist: ' + srcConceptId);
    debugger;
    return;
  }

  conceptProgress.nTotal += srcConcept.nChecks || 0;
  conceptProgress.nCurrent += (checkResponses && checkResponses[srcConceptId] && 
    _.sum(_.map(checkResponses[srcConceptId], response => response.progress || 0))) ||
    0;

  conceptProgress.progress = conceptProgress.nCurrent / conceptProgress.nTotal;

  // conceptProgress.srcConceptId = srcConceptId;
  // conceptProgress.dstConceptId = dstConceptId;  
  // console.log(JSON.stringify(conceptProgress));
}

export function computeAllChecksProgress(concepts, checkResponses) {
  const allProgress = {};
  const childCounts = _.countBy(concepts, 'parentId');
  let queue = _.filter(_.keys(concepts), 
    conceptId => !childCounts[conceptId]);

  // bottom-to-top BFS
  while (queue.length) {
    for (let i = 0; i < queue.length; ++i) {
      const conceptId = queue[i];
      const concept = concepts[conceptId];

      // compute own stats
      addConceptProgress(allProgress, concepts, checkResponses, conceptId, conceptId);
      if (concept.parentId) {
        // add to parent stats
        addConceptProgress(allProgress, concepts, checkResponses, concept.parentId, conceptId);
      }
    }
    queue = _.filter(_.uniq(_.map(queue, 
      id => concepts[id] && concepts[id].parentId)), conceptId => !!conceptId);
  }
  return allProgress;
}