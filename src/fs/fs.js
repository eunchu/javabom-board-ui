import _ from "underscore";

/**
 * @namespace F
 * @description 함수형 유틸리티 함수의 네임스페이스
 */
const F = {};

/**
 * @namespace L
 * @description 지연 평가로 동작하는 함수의 네임스페이스
 */
const L = {};

/**
 * @namespace F
 * @description 동시성 평가로 동작하는 함수의 네임스페이스
 */
const C = {};

const nothing = Symbol("[MONAD|NOTHING]");

F.noop = () => {};
L.noop = function*() {};

F.identity = a => a;

F.not = a => !a;

F.constant = a => _ => a;

F.maybe = f => a => (a == null || a === nothing ? a : f(a));

F.curry = f => (a, ...bs) => (bs.length ? f(a, ...bs) : (...bs) => f(a, ...bs));

F.tryCatch = (exec, fallback, ...args) => {
  try {
    return exec(...args);
  } catch (error) {
    return fallback(error, ...args);
  }
};

const baseGet = (selector, obj) => {
  if (typeof selector === "string") {
    let result = obj;
    for (const sel of selector.split(/\s*->\s*/)) {
      result = result[sel];
    }
    return result;
  }

  return obj[selector];
};
F.getLeft = F.curry((obj, selector) =>
  F.tryCatch(baseGet, F.noop, selector, obj)
);
F.getRight = F.curry((selector, obj) =>
  F.tryCatch(baseGet, F.noop, selector, obj)
);

F.setLeft = F.curry((obj, [k, v]) => ((obj[k] = v), obj)); // eslint-disable-line no-sequences
F.setRight = F.curry(([k, v], obj) => ((obj[k] = v), obj)); // eslint-disable-line no-sequences
const baseImSet = (selector, obj, value) => {
  if (typeof selector === "string") {
    const sels = selector.split(/\s*->\s*/);
    const last = sels.pop();
    const clone = Array.isArray(obj) ? obj.slice() : Object.assign({}, obj);

    let prev = clone;
    for (const sel of sels) {
      const cur = prev[sel];
      const clone = Array.isArray(cur) ? cur.slice() : Object.assign({}, cur);
      F.setLeft(prev, [sel, clone]);
      prev = clone;
    }

    F.setLeft(prev, [last, value]);
    return clone;
  }

  const clone = Array.isArray(obj) ? obj.slice() : Object.assign({}, obj);
  F.setLeft(clone, [selector, value]);
  return clone;
};
F.imSetLeft = F.curry((obj, [selector, value]) =>
  F.tryCatch(baseImSet, F.constant(obj), selector, obj, value)
);
F.imSetRight = F.curry(([selector, value], obj) =>
  F.tryCatch(baseImSet, F.constant(obj), selector, obj, value)
);
const baseMSet = (selector, obj, value) => {
  if (typeof selector === "string") {
    const sels = selector.split(/\s*->\s*/);
    const last = sels.pop();

    let prev = obj;
    for (const sel of sels) prev = prev[sel];

    prev[last] = value;

    return obj;
  }

  obj[selector] = value;
  return obj;
};
F.mSetLeft = F.curry((obj, [selector, value]) =>
  F.tryCatch(baseMSet, F.constant(obj), selector, obj, value)
);
F.mSetRight = F.curry(([selector, value], obj) =>
  F.tryCatch(baseMSet, F.constant(obj), selector, obj, value)
);

F.isNullable = a => a == null;
F.isIterable = iter =>
  !F.isNullable(iter) && typeof iter[Symbol.iterator] === "function";
F.isIterableExceptString = iter =>
  F.isIterable(iter) && typeof iter !== "string";
F.toIter = iter => (F.isIterable(iter) ? iter[Symbol.iterator]() : L.noop());
L.singleToIter = function*(v) {
  if (F.isIterableExceptString(v)) yield* v[Symbol.iterator]();
  else yield v;
};

const baseDelete = (obj, selector) => {
  if (typeof selector === "string") {
    const sels = selector.split(/\s*->\s*/);
    const last = sels.pop();
    const clone = Array.isArray(obj) ? obj.slice() : Object.assign({}, obj);

    let prev = clone;
    for (const sel of sels) {
      const cur = prev[sel];
      const clone = Array.isArray(cur) ? cur.slice() : Object.assign({}, cur);
      F.setLeft(prev, [sel, clone]);
      prev = clone;
    }

    delete prev[last];
    return clone;
  }

  const clone = Array.isArray(obj) ? obj.slice() : Object.assign({}, obj);
  delete clone[selector];
  return clone;
};
const baseDeleteMultiple = (obj, selectors) => {
  if (F.isIterableExceptString(selectors)) {
    for (const selector of selectors) obj = baseDelete(obj, selector);
    return obj;
  }

  return baseDelete(obj, selectors);
};
F.deleteLeft = F.curry((obj, selectors) =>
  F.tryCatch(baseDeleteMultiple, F.constant(obj), obj, selectors)
);
F.deleteRight = F.curry((selectors, obj) =>
  F.tryCatch(baseDeleteMultiple, F.constant(obj), obj, selectors)
);

