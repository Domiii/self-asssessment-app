

function addConceptProgress(allProgress, concepts, checkResponses, dstConceptId, srcConceptId) {
  let conceptProgress = allProgress[dstConceptId];
  if (!conceptProgress) {
    allProgress[dstConceptId] = conceptProgress = { nTotal: 0, nCurrent: 0 };
  }

  const srcConcept = concepts[srcConceptId];
  if (!srcConcept) {
    console.error('referenced concept does not exist: ' + srcConceptId);
    return;
  }

  conceptProgress.nTotal += srcConcept.nChecks;
  conceptProgress.nCurrent += _.sum(_.map(checkResponses[srcConceptId], response => response.progress || 0));
}

export function computeAllChecksProgress(concepts, checkResponses) {
  const allProgress = {};
  const childCounts = _.countBy(concepts, 'parentId');
  let queue = _.keys(_.filter(concepts, (concept, conceptId) => !childCounts[conceptId]));

  // bottom-to-top BFS
  while (queue) {
    for (const conceptId in queue) {
      const concept = concepts[conceptId];

      // compute own stats
      addConceptProgress(allProgress, concepts, checkResponses, conceptId, concept);
      if (concept.parentId) {
        // add to parent stats
        addConceptProgress(allProgress, concepts, checkResponses, concept.parentId, concept);
      }
    }
    queue = _.uniq(_.map(queue, 'parentId'));
  }

  console.log(allProgress);
  return allProgress;
}