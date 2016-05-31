const syncsInProgress = {};

export {syncsInProgress};

/**
 * Calls synchronize on a cognito dataset and returns a promise that will resolve with new records when it 
 * completes. Subsequent calls to sync a dataset while the first is still in progress will return the original
 * promise.
 */
export default function cognitoSyncToPromise($q, dataSet, force) {
  if (force) {
    delete syncsInProgress[dataSet.datasetName];
  }

  if (!syncsInProgress[dataSet.datasetName]) {
    syncsInProgress[dataSet.datasetName] = $q((resolve, reject) => {
      dataSet.synchronize({
        onSuccess: function (dataSet, newRecords) {
          resolve({dataSet, newRecords});
        },

        onFailure: function (err) {
          console.error(err);

          reject(err);
        },

        onConflict: function (dataSet, conflicts, callback) {
          const resolved = conflicts.map(conflict => conflict.resolveWithRemoteRecord());

          if (conflicts && conflicts.length) {
            console.log('Conflicts encountered: ' + conflicts);
          }

          dataSet.resolve(resolved, () => resolve({dataSet, conflicts}));
        },

        onDatasetDeleted: function (dataSet, dataSetName, callback) {
          resolve(callback(true))
        },

        onDatasetMerged: function (dataSet, dataSetNames, callback) {
          resolve(callback(true));
        }
      })
    }).finally(() => {
      delete syncsInProgress[dataSet.datasetName];
    });
  }

  return syncsInProgress[dataSet.datasetName];
};
