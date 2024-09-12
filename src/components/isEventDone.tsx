export const isEventDone = (eventData: any): boolean => {
  const inDone = eventData.assignedToInDone || false;
  const outDone = eventData.assignedToOutDone || false;
  
  const extraFeaturesDone = Array.isArray(eventData.extraFeatures)
    ? eventData.extraFeatures.every((feature: any) => feature.done)
    : false;

  return inDone && outDone && extraFeaturesDone; // Only mark done if all parts are done
};
