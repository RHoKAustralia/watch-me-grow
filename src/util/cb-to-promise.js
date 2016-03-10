var slice = Array.prototype.slice;
export default function callBackToPromise($q, fn) {
  var ctx = this;
  var outerArgs = arguments;

  return $q(function (resolve, reject) {
    const args = slice.call(outerArgs, 2).concat([
      function (err, res) {
        if (err) return reject(err);
        if (arguments.length > 2) res = slice.call(arguments, 1);
        resolve(res);
      }
    ]);

    fn.apply(ctx, args);
  });
};