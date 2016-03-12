
export default function cognitoSyncToPromise($q, dataSet) {
  return $q((resolve, reject) => {
    dataSet.synchronize({
      onSuccess: function (dataSet, newRecords) {
        resolve({dataSet, newRecords});
      },

      onFailure: function (err) {
        reject(err);
      },

      onConflict: function (dataSet, conflicts, callback) {
        const resolved = conflicts.map(conflict => conflict.resolveWithRemoteRecord());
        dataSet.resolve(resolved, () => resolve({dataSet, conflicts}));
      },

      onDatasetDeleted: function (dataSet, dataSetName, callback) {
        resolve(callback(true))
      },

      onDatasetMerged: function (dataSet, dataSetNames, callback) {
        resolve(callback(true));
      }
    })
  });
}