F.callLeft = F.curry((f, a) => f(a));
F.callRight = F.curry((a, f) => f(a));

F.thenLeft = F.curry((f, a) => (a instanceof Promise ? a.then(f) : f(a)));
F.thenRight = F.curry((a, f, g) =>
  a instanceof Promise ? a.then(f, g) : f(a)
);

F.catchLeft = F.curry((f, a) => (a instanceof Promise ? a.catch(f) : a));
F.catchRight = F.curry((a, f) => (a instanceof Promise ? a.catch(f) : a));

F.catchNoop = ([...arr]) => (
  // eslint-disable-next-line no-sequences
  arr.forEach(a => (a instanceof Promise ? a.catch(F.noop) : a)), arr
);

L.take = F.curry(function*(l, iter) {
  iter = F.toIter(iter);

  let cur;
  while (l && !(cur = iter.next()).done) {
    const a = cur.value;
    // eslint-disable-next-line no-loop-func, no-sequences
    if (a instanceof Promise) yield a.then(a => (--l, a));
    else yield (--l, a);
  }
});
F.take = F.curry((l, iter) => {
  iter = L.take(l, iter);

  const res = [];

  return (function recur() {
    let cur;
    while (!(cur = iter.next()).done) {
      const a = cur.value;

      if (a instanceof Promise)
        return a
          .then(a => {
            res.push(a);
            return recur();
          })
          .catch(error =>
            error === nothing ? recur() : Promise.reject(error)
          );

      res.push(a);
    }
    return res;
  })();
});
C.take = F.curry((l, iter) => F.take(l, F.catchNoop(iter)));

L.takeAll = L.take(Infinity);
F.takeAll = F.take(Infinity);
C.takeAll = C.take(Infinity);

F.takeHead = iter => F.thenRight(F.take(1, iter), ([h]) => h);

const reduceF = (f, acc, cur) =>
  cur instanceof Promise
    ? cur
        .then(cur => f(acc, cur))
        .catch(error => (error === nothing ? acc : Promise.reject(error)))
    : f(acc, cur);
F.reduce = F.curry((f, acc, iter) => {
  if (!iter) return F.reduce(f, F.takeHead((iter = F.toIter(acc))), iter);

  iter = F.toIter(iter);

  return F.thenRight(
    acc,
    function recur(acc) {
      let cur;
      while (!(cur = iter.next()).done) {
        acc = reduceF(f, acc, cur.value);
        if (acc instanceof Promise) return acc.then(recur);
      }
      return acc;
    },
    error =>
      error === nothing
        ? F.reduce(f, F.takeHead(iter), iter)
        : Promise.reject(error)
  );
});
C.reduce = F.curry((f, acc, iter) =>
  iter ? F.reduce(f, acc, F.catchNoop(iter)) : F.reduce(f, F.catchNoop(acc))
);

F.go = (a, ...fs) => (fs.length ? F.reduce(F.callRight, a, fs) : a);

F.pipe = (f, ...fs) => (...args) => (!f ? args : F.go(f(...args), ...fs));

L.takeWhile = F.curry(function*(f, iter) {
  iter = F.toIter(iter);

  let ok = false;
  let cur;
  while (!(cur = iter.next()).done) {
    const a = cur.value;
    ok = F.thenLeft(f, a);
    if (ok instanceof Promise)
      // eslint-disable-next-line no-loop-func, no-cond-assign
      yield ok.then(_ok => ((ok = _ok) ? a : Promise.reject(nothing)));
    else if (ok) yield a;
    if (!ok) break;
  }
});
F.takeWhile = F.curry(
  F.pipe(
    L.takeWhile,
    F.takeAll
  )
);
C.takeWhile = F.curry((f, iter) => F.takeWhile(f, F.catchNoop(iter)));

F.tap = (...fs) => a => F.go(a, ...fs, _ => a);
C.tap = (...fs) => a => {
  F.go(a, ...fs);
  return a;
};

F.each = F.curry((f, iter) =>
  F.thenRight(F.reduce((_, a) => f(a), null, iter), _ => iter)
);
C.each = F.curry((f, iter) => F.each(f, F.catchNoop(iter)));

