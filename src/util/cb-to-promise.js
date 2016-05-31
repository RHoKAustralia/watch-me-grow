const slice = Array.prototype.slice;

/**
 * Turns a callback-based async call into an angular promise.
 * 
 * @param $q Angular $q
 * @param fn The function to call - should accept a callback as its final argument, with the callback taking an error
 *           as the first argument and the result as the second.
 * @param others - anything after the first two arguments will be applied to fn
 */
export default function callBackToPromise($q, fn) {
  const ctx = this;
  const outerArgs = arguments;

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