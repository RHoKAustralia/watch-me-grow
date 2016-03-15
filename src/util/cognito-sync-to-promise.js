const syncsInProgress = {};

export {syncsInProgress};

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