L.map = F.curry(function*(f, iter) {
  for (const a of F.toIter(iter)) yield F.thenLeft(f, a);
});
F.map = F.curry(
  F.pipe(
    L.map,
    F.takeAll
  )
);
C.map = F.curry(
  F.pipe(
    L.map,
    C.takeAll
  )
);

const baseAll = map => (...fs) => (...args) => map(f => f(...args), fs);
L.all = baseAll(L.map);
F.all = baseAll(F.map);
C.all = baseAll(C.map);

L.filter = F.curry(function*(f, iter) {
  for (const a of F.toIter(iter)) {
    const b = F.thenRight(a, f);
    if (b instanceof Promise)
      yield b.then(b => (b ? a : Promise.reject(nothing)));
    else if (b) yield a;
  }
});
F.filter = F.curry(
  F.pipe(
    L.filter,
    F.takeAll
  )
);
C.filter = F.curry(
  F.pipe(
    L.filter,
    C.takeAll
  )
);

F.find = F.curry(
  F.pipe(
    L.filter,
    F.takeHead
  )
);

L.reject = F.curry((f, iter) =>
  L.filter(
    F.pipe(
      f,
      F.not
    ),
    iter
  )
);
F.reject = F.curry(
  F.pipe(
    L.reject,
    F.takeAll
  )
);
C.reject = F.curry(
  F.pipe(
    L.reject,
    C.takeAll
  )
);

L.baseFlat = F.curry(function*(f, iter) {
  for (const a of F.toIter(iter)) {
    if (F.isIterableExceptString(a)) yield* f(a);
    else yield a;
  }
});
F.baseFlat = F.curry(
  F.pipe(
    L.baseFlat,
    F.takeAll
  )
);

L.flatten = L.baseFlat(F.identity);
F.flatten = F.baseFlat(F.identity);

L.deepFlat = L.baseFlat(L.deepFlat);
F.deepFlat = F.pipe(
  L.deepFlat,
  F.takeAll
);

L.flatMap = F.curry(
  F.pipe(
    L.map,
    L.flatten
  )
);
F.flatMap = F.curry(
  F.pipe(
    L.flatMap,
    F.takeAll
  )
);

L.entries = function*(obj) {
  for (const k in obj) if (obj.hasOwnProperty(k)) yield [k, obj[k]];
};
F.entries = F.pipe(
  L.entries,
  F.takeAll
);

L.mapObject = F.curry(function*(f, obj) {
  const iter = L.entries(obj);

  for (const [k, v] of iter) yield f(v, k, obj);
});
F.mapObject = F.curry((f, obj) => {
  const iter = L.entries(obj);

  const res = {};

  return (function recur() {
    let cur;
    while (!(cur = iter.next()).done) {
      const [k, v] = cur.value;
      const a = f(v, k, obj);

      if (a instanceof Promise)
        return a
          .then(a => {
            res[k] = a;
            return recur();
          })
          .catch(error =>
            error === nothing ? recur() : Promise.reject(error)
          );

      res[k] = a;
    }
    return res;
  })();
});

L.values = L.mapObject(F.identity);
F.values = F.pipe(
  L.values,
  F.takeAll
);

L.keys = L.mapObject(([v, k]) => k);
F.keys = F.pipe(
  L.keys,
  F.takeAll
);

L.valueIndex = function*(iter) {
  let i = -1;

  for (const a of F.toIter(iter)) {
    yield [a, ++i];
  }
};

F.trampoline = (f, ...args) => {
  if (typeof f !== "function") return f;

  let result = f(...args);

  while (typeof result === "function") result = result();

  return result;
};

/* ======= LEGACY ======= */

/**
 * @function _maybe
 * @param {function} f
 * @return {function} null safe function
 * @description
 *   인자로 받은 값을 null-안전한 형태로 변환
 *   새로 반환하는 함수는 인자로 nullable한 값이 들어오면 해당 인자를 그대로 반환하고
 *   nullable한 값이 아닌 경우에는 함수에 해당 인자를 넣어 실행한 값을 반환함
 *   인자 1개인 함수만 사용가능
 */
export const _maybe = f => arg => (arg == null ? arg : f(arg));

/**
 * @function _then
 * @param {function} f
 * @param {any} v
 * @return {function|promise|any}
 * @description
 *   "Promise.then" 메소드의 함수 버전
 *   인자로 함수와 값 2개를 입력하는 경우,
 *   해당 값이 Promise이면 v.then에 함수 f를 연결함
 *   인자로 함수 하나만 받은 경우, curry된 함수 반환함
 *   반환된 함수는 값 v를 받아서 위와 동일하게 동작함
 */
export const _then = F.curry((f, v) =>
  v instanceof Promise ? v.then(f) : f(v)
);

/**
 * @function _catch
 * @param {function} f
 * @param {any} v
 * @return {function|promise|any}
 * @description
 *   "Promise.catch" 메소드의 함수 버전
 *   동작 원리는 _then 함수와 동일
 */
export const _catch = F.curry((f, v) =>
  v instanceof Promise ? v.catch(f) : f(v)
);

/**
 * @function _take
 * @param {number} l non negative integer
 * @param {iterable} iter
 * @return {array}
 * @description iterable의 원소를 주어진 길이만큼 평가하여 배열에 담아 반환
 */
export const _take = F.curry((l, iter) => {
  const res = [];

  if (l === 0) return res;

  for (const a of iter) {
    res.push(a);
    if (res.length === l) return res;
  }

  return res;
});

/**
 * @function _takeAll
 * @param {iterable}
 * @return {array}
 * @description iterable의 원소를 모두 평가한 배열 반환
 */
export const _takeAll = _take(Infinity);

/**
 * @function _reduce
 * @param {function} f
 * @param {any} acc
 * @param {iterable} iter
 * @return {any} accumulated value
 */
export const _reduce = F.curry((f, acc, iter) => {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }

  for (const a of iter) {
    acc = f(acc, a);
  }

  return acc;
});

/**
 * @function _pipe
 * @param {function} f first function
 * @param  {...function} fs rest functions
 * @return {function} 파이프라이닝 된 함수
 * @description
 *   (실행인자 -> 함수1(실행인자)) -> 함수2(함수1의 반환값) -> 함수3(함수2의 반환값) -> ...
 */
export const _pipe = (f, ...fs) => (...args) =>
  _reduce(F.callRight, f(...args), fs);

/**
 * @function _go
 * @param {any} v 시작값
 * @param  {...function} fs 함수 목록
 * @return {any} 모든 함수를 순차적으로 실행한 결과값
 * @description
 *   시작값 -> 함수1(시작값) -> 함수2(함수1의 반환값) -> 함수3(함수2의 반환값) -> ...
 */
export const _go = (v, ...fs) => _reduce(F.callRight, v, fs);

/**
 * @function map
 * @param {function} f
 * @param {iterable} iter
 * @return {array}
 */
export const _map = F.curry(_pipe(L.map, _takeAll));

/**
 * @namespace L
 * @function singleToIter
 * @param {any} v
 * @return {generator}
 */

/**
 * @function _trampoline
 * @param {function} f
 * @param  {...any} args
 * @return {any} all recursive resolved result
 * @description
 *   재귀 함수를 끝까지 실행시켜 주는 함수
 *   콜스택이 넘치는 경우를 방지하기 위한 함수
 *   실행할 준비를 마친 함수를 반환하는 형태로 재귀함수를 작성하고
 *   해당 재귀함수와 초기 인자를 넣어주면 재귀함수의 실행 결과가 함수가 아닐 때까지 반복하여 실행
 *   리턴값이 함수가 아닌 경우 반복을 종료하고 해당 리턴값 반환
 */
export const _trampoline = (f, ...args) => {
  if (typeof f !== "function") return f;

  let result = f.apply(f, args);

  while (
    result &&
    Object.prototype.toString.call(result) === "[object Function]"
  ) {
    result = result();
  }

  return result;
};

/**
 * @function _mapUnion
 * @param {array} list list for map
 * @param {function} f
 * @param {array} base base for union
 * @return {array}
 * @description
 *   map과 union 함수의 결합 버전
 *   주어진 list를 함수 f를 이용해 map 하고
 *   그 결과를 base에 union해서 반환
 */
export const _mapUnion = (list, f, base) =>
  _go(list, _.partial(_.map, _, f), _.partial(_.union, base));

/**
 * @function _indexByExtend
 * @param {array} arr array for indexBy
 * @param {function} f
 * @param {object} base based object for extend
 * @return {object}
 * @description
 *   indexBy와 extend 함수의 결합 버전
 *   주어진 array를 함수 f를 이용해 indexBy 하고
 *   그 결과를 base object에 extend함
 */
export const _indexByExtend = (arr, f, base) =>
  _go(arr, _.partial(_.indexBy, _, f), _.partial(_.extend, {}, base));

/**
 * @function _singleToArray
 * @param {any} v
 * @return {array}
 * @description
 *   주어진 인자 v가 배열일 경우에는 그대로 반환하고
 *   배열인 아닌 경우에는 배열에 담아서 반환
 */
export const _singleToArray = v => (_.isArray(v) ? v : [v]);

export { _, F, L, C, nothing };